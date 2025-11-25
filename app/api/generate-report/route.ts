import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { topic, difficulty, score, totalQuestions, incorrectQuestions, hintsUsed } = body;

    // Validate input
    if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
      console.error('Invalid input - score or totalQuestions not a number');
      return NextResponse.json({ error: 'Invalid input: score and totalQuestions must be numbers' }, { status: 400 });
    }

    // Get Gemini API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Gemini API key not configured');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Prepare the prompt for AI analysis
    const performancePercentage = Math.round((score / totalQuestions) * 100);
    const incorrectCount = incorrectQuestions?.length || 0;
    
    let prompt = `You are an expert legal education assistant. Analyze this quiz performance and provide personalized learning recommendations.

QUIZ DETAILS:
- Topic: ${topic || 'General Legal Knowledge'}
- Difficulty: ${difficulty || 'medium'}
- Score: ${score}/${totalQuestions} (${performancePercentage}%)
- Hints Used: ${hintsUsed || 0}

`;

    if (incorrectCount > 0) {
      prompt += `INCORRECT QUESTIONS:\n`;
      (incorrectQuestions || []).forEach((q: any, idx: number) => {
        prompt += `
${idx + 1}. Question: ${q.question}
   Your Answer: ${q.userAnswer}
   Correct Answer: ${q.correctAnswer}
   ${q.explanation ? `Explanation: ${q.explanation}` : ''}
`;
      });
    } else {
      prompt += `EXCELLENT! All questions were answered correctly.\n`;
    }

    prompt += `

IMPORTANT INSTRUCTIONS:
1. Get straight to the point - NO introductions, NO thank you messages, NO pleasantries
2. Focus ONLY on specific Indian Constitution articles, Acts, and legal provisions
3. Cite exact article numbers, sections, and provisions from Indian law
4. Make it actionable with specific study recommendations
5. Use clear formatting with proper headings and bullet points
6. Be concise but comprehensive

Generate a detailed performance analysis with these sections:

📊 PERFORMANCE ANALYSIS
- Brief assessment of score and areas needing improvement

🎯 KNOWLEDGE GAPS IDENTIFIED
- List specific topics/concepts where mistakes were made
- For each gap, mention the relevant Constitutional Articles or Act sections

📚 WHAT TO STUDY
For each knowledge gap, provide:
- Exact Constitutional Article numbers (e.g., Article 21, Article 21A)
- Specific Act names and section numbers (e.g., Right to Education Act 2009, Section 3)
- Key provisions and their importance
- Constitutional amendments if relevant (e.g., 86th Amendment)

💡 KEY CONCEPTS TO UNDERSTAND
- Fundamental legal principles from the questions missed
- Related constitutional provisions
- Connections between different articles/sections

🎓 NEXT STEPS
- Specific articles/sections to read first (in priority order)
- Suggested quiz topics for practice
- Related fundamental rights or directive principles to review

Keep it direct, factual, and focused on Indian legal education. No fluff.`;

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return NextResponse.json({ 
        error: 'Failed to generate report from AI',
        details: errorData 
      }, { status: 500 });
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    
    const report = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate report';

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating performance report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Internal server error',
      message: errorMessage 
    }, { status: 500 });
  }
}
