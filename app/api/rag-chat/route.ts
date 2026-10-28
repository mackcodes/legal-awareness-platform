import { NextRequest, NextResponse } from 'next/server';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';
const RAG_SHARED_SECRET = process.env.RAG_SHARED_SECRET || '';

// A free Hugging Face Space sleeps when idle and takes up to about a minute to wake up.
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { question, language, audienceLevel, tenantId } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${RAG_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(RAG_SHARED_SECRET ? { 'X-RAG-Secret': RAG_SHARED_SECRET } : {}),
      },
      body: JSON.stringify({
        question,
        language: language || 'en',
        audience_level: audienceLevel || 'citizen',
        tenant_id: tenantId || null,
      }),
      signal: AbortSignal.timeout(58000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RAG service error:', response.status, errorText);
      return NextResponse.json(
        {
          success: false,
          error: response.status === 401
            ? 'RAG service rejected the request (check RAG_SHARED_SECRET).'
            : 'RAG service request failed',
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: data.success,
      answer: data.answer,
      citations: data.citations,
      retrievedChunks: data.retrieved_chunks,
      intent: data.intent,
      latencyMs: data.latency_ms,
      error: data.error,
      question,
    });
  } catch (error) {
    console.error('Error forwarding to RAG service:', error);
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return NextResponse.json(
      {
        success: false,
        error: timedOut
          ? 'The RAG service is taking too long (it may be waking up). Please try again in a minute.'
          : 'Failed to reach RAG service. Is it running on RAG_SERVICE_URL?',
      },
      { status: timedOut ? 504 : 500 }
    );
  }
}
