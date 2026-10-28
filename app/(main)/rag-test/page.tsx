import { notFound } from "next/navigation";
import ResponsiveNav from "../../components/ResponsiveNav";
import RagComparison from "../../components/RagComparison";

// Development test page (RAG_IMPLEMENTATION_GUIDE.md Phase 7). Not linked in the menu, and only
// available where the RAG service is configured; the Clerk middleware already requires sign-in.
export const dynamic = "force-dynamic";

export default function RagTestPage() {
  if (!process.env.RAG_SERVICE_URL) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ResponsiveNav currentPage="rag-test" />
      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <h1 className="font-crimson text-2xl font-bold text-gray-900 sm:text-3xl">RAG comparison (test page)</h1>
        <p className="mb-6 mt-1 max-w-3xl text-sm text-gray-600">
          Each question goes to both the current chatbot and the RAG chatbot. The RAG chatbot answers only from
          official legal texts and lists the sources it used. Legal information for awareness, not legal advice.
        </p>
        <RagComparison />
      </main>
    </div>
  );
}
