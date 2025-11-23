import { NextRequest, NextResponse } from 'next/server';

// Google Translate API configuration
const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';

// Supported Indian languages
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  te: 'Telugu',
  mr: 'Marathi',
  ta: 'Tamil',
  gu: 'Gujarati',
  kn: 'Kannada',
  ml: 'Malayalam',
  pa: 'Punjabi',
  or: 'Odia',
};

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export async function POST(request: NextRequest) {
  let text = '';
  let sourceLang = '';
  let targetLang = '';
  
  try {
    const body: TranslationRequest = await request.json();
    text = body.text;
    sourceLang = body.sourceLang;
    targetLang = body.targetLang;

    // Validation
    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLang, targetLang' },
        { status: 400 }
      );
    }

    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return NextResponse.json({ translatedText: text });
    }

    // Check if Google Translate API key is configured
    if (!GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not configured, returning original text');
      return NextResponse.json({ 
        translatedText: text,
        warning: 'Translation service not configured. Add GOOGLE_TRANSLATE_API_KEY to .env.local'
      });
    }

    // Call Google Translate API
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      console.error(`Google Translate API error: ${response.status}`);
      // Return original text on API error
      return NextResponse.json({ 
        translatedText: text,
        warning: `Translation API returned status ${response.status}`
      });
    }

    const data = await response.json();
    const translatedText = data?.data?.translations?.[0]?.translatedText || text;

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    // Return original text instead of error to maintain user experience
    return NextResponse.json({ 
      translatedText: text,
      warning: 'Translation temporarily unavailable'
    });
  }
}
