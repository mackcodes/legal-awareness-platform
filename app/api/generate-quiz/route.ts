import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

export async function POST(request: NextRequest) {
  try {
    const { topic, numQuestions = 4, difficulty = 'medium' } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Create a detailed prompt for Gemini
    const prompt = `Generate ${numQuestions} multiple choice quiz questions about "${topic}" in the context of Indian law and constitution. 
    
Difficulty level: ${difficulty}

Important requirements:
1. Each question should have exactly 4 options (A, B, C, D)
2. Questions should be factual and accurate about Indian law
3. Mark the correct answer clearly
4. Make questions educational and relevant to Indian citizens
5. Format the response EXACTLY as a valid JSON array with this structure:

[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]

The "correct" field should be the index (0-3) of the correct option.
Only return the JSON array, no other text or explanation.`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate quiz questions' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini's response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the JSON from the response
    let questions: QuizQuestion[];
    try {
      // Remove markdown code blocks if present
      const jsonText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      questions = JSON.parse(jsonText);
      
      // Validate the structure
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid response format');
      }

      // Validate each question
      questions = questions.map(q => {
        if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct !== 'number') {
          throw new Error('Invalid question format');
        }
        return {
          question: q.question,
          options: q.options,
          correct: q.correct
        };
      });

    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      
      // Fallback to default questions if parsing fails
      questions = [
        {
          question: `What is the primary focus of ${topic} in Indian law?`,
          options: [
            'Constitutional rights',
            'Legal procedures',
            'Citizen duties',
            'Government policies'
          ],
          correct: 0
        },
        {
          question: `Which article is most relevant to ${topic}?`,
          options: [
            'Article 14',
            'Article 19',
            'Article 21',
            'Article 32'
          ],
          correct: 0
        },
        {
          question: `When was the primary legislation for ${topic} enacted?`,
          options: [
            'Before independence',
            'At independence (1947)',
            'With the Constitution (1950)',
            'After 1950'
          ],
          correct: 2
        },
        {
          question: `Who can invoke provisions related to ${topic}?`,
          options: [
            'Only Indian citizens',
            'All persons in India',
            'Only government officials',
            'Only legal professionals'
          ],
          correct: 1
        }
      ];
    }

    // Limit to requested number
    questions = questions.slice(0, numQuestions);

    const quizResponse: QuizResponse = { questions };
    
    return NextResponse.json(quizResponse);

  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
