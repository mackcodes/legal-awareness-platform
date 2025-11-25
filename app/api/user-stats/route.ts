import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';
import QuizAttempt from '@/models/QuizAttempt';

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

    // Get actual quiz count from QuizAttempt collection
    const actualQuizCount = await QuizAttempt.countDocuments({ userId });
    
    // Calculate actual stats from QuizAttempt collection
    let actualAverageScore = 0;
    let actualBestScore = 0;
    let actualTotalPoints = 0;
    let actualTotalTime = 0;
    
    if (actualQuizCount > 0) {
      const quizStats = await QuizAttempt.aggregate([
        { $match: { userId } },
        { 
          $group: { 
            _id: null, 
            avgScore: { $avg: '$percentage' },
            bestScore: { $max: '$percentage' },
            totalPoints: { $sum: '$points' },
            totalTime: { $sum: '$timeTaken' }
          } 
        }
      ]);
      
      if (quizStats.length > 0) {
        actualAverageScore = quizStats[0].avgScore || 0;
        actualBestScore = quizStats[0].bestScore || 0;
        actualTotalPoints = quizStats[0].totalPoints || 0;
        actualTotalTime = quizStats[0].totalTime || 0;
      }
    }
    
    // Override quiz-related stats with actual data from QuizAttempt collection
    const statsWithCorrectData = {
      ...userStats.toObject(),
      quizzesTaken: actualQuizCount,
      totalQuizScore: Math.round(actualAverageScore * actualQuizCount), // Sum for average calculation
      bestQuizScore: actualBestScore,
      totalPoints: actualTotalPoints,
      totalQuizTime: actualTotalTime,
    };

    return NextResponse.json(statsWithCorrectData);
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
