import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';

// GET - Fetch user stats
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let userStats = await UserStats.findOne({ userId });

    // If user stats don't exist, create them
    if (!userStats) {
      userStats = await UserStats.create({
        userId,
        articlesRead: 0,
        quizzesTaken: 0,
        totalQuizScore: 0,
        forumPosts: 0,
        forumReplies: 0,
        currentStreak: 0,
        readArticles: [],
        completedQuizzes: [],
        learningProgress: new Map(),
      });
    }

    return NextResponse.json(userStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}

// POST - Update user stats
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    await dbConnect();

    const userStats = await UserStats.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true }
    );

    return NextResponse.json(userStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    return NextResponse.json(
      { error: 'Failed to update user stats' },
      { status: 500 }
    );
  }
}
