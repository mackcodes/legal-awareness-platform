import { NextRequest, NextResponse } from 'next/server';
import basePrompt from '../../../rag-service/prompts/base_prompt.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
// Instructions and knowledge base, shared with the RAG service so the two chatbots differ only in retrieval.
const BASE_PROMPT = basePrompt.lines.join('\n');
// Model is configurable so a key without access to gemini-2.5-flash (new accounts) can use another.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export async function POST(request: NextRequest) {
  try {
    const { question, simplify } = await request.json();

    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = simplify 
      ? `You are a helpful assistant that simplifies legal text. Take the following legal explanation and rewrite it in very simple, easy-to-understand language suitable for a 10-year-old. Use everyday examples and avoid legal jargon. Keep it concise (2-3 paragraphs).

Original text to simplify:
${question}`
      : `${BASE_PROMPT}

User Question: ${question}`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { success: false, error: 'Failed to generate answer' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini's response
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate an answer.';

    return NextResponse.json({
      success: true,
      answer,
      question,
    });
  } catch (error) {
    console.error('Error generating constitution answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate answer. Please try again.' },
      { status: 500 }
    );
  }
}
