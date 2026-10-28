"use client";

import { useState, type ReactNode } from "react";
import { Send, Loader2, Bot, BookOpenCheck, Clock } from "lucide-react";

// Development comparison of the production chatbot (/api/constitution-chat, Gemini only) with the
// retrieval-grounded chatbot (/api/rag-chat), RAG_IMPLEMENTATION_GUIDE.md Phase 7.

interface Citation {
  label?: string | null;
  item_id?: string | null;
  source_type: string;
  title: string;
  number?: string | null;
  act_or_case_name?: string | null;
  source_edition?: string | null;
  status?: string | null;
}

interface PanelState {
  loading: boolean;
  answer?: string;
  error?: string;
  citations?: Citation[];
  ms?: number;
}

const SUGGESTED = [
  "How do I file an FIR?",
  "What is IPC 302 now?",
  "My employer has not paid my salary for 3 months",
  "Was Article 31 removed?",
  "Can police arrest me without telling me why?",
  "How do I file an RTI application?",
];

// Model answers are rendered as React text, never as HTML, so nothing in an answer can run as markup.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*\s](?:[^*]*[^*\s])?\*|\[S\d+\])/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("***") && part.endsWith("***") && part.length > 6) {
      return <strong key={i} className="font-semibold italic text-blue-800">{part.slice(3, -3)}</strong>;
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i} className="font-semibold text-blue-800">{part.slice(2, -2)}</strong>;
    }
    if (part.length > 2 && /^\*[^*].*\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (/^\[S\d+\]$/.test(part)) {
      return (
        <sup key={i} className="ml-0.5 rounded bg-emerald-100 px-1 text-[10px] font-semibold text-emerald-800">
          {part.slice(1, -1)}
        </sup>
      );
    }
    return part;
  });
}

function AnswerText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  // Indented bullets become sub-items of the bullet above them (one level, as the models produce).
  let bullets: { text: string; children: string[] }[] = [];
  const flushBullets = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="ml-4 list-disc space-y-1">
          {bullets.map((b, i) => (
            <li key={i}>
              {renderInline(b.text)}
              {b.children.length > 0 && (
                <ul className="ml-4 mt-1 list-[circle] space-y-1">
                  {b.children.map((c, j) => <li key={j}>{renderInline(c)}</li>)}
                </ul>
              )}
            </li>
          ))}
        </ul>
      );
      bullets = [];
    }
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      const indented = /^\s{2,}/.test(raw);
      if (indented && bullets.length) bullets[bullets.length - 1].children.push(bullet[1]);
      else bullets.push({ text: bullet[1], children: [] });
      continue;
    }
    flushBullets();
    if (!line) continue;
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push(<hr key={`hr-${blocks.length}`} className="border-gray-200" />);
    } else if (line.startsWith("#")) {
      blocks.push(
        <h4 key={`h-${blocks.length}`} className="mt-2 font-bold text-gray-900">
          {renderInline(line.replace(/^#+\s*/, ""))}
        </h4>
      );
    } else {
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
    }
  }
  flushBullets();
  return <div className="space-y-2 text-sm leading-relaxed text-gray-700">{blocks}</div>;
}

function sourceName(c: Citation): string {
  if (c.source_type === "article") return `${c.act_or_case_name}, Article ${c.number}: ${c.title}`;
  if (c.source_type === "act_section" && c.number) return `${c.act_or_case_name}, Section ${c.number}: ${c.title}`;
  return c.act_or_case_name || c.title;
}

function Panel({ title, subtitle, state, children }: {
  title: string;
  subtitle: string;
  state: PanelState;
  children?: ReactNode;
}) {
  return (
    <section className="flex min-h-[300px] flex-col rounded-xl border border-blue-100 bg-white shadow-md">
      <header className="flex items-start justify-between gap-2 border-b border-blue-50 px-4 py-3">
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        {state.ms !== undefined && (
          <span className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-500">
            <Clock className="h-3 w-3" /> {(state.ms / 1000).toFixed(1)} s
          </span>
        )}
      </header>
      <div className="flex-1 space-y-4 p-4">
        {state.loading && (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Waiting for an answer…
          </p>
        )}
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.answer && <AnswerText text={state.answer} />}
        {children}
      </div>
    </section>
  );
}

async function ask(url: string, question: string): Promise<{ data: any; ms: number }> {
  const started = performance.now();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await response.json().catch(() => ({ success: false, error: `HTTP ${response.status}` }));
  return { data, ms: performance.now() - started };
}

export default function RagComparison() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [baseline, setBaseline] = useState<PanelState>({ loading: false });
  const [rag, setRag] = useState<PanelState>({ loading: false });
  const busy = baseline.loading || rag.loading;

  const submit = (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    setQuestion(q);
    setInput("");
    setBaseline({ loading: true });
    setRag({ loading: true });

    // Both requests run at once; each panel fills in as its answer arrives.
    ask("/api/constitution-chat", q)
      .then(({ data, ms }) => setBaseline(data.success
        ? { loading: false, answer: data.answer, ms }
        : { loading: false, error: data.error || "The current chatbot returned an error.", ms }))
      .catch(() => setBaseline({ loading: false, error: "Could not reach the current chatbot." }));

    ask("/api/rag-chat", q)
      .then(({ data, ms }) => setRag(data.success
        ? { loading: false, answer: data.answer, citations: data.citations || [], ms }
        : { loading: false, error: data.error || "The RAG service returned an error.", ms }))
      .catch(() => setRag({ loading: false, error: "Could not reach the RAG service." }));
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => { e.preventDefault(); submit(input); }}
        className="flex gap-2 rounded-xl border border-blue-100 bg-white p-3 shadow-md"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question to both chatbots…"
          className="flex-1 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Ask both
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED.map((q) => (
          <button
            key={q}
            type="button"
            disabled={busy}
            onClick={() => submit(q)}
            className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs text-gray-700 hover:border-blue-400 hover:text-blue-700 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {question && (
        <p className="text-sm text-gray-600">
          Question: <span className="font-semibold text-gray-900">{question}</span>
        </p>
      )}

      {question && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Current chatbot" subtitle="Gemini only, answers from the model's memory" state={baseline} />
          <Panel title="RAG chatbot" subtitle="Answers from official legal texts, with sources" state={rag}>
            {rag.citations && rag.citations.length > 0 && (
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-emerald-800">
                  <BookOpenCheck className="h-4 w-4" /> Sources cited
                </p>
                <ol className="space-y-1 text-xs text-gray-700">
                  {rag.citations.map((c) => (
                    <li key={c.item_id || c.label}>
                      <span className="font-semibold text-emerald-800">{c.label}</span> {sourceName(c)}
                      {c.status && c.status !== "active" && (
                        <span className="ml-1 rounded bg-amber-100 px-1 font-semibold uppercase text-amber-800">{c.status}</span>
                      )}
                      {c.source_edition && <span className="text-gray-500"> ({c.source_edition})</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {rag.answer && rag.citations?.length === 0 && (
              <p className="text-xs text-gray-500">No sources cited.</p>
            )}
          </Panel>
        </div>
      )}

      {!question && (
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Bot className="h-4 w-4" /> Ask a question to compare the two chatbots side by side.
        </p>
      )}
    </div>
  );
}
