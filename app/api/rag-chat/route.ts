import { NextRequest, NextResponse } from 'next/server';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        language: language || 'en',
        audience_level: audienceLevel || 'citizen',
        tenant_id: tenantId || null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RAG service error:', errorText);
      return NextResponse.json(
        { success: false, error: 'RAG service request failed' },
        { status: response.status }
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
    return NextResponse.json(
      { success: false, error: 'Failed to reach RAG service. Is it running on RAG_SERVICE_URL?' },
      { status: 500 }
    );
  }
}
