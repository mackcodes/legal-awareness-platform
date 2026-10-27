"""Ingest official Act texts from data/raw/acts/ (RAG_IMPLEMENTATION_GUIDE.md Phase 2).

Two print layouts are supported:

* "indiacode" - India Code / Legislative Department consolidated PDFs (BNS, RTI, CPC, IT Act).
  11pt body; the title is inline ("6. Request for obtaining information.—(1) ..."); footnotes are
  9pt at the foot of the page and their markers are 6-7pt superscripts, which become "{fn<n>}"
  placeholders so each footnote (commencement dates, amendments) attaches to its section.
* "gazette" - Gazette of India prints (Consumer Protection Act, BNSS, BSA). 10pt body in a column
  at x~118-478; the title is an 8pt margin note beside the section's first line. One PDF may hold
  several Acts; `act_number` ("46 OF 2023") picks one.

Each Act becomes one part file, data/corpus/parts/<key>.json. Item IDs are "<id_prefix>-s<n>", the
same as the app's acts.ts entries where the app has the Act, so merge_corpus.py lays the official
text over the app's hand-written text and keeps its plain-language summary.

Schedules are not parsed (parsing stops at "THE FIRST SCHEDULE"); this leaves out, for example,
the CPC's Orders and Rules and the BNSS classification of offences.

Usage (from rag-service/):
    python scripts/ingest/ingest_acts.py            # all Acts
    python scripts/ingest/ingest_acts.py rti cpc    # only these
"""
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import fitz

from common import RAW_DIR, join_lines, write_part

ACTS_DIR = RAW_DIR / "acts"
PAGE_CENTRE = 297  # A4 width / 2


@dataclass(frozen=True)
class ActSpec:
    key: str  # part file name
    pdf: str  # path under data/raw/acts/
    name: str  # act_or_case_name; equals acts.ts fullName where the app has the Act
    aliases: Tuple[str, ...]
    year: str
    layout: str  # "indiacode" | "gazette"
    id_prefix: str
    source_dataset: str
    act_number: Optional[str] = None  # gazette: locates the Act inside a combined PDF
    edition: Optional[str] = None  # used when neither the PDF nor its file name carries a date


ACTS = [
    ActSpec("bns", "bns/bns 6th october 2025.pdf", "Bharatiya Nyaya Sanhita, 2023",
            ("BNS", "Bharatiya Nyaya Sanhita", "Bharatiya Nyaya Sanhita, 2023", "Nyaya Sanhita"),
            "2023", "indiacode", "bns", "indiacode"),
    ActSpec("rti", "rti/RTI Act, 2005 (Amended)-English Version.pdf", "The Right to Information Act, 2005",
            ("RTI", "RTI Act", "Right to Information Act"), "2005", "indiacode", "rti-act", "indiacode"),
    ActSpec("cpc", "cpc/A190805.pdf", "The Code of Civil Procedure, 1908",
            ("CPC", "Code of Civil Procedure", "Civil Procedure Code"), "1908", "indiacode", "cpc", "indiacode"),
    ActSpec("it-act", "it_act/it_act_2000_updated.pdf", "The Information Technology Act, 2000",
            ("IT Act", "Information Technology Act"), "2000", "indiacode", "it-act", "indiacode",
            edition="As amended up to 2017"),
    ActSpec("consumer", "consumer_acts/CP Act 2019_1732700731.pdf", "The Consumer Protection Act, 2019",
            ("Consumer Protection Act", "CPA", "consumer act"), "2019", "gazette", "consumer-act", "gazette",
            act_number="35 OF 2019", edition="As enacted (9th August, 2019)"),
    ActSpec("bnss", "bsa/amended_criminal_laws.pdf", "Bharatiya Nagarik Suraksha Sanhita, 2023",
            ("BNSS", "Bharatiya Nagarik Suraksha Sanhita", "Nagarik Suraksha Sanhita"), "2023", "gazette",
            "bnss", "gazette", act_number="46 OF 2023", edition="As enacted (25th December, 2023)"),
    ActSpec("bsa", "bsa/amended_criminal_laws.pdf", "Bharatiya Sakshya Adhiniyam, 2023",
            ("BSA", "Bharatiya Sakshya Adhiniyam", "Sakshya Adhiniyam"), "2023", "gazette", "bsa", "gazette",
            act_number="47 OF 2023", edition="As enacted (25th December, 2023)"),
]

# India Code layout
IC_SUPERSCRIPT_MAX = 8.0  # footnote markers and ordinal suffixes
IC_FOOTNOTE_MAX = 9.5
IC_FOOTNOTE_TOP = 650  # footnotes sit below this y
IC_CENTRED_MIN_X = 150  # body lines start at x <= 108

# Gazette layout
GZ_HEADER_BOTTOM = 76  # page numbers and running heads sit above this
GZ_BODY_LEFT, GZ_BODY_RIGHT = 110, 482  # body column; margin notes are outside it
GZ_MARGIN_MAX = 9.0  # margin notes are 8pt, body 10pt

_MARKER_PREFIX = r"(?:\{fn\d{1,2}\}\*?)?\[?"  # "1[66A." in amended text
_IC_HEAD = re.compile(
    rf"^{_MARKER_PREFIX}(\d{{1,3}}[A-Z]{{0,2}})\.\s+([^—–]{{2,300}}?)\.?\s*(?:—|–{{1,2}}|-{{2}})\s*(.*)$", re.DOTALL
)
# Repealed/omitted sections have no dash: "48. [Execution barred in certain cases.] Rep. by ...".
_IC_OMITTED_HEAD = re.compile(
    rf"^{_MARKER_PREFIX}(\d{{1,3}}[A-Z]{{0,2}})\.\s+\[([^\]]{{2,300}})\]\.?\s*((?:Rep\.|Omitted|Repealed).*)$", re.DOTALL
)
_GZ_HEAD = re.compile(r"^(\d{1,3}[A-Z]{0,2})\.\s+(.*)$", re.DOTALL)
_PARAGRAPH_START = re.compile(
    rf"^{_MARKER_PREFIX}(?:\(\w{{1,5}}\)|\d{{1,3}}[A-Z]{{0,2}}\.(?:\s|—)|Explanation|Illustration|Provided|Exception)"
)
# The India Code BNS prints at least one heading as "255.—Title.—"; normalise to "255. Title.—".
_DASH_BEFORE_TITLE = re.compile(r"^(\d{1,3}[A-Z]?)\.\s*—\s*")
_CHAPTER = re.compile(r"^CHAPTER\s+([IVXL]+[A-Z]?)\b")
_FOOTNOTE = re.compile(r"^(\d{1,2})\.\s+(.*)")
_MARKER = re.compile(r"\{fn(\d{1,2})\}")
_SCHEDULE_START = re.compile(r"^THE (FIRST )?SCHEDULE\b")
_END_OF_ACT = re.compile(r"STATEMENT OF OBJECTS AND REASONS|Legislative Counsel|Secretary to the Govt")
_MAX_SECTION_GAP = 30
_DATE_IN_NAME = re.compile(r"(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4})")
_AS_ON = re.compile(r"\[(As on [^\]]+)\]")


def edition(spec: ActSpec, doc: fitz.Document, pdf: Path) -> str:
    """"As on <date>" from the PDF's first pages, else from the file name, else the spec."""
    for page in list(doc)[:3]:
        match = _AS_ON.search(page.get_text())
        if match:
            return re.sub(r"\s+", " ", match.group(1).replace("As on the", "As on"))
    match = _DATE_IN_NAME.search(pdf.stem)
    if match:
        day, month, year = match.group(1).split()
        return f"As on {day.lower()} {month.capitalize()}, {year}"
    if spec.edition:
        return spec.edition
    raise SystemExit(f"{spec.key}: no edition date in {pdf.name}; set ActSpec.edition.")


def _rows(block: Dict[str, Any], text_of) -> List[Tuple[float, float, str]]:
    """(y, x, text) per visual line. Justified lines come out of PyMuPDF as one "line" per word,
    so lines sharing a vertical position are merged back together."""
    rows: List[Tuple[float, List[Tuple[float, str]]]] = []
    for line in block.get("lines", []):
        x0, y0 = line["bbox"][0], line["bbox"][1]
        if rows and abs(rows[-1][0] - y0) < 2:
            rows[-1][1].append((x0, text_of(line)))
        else:
            rows.append((y0, [(x0, text_of(line))]))
    result = []
    for y, words in rows:
        words.sort()
        result.append((y, words[0][0], " ".join(t.strip() for _, t in words).replace("", "*")))
    return result


# --- page readers: each returns body lines (centred headings prefixed "\x00"), plus layout extras ---


def _ic_line_text(line: Dict[str, Any]) -> str:
    parts = []
    for span in line["spans"]:
        text = span["text"]
        if span["size"] <= IC_SUPERSCRIPT_MAX:
            if text.strip().isdigit():
                parts.append(f"{{fn{text.strip()}}}")
            continue
        parts.append(text)
    return "".join(parts)


def read_indiacode_page(page: fitz.Page) -> Tuple[List[str], List[str]]:
    """(body lines, footnote lines)."""
    body: List[str] = []
    footnotes: List[str] = []
    for block in page.get_text("dict")["blocks"]:
        lines = block.get("lines", [])
        sizes = [s["size"] for line in lines for s in line["spans"] if s["text"].strip()]
        if not sizes:
            continue
        x0, y0, x1, _ = block["bbox"]
        text = "\n".join(_ic_line_text(line) for line in lines).strip()
        if not text or text == "IndiaCode" or text.isdigit():
            continue
        if y0 > IC_FOOTNOTE_TOP and max(sizes) <= IC_FOOTNOTE_MAX:
            footnotes.extend(text.splitlines())
            continue
        if x0 >= IC_CENTRED_MIN_X and abs((x0 + x1) / 2 - PAGE_CENTRE) < 60:
            body.append("\x00" + join_lines(text.splitlines()))
            continue
        body.extend(t for _, _, t in _rows(block, _ic_line_text))
    return body, footnotes


def read_gazette_page(page: fitz.Page) -> Tuple[List[Tuple[float, str]], List[Tuple[float, str]]]:
    """((y, body line), (y, margin note line)), both in reading order."""
    body: List[Tuple[float, float, str]] = []
    margin: List[Tuple[float, str]] = []
    text_of = lambda line: "".join(s["text"] for s in line["spans"])  # noqa: E731
    for block in page.get_text("dict")["blocks"]:
        lines = block.get("lines", [])
        sizes = [s["size"] for line in lines for s in line["spans"] if s["text"].strip()]
        if not sizes:
            continue
        x0, y0, x1, _ = block["bbox"]
        if y0 < GZ_HEADER_BOTTOM:
            continue
        if max(sizes) <= GZ_MARGIN_MAX and (x0 >= GZ_BODY_RIGHT or x1 <= GZ_BODY_LEFT):
            margin.extend((y, t) for y, _, t in _rows(block, text_of))
            continue
        for y, x, text in _rows(block, text_of):
            if not text.strip() or text.strip().isdigit():
                continue
            if x >= 200 and abs((x + x1) / 2 - PAGE_CENTRE) < 60 and len(text) < 90 and text.upper() == text:
                text = "\x00" + text.strip()  # centred CHAPTER heading
            body.append((y, x, text))
    body.sort()
    return [(y, t) for y, _, t in body], sorted(margin)


def _parse_footnotes(lines: List[str]) -> Dict[str, str]:
    notes: Dict[str, List[str]] = {}
    current: Optional[str] = None
    for line in lines:
        match = _FOOTNOTE.match(line.strip())
        if match:
            current = match.group(1)
            notes[current] = [match.group(2)]
        elif current:
            notes[current].append(line)
    return {n: join_lines(t) for n, t in notes.items()}


# --- shared section assembly ---


class Assembler:
    """Builds sections from a stream of lines: paragraphs are split on structural labels and a
    paragraph that opens with the next section number starts a new section."""

    def __init__(self, layout: str):
        self.layout = layout
        self.sections: List[Dict[str, Any]] = []
        self.paragraph: List[str] = []
        self.paragraph_y: Optional[float] = None
        self.chapter: Optional[Tuple[str, str]] = None
        self.pending_chapter: Optional[str] = None
        self.last = 0

    def heading(self, text: str, page_no: int) -> None:
        self.flush(page_no)
        match = _CHAPTER.match(text)
        if match:
            self.pending_chapter = match.group(1)
        elif self.pending_chapter:
            self.chapter = (self.pending_chapter, text.title())
            self.pending_chapter = None
        elif text.rstrip(".") in ("Illustration", "Illustrations"):
            self.paragraph.append(text)
            self.flush(page_no)

    def line(self, text: str, page_no: int, y: Optional[float] = None) -> None:
        if _PARAGRAPH_START.match(text):
            self.flush(page_no)
        if not self.paragraph:
            self.paragraph_y = y
        self.paragraph.append(text)

    def flush(self, page_no: int) -> None:
        if not self.paragraph:
            return
        text = join_lines(self.paragraph)
        self.paragraph.clear()
        if self.layout == "indiacode":
            normalised = _DASH_BEFORE_TITLE.sub(r"\1. ", text)
            head = _IC_HEAD.match(normalised) or _IC_OMITTED_HEAD.match(normalised)
            number, title, body = (head.group(1), head.group(2).strip(), head.group(3)) if head else (None, None, None)
            # Re-attach a leading footnote marker ("{fn1}[66A. ...") to the body so it resolves.
            prefix = re.match(_MARKER_PREFIX, text).group(0) if head else ""
            if "{fn" in prefix:
                body = prefix + body
        else:
            head = _GZ_HEAD.match(text)
            number, title, body = (head.group(1), None, head.group(2)) if head else (None, None, None)
        if number:
            value = int(re.match(r"\d+", number).group(0))
            if self.last < value <= self.last + _MAX_SECTION_GAP or (
                value == self.last and self.sections and number != self.sections[-1]["number"]
            ):
                self.last = value
                self.sections.append({
                    "number": number,
                    "title": title,
                    "chapter": self.chapter,
                    "paragraphs": [(page_no, body.strip())],
                    "page": page_no,
                    "y": self.paragraph_y,
                })
                return
        if self.sections:
            self.sections[-1]["paragraphs"].append((page_no, text))


def _act_pages(spec: ActSpec, doc: fitz.Document) -> range:
    """Pages holding this Act: from its first section to the next Act in the file (gazette), or
    from "1. Short title" outside the arrangement of sections (India Code)."""
    if spec.layout == "gazette":
        starts = [i for i, p in enumerate(doc) if re.search(r"NO\.\s*\d+\s+OF\s+\d{4}", p.get_text())]
        mine = [i for i in starts if re.search(rf"NO\.\s*{spec.act_number.replace(' ', r'\s+')}", doc[i].get_text())]
        if not mine:
            raise SystemExit(f"{spec.key}: 'NO. {spec.act_number}' not found in {spec.pdf}.")
        later = [i for i in starts if i > mine[0]]
        return range(mine[0], later[0] if later else doc.page_count)
    start = next(
        i for i, p in enumerate(doc)
        if re.search(r"(?m)^\s*(?:\d\[)?1\.\s*Short title", p.get_text())
        and not re.search(r"(?m)ARRANGEMENT OF SECTIONS|^\s*SECTIONS\s*$", p.get_text())
    )
    return range(start, doc.page_count)


def parse(spec: ActSpec) -> List[Dict[str, Any]]:
    pdf = ACTS_DIR / spec.pdf
    doc = fitz.open(pdf)
    asm = Assembler(spec.layout)
    footnotes: Dict[Tuple[int, str], str] = {}
    margins: List[Tuple[int, float, str]] = []

    for index in _act_pages(spec, doc):
        page_no = index + 1
        if spec.layout == "indiacode":
            body, notes = read_indiacode_page(doc[index])
            for number, note in _parse_footnotes(notes).items():
                footnotes[(page_no, number)] = note
            lines = [(None, t) for t in body]
        else:
            lines, margin = read_gazette_page(doc[index])
            margins.extend((page_no, y, t) for y, t in margin)
        stop = False
        for y, line in lines:
            stripped = line.lstrip("\x00").strip()
            if _END_OF_ACT.search(stripped) or (asm.sections and _SCHEDULE_START.match(stripped)):
                stop = True
                break
            if line.startswith("\x00"):
                asm.heading(stripped, page_no)
            elif stripped:
                asm.line(stripped, page_no, y)
        asm.flush(page_no)
        if stop:
            break

    if spec.layout == "gazette":
        _attach_margin_titles(asm.sections, margins)
    stamp = edition(spec, doc, pdf)
    return [finish(spec, s, footnotes, stamp) for s in asm.sections]


def _attach_margin_titles(sections: List[Dict[str, Any]], margins: List[Tuple[int, float, str]]) -> None:
    """Give each section the margin note beside its first line: the margin lines on the same page
    from just above the section's first line down to the next section's first line."""
    starts = [(s["page"], s["y"] or 0.0, s) for s in sections]
    for index, (page, y, section) in enumerate(starts):
        next_y = next((ny for np_, ny, _ in starts[index + 1:] if np_ == page), float("inf"))
        lines = [t for p, my, t in margins if p == page and y - 4 <= my < min(next_y - 4, y + 80)]
        section["title"] = join_lines(lines).rstrip(".") or None


def finish(spec: ActSpec, section: Dict[str, Any], footnotes: Dict[Tuple[int, str], str], stamp: str) -> Dict[str, Any]:
    notes: List[str] = []
    texts = []
    for page_no, text in section["paragraphs"]:
        for number in _MARKER.findall(text):
            note = footnotes.get((page_no, number))
            if note and note not in notes:
                notes.append(note)
        texts.append(_MARKER.sub("", text).strip())
    text = "\n".join(t for t in texts if t)
    chapter = section["chapter"]
    return {
        "id": f"{spec.id_prefix}-s{section['number']}",
        "source_type": "act_section",
        "title": section["title"] or f"Section {section['number']}",
        "act_or_case_name": spec.name,
        "act_aliases": list(spec.aliases),
        "number": section["number"],
        "year": spec.year,
        "original_text": text,
        "amendment_notes": notes,
        "audience_level": "citizen",
        "topic_tags": [f"chapter-{chapter[0]}", chapter[1]] if chapter else [],
        "language": "en",
        "status": "omitted" if re.match(r"\[?(Omitted|Rep\.|Repealed)", text) else "active",
        "source_dataset": spec.source_dataset,
        "source_page": section["page"],
        "source_edition": stamp,
    }


def main() -> None:
    wanted = set(sys.argv[1:])
    unknown = wanted - {s.key for s in ACTS}
    if unknown:
        raise SystemExit(f"Unknown Act keys {sorted(unknown)}; known: {[s.key for s in ACTS]}")
    for spec in ACTS:
        if not wanted or spec.key in wanted:
            write_part(spec.key, parse(spec))


if __name__ == "__main__":
    main()
