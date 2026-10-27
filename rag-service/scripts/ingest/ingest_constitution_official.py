"""Ingest the official Constitution of India PDF, English text (RAG_IMPLEMENTATION_GUIDE.md Phase 2.1).

Expects the Legislative Department's diglot pocket edition in data/raw/constitution_official/:
facing pages, Hindi on odd pages and English on even pages, footnotes below a "____" rule.
Only the English pages are read here; the edition's Hindi uses a broken font mapping.

Emits the Preamble, every article (including omitted ones, flagged `status: "omitted"`) and the
Schedules. Footnote markers in the text ("2[21A. ...", "1***") are stripped and resolved to their
footnotes, which become `amendment_notes` and `amended_by`.

Usage (from rag-service/):
    python scripts/ingest/ingest_constitution_official.py
"""
import re
from pathlib import Path
from typing import Any, Dict, Iterator, List, Optional, Tuple

import fitz

from common import RAW_DIR, join_lines, visual_lines, write_part

SOURCE = "coi-official"
PDF_DIR = RAW_DIR / "constitution_official"

# Page geometry of the pocket edition (points; page is 360 x 504).
HEADER_BOTTOM = 62  # running title, Part/Schedule caption and top page numbers sit above this
PAGE_CENTRE = 180
CENTRED_MIN_X = 100  # body text starts at x <= 84; centred headings start further right

_DEVANAGARI = re.compile(r"[ऀ-ॿ]")
_RULE = re.compile(r"^\s*_{5,}\s*$", re.MULTILINE)
_PART = re.compile(r"^(?:\d{1,2}\[)?PART\s+([IVXL]+[A-Z]?)\b")
_SCHEDULE = re.compile(
    r"^(?:\d{1,2}\[)?(?:THE\s+)?(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH|TENTH|ELEVENTH|TWELFTH)\s+SCHEDULE\b"
)
_SCHEDULE_NUMBERS = {
    name: str(i + 1)
    for i, name in enumerate(
        "FIRST SECOND THIRD FOURTH FIFTH SIXTH SEVENTH EIGHTH NINTH TENTH ELEVENTH TWELFTH".split()
    )
}
# A paragraph starts with a clause/item label, an article number, a proviso or explanation, or an omission.
_PARAGRAPH_START = re.compile(r"^(?:\d{1,2}\*?\[)?(?:\(\w{1,5}\)|\d{1,5}-?[A-Z]{0,3}\.\s|Explanation|Provided|\*)")
# Heading: optional "n[" footnote marker, number, title (which may carry its own "n[" marker), then
# an em dash (some headings use "––" or ".-").
_ARTICLE_HEAD = re.compile(
    r"^\**\s*(?:(\d{1,2})\*?\[)?(\d{1,5}-?[A-Z]{0,3})\.\s+(?:(\d{1,2})?\[)?([^—–\n]{2,200}?)\]?\.?\]?(?:\.?(?:—|––)|\.-)(.*)$",
    re.DOTALL,
)
# Article numbers never jump further than this; a bigger jump means a footnote marker is glued on.
_MAX_ARTICLE_GAP = 30
# Footnote markers: "2[" or "1*" not preceded by a word character or closing bracket.
_MARKER = re.compile(r"(?<![\w()\]/.-])(\d{1,2})(?=\[|\*)")
_TITLE_LINE = re.compile(r"^THE CONSTITUTION OF\s+INDIA$")
_FOOTNOTE = re.compile(r"^(\d{1,2})\.?\s+(.*)")
_AMENDMENT_ACT = re.compile(r"Constitution \([^)]+\) Act,\s*\d{4}")
_PAGE = "\x00"  # sentinel prefix for page-number lines inside the paragraph stream


def find_pdf() -> Path:
    pdfs = sorted(PDF_DIR.glob("*.pdf"))
    if len(pdfs) != 1:
        raise SystemExit(f"Expected exactly one PDF in {PDF_DIR}, found {len(pdfs)}.")
    return pdfs[0]


def is_english(page: fitz.Page) -> bool:
    return len(_DEVANAGARI.findall(page.get_text())) < 50


def page_lines(page: fitz.Page) -> Tuple[List[str], List[str]]:
    """Body lines (with structural headings kept as their own lines) and footnote lines of one page."""
    body: List[str] = []
    footnotes: List[str] = []
    in_footnotes = False
    for block in page.get_text("dict")["blocks"]:
        x0, y0, x1, _y1 = block["bbox"]
        text = "\n".join(t for _, t in visual_lines(block)).strip()
        if not text or text.isdigit() or y0 < HEADER_BOTTOM:
            continue
        if in_footnotes:
            footnotes.extend(text.splitlines())
            continue
        rule = _RULE.search(text)
        if rule:
            in_footnotes = True
            body.extend(text[: rule.start()].splitlines())
            footnotes.extend(text[rule.end():].splitlines())
            continue
        if x0 >= CENTRED_MIN_X and abs((x0 + x1) / 2 - PAGE_CENTRE) < 30:
            heading = join_lines(text.splitlines())
            if _PART.match(heading) or _SCHEDULE.match(heading) or heading.startswith("PREAMBLE"):
                body.append(heading)
            continue  # other centred subheadings (chapter titles etc.) are not article text
        body.extend(text.splitlines())
    return body, footnotes


def parse_footnotes(lines: List[str]) -> Dict[str, str]:
    notes: Dict[str, List[str]] = {}
    current: Optional[str] = None
    for line in lines:
        match = _FOOTNOTE.match(line.strip())
        if match and match.group(1) not in notes:
            current = match.group(1)
            notes[current] = [match.group(2)]
        elif current:
            notes[current].append(line)
    return {n: join_lines(text) for n, text in notes.items()}


def read_document(pdf: Path, first_page: int, last_page: int) -> Tuple[List[str], Dict[Tuple[int, str], str]]:
    """Paragraph stream for the English pages, plus footnotes keyed by (page, number).

    Paragraph boundaries are taken from structural labels, not from line breaks, because body
    lines are hard-wrapped. A "\\x00<page>" entry marks each page start.
    """
    doc = fitz.open(pdf)
    paragraphs: List[str] = []
    footnotes: Dict[Tuple[int, str], str] = {}
    current: List[str] = []

    def flush() -> None:
        if current:
            paragraphs.append(join_lines(current))
            current.clear()

    for index in range(first_page - 1, last_page):
        page = doc[index]
        if not is_english(page):
            continue
        body, notes = page_lines(page)
        for number, note in parse_footnotes(notes).items():
            footnotes[(index + 1, number)] = note
        flush()
        paragraphs.append(f"{_PAGE}{index + 1}")
        for line in body:
            stripped = line.strip()
            if _TITLE_LINE.match(stripped):
                continue
            if (
                _PARAGRAPH_START.match(stripped)
                or _PART.match(stripped)
                or _SCHEDULE.match(stripped)
                or stripped.startswith("PREAMBLE")
            ):
                flush()
            current.append(stripped)
    flush()
    return paragraphs, footnotes


def body_range(pdf: Path) -> Tuple[int, int]:
    """First page of the Preamble body (after the table of contents) and the page before Appendix I."""
    doc = fitz.open(pdf)
    first = last = None
    for index, page in enumerate(doc):
        if not is_english(page):
            continue
        text = page.get_text()
        if first is None and re.search(r"(?m)^\s*PREAMBLE\s*$", text) and "CONTENTS" not in text and "ARTICLES" not in text:
            first = index + 1
        if first and re.search(r"(?m)^\s*APPENDIX I\s*$", text):
            last = index
            break
    if not first or not last:
        raise SystemExit("Could not locate the Preamble body or Appendix I; is this the diglot pocket edition?")
    return first, last


def _article_key(number: str) -> Tuple[int, str]:
    match = re.match(r"(\d+)([A-Z]*)", number)
    return int(match.group(1)), match.group(2)


def _resolve_number(raw: str, last: Tuple[int, str]) -> Tuple[Optional[str], str]:
    """(article number, glued footnote marker) for a heading number, or (None, "") if it is not the
    next article. Omitted-article headings glue their marker on with no bracket: "731D" is 7 + 31D."""
    for cut in range(3):
        marker, number = raw[:cut], raw[cut:]
        if not number or number[0] == "0":
            continue
        key = _article_key(number)
        if last < key and key[0] <= last[0] + _MAX_ARTICLE_GAP:
            return number, marker
    return None, ""


class Segment:
    def __init__(self, kind: str, number: Optional[str], title: str, part: Optional[str], page: int):
        self.kind = kind
        self.number = number
        self.title = title
        self.part = part
        self.paragraphs: List[Tuple[int, str]] = []
        self.start_page = page


def segment(paragraphs: List[str]) -> Iterator[Segment]:
    """Split the paragraph stream into Preamble, article and Schedule segments."""
    page = 0
    part: Optional[str] = None
    current: Optional[Segment] = None
    last_article: Tuple[int, str] = (0, "")
    in_schedules = False

    for paragraph in paragraphs:
        if paragraph.startswith(_PAGE):
            page = int(paragraph[1:])
            continue

        schedule = _SCHEDULE.match(paragraph)
        if schedule:
            if current:
                yield current
            in_schedules = True
            number = _SCHEDULE_NUMBERS[schedule.group(1)]
            current = Segment("schedule", number, f"{schedule.group(1).title()} Schedule", None, page)
            continue

        part_match = _PART.match(paragraph)
        if part_match and not in_schedules:
            part = part_match.group(1)
            continue

        if paragraph.startswith("PREAMBLE") and current is None:
            current = Segment("preamble", None, "Preamble", None, page)
            body = paragraph[len("PREAMBLE"):].strip()
            if body:
                current.paragraphs.append((page, body))
            continue

        head = None if in_schedules else _ARTICLE_HEAD.match(paragraph)
        # "371-I" is printed with a hyphen so it is not read as a Roman numeral.
        number, glued = _resolve_number(head.group(2).replace("-", ""), last_article) if head else (None, "")
        if number:
            if current:
                yield current
            last_article = _article_key(number)
            title = head.group(4).strip("[]. ")
            current = Segment("article", number, title, part, page)
            markers = "".join(f"{m}[" for m in (head.group(1) or glued, head.group(3)) if m)
            current.paragraphs.append((page, markers + head.group(5).strip()))
            continue

        if current:
            current.paragraphs.append((page, paragraph))
    if current:
        yield current


class FootnoteResolver:
    """Resolves "ibid." footnotes to the Act named by the most recent footnote, in document order."""

    def __init__(self, footnotes: Dict[Tuple[int, str], str]):
        self.footnotes = footnotes
        self.resolved: Dict[Tuple[int, str], Tuple[str, Optional[str]]] = {}
        last_act: Optional[str] = None
        for key in sorted(footnotes, key=lambda k: (k[0], int(k[1]))):
            note = footnotes[key]
            acts = _AMENDMENT_ACT.findall(note)
            if acts:
                last_act = re.sub(r"\s+", " ", acts[-1])
                self.resolved[key] = (note, last_act)
            elif "ibid" in note and last_act:
                self.resolved[key] = (f"{note} [ibid. = {last_act}]", last_act)
            else:
                self.resolved[key] = (note, None)

    def get(self, page: int, number: str) -> Optional[Tuple[str, Optional[str]]]:
        return self.resolved.get((page, number))


def edition_date(pdf: Path) -> str:
    """The cover's "[As on 1st May, 2024]" stamp, as "As on 1st May, 2024"."""
    match = re.search(r"\[(As on [^\]]+)\]", fitz.open(pdf)[0].get_text())
    if not match:
        raise SystemExit("Edition date ('[As on ...]') not found on the cover page.")
    return re.sub(r"\s+", " ", match.group(1)).strip()


def finish(seg: Segment, resolver: FootnoteResolver, edition: str) -> Dict[str, Any]:
    texts: List[str] = []
    notes: List[str] = []
    acts: List[str] = []
    for page, paragraph in seg.paragraphs:
        for number in _MARKER.findall(paragraph):
            resolved = resolver.get(page, number)
            if resolved and resolved[0] not in notes:
                notes.append(resolved[0])
                if resolved[1] and resolved[1] not in acts:
                    acts.append(resolved[1])
        cleaned = _MARKER.sub("", paragraph)
        cleaned = re.sub(r"\*(\s*\*)+", "* * *", cleaned).strip()
        if cleaned:
            texts.append(cleaned)
    text = "\n".join(texts)

    base = {
        "act_or_case_name": "Constitution of India",
        "year": "1950",
        "original_text": text,
        "amendment_notes": notes,
        "amended_by": acts,
        "audience_level": "citizen",
        "language": "en",
        "source_dataset": SOURCE,
        "source_page": seg.start_page,
        "source_edition": edition,
    }
    if seg.kind == "preamble":
        return {**base, "id": "const-preamble", "source_type": "preamble", "title": "Preamble", "number": None}
    if seg.kind == "schedule":
        return {**base, "id": f"const-sch-{seg.number}", "source_type": "schedule", "title": seg.title, "number": None}

    omitted = bool(re.match(r"\[?(Omitted|Rep\.) by\b", text))
    return {
        **base,
        "id": f"const-art-{seg.number}",
        "source_type": "article",
        "title": seg.title,
        "number": seg.number,
        "status": "omitted" if omitted else "active",
        "topic_tags": [f"part-{seg.part}"] if seg.part else [],
    }


def main() -> None:
    pdf = find_pdf()
    first, last = body_range(pdf)
    paragraphs, footnotes = read_document(pdf, first, last)
    resolver = FootnoteResolver(footnotes)
    edition = edition_date(pdf)
    items = [finish(seg, resolver, edition) for seg in segment(paragraphs)]
    write_part(SOURCE, items)


if __name__ == "__main__":
    main()
