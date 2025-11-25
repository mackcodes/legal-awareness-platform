import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

// GET - Fetch user's quiz attempts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const topic = searchParams.get('topic');
    const difficulty = searchParams.get('difficulty');

    const query: any = { userId };
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const attempts = await QuizAttempt.find(query)
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}

// POST - Save a new quiz attempt
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const attemptData = await request.json();

    await dbConnect();

    // Create new quiz attempt with userId
    const quizAttempt = await QuizAttempt.create({
      ...attemptData,
      userId,
      completedAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      attempt: quizAttempt 
    });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz attempt' },
      { status: 500 }
    );
  }
}
