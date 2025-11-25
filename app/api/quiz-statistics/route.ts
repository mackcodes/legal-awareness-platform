import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

// GET - Fetch quiz statistics and leaderboard data
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const statsType = searchParams.get('type') || 'personal'; // 'personal' or 'leaderboard'

    if (statsType === 'leaderboard') {
      // Get top performers across all users (anonymized)
      const leaderboard = await QuizAttempt.aggregate([
        {
          $group: {
            _id: '$userId',
            totalAttempts: { $sum: 1 },
            totalPoints: { $sum: '$points' },
            averageScore: { $avg: '$percentage' },
            averageTimeTaken: { $avg: '$timeTaken' },
            bestScore: { $max: '$percentage' },
          },
        },
        {
          $sort: { totalPoints: -1, averageScore: -1 },
        },
        {
          $limit: 10,
        },
        {
          $addFields: {
            position: { $add: [{ $indexOfArray: [{ $range: [1, 11] }, { $literal: '$_id' }] }, 1] },
          },
        },
        {
          $project: {
            _id: 0,
            userId: '$_id',
            position: { $literal: 0 }, // Will be set after sorting
            anonymousId: { $substr: ['$_id', 0, 8] },
            totalAttempts: 1,
            totalPoints: 1,
            averageScore: { $round: ['$averageScore', 1] },
            averageTimeTaken: { $round: ['$averageTimeTaken', 0] },
            bestScore: 1,
          },
        },
      ]);

      // Add position numbers (1-10)
      leaderboard.forEach((entry, index) => {
        entry.position = index + 1;
      });

      return NextResponse.json({ leaderboard });
    }

    // Personal statistics
    const personalStats = await QuizAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          averageScore: { $avg: '$percentage' },
          totalTimeTaken: { $sum: '$timeTaken' },
          averageTimeTaken: { $avg: '$timeTaken' },
          bestScore: { $max: '$percentage' },
          worstScore: { $min: '$percentage' },
        },
      },
    ]);

    // Get user's leaderboard position
    const allUsers = await QuizAttempt.aggregate([
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
          averageScore: { $avg: '$percentage' },
        },
      },
      {
        $sort: { totalPoints: -1, averageScore: -1 },
      },
    ]);

    const userPosition = allUsers.findIndex(u => u._id === userId) + 1;

    // Stats by difficulty
    const statsByDifficulty = await QuizAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$difficulty',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          averageTime: { $avg: '$timeTaken' },
        },
      },
    ]);

    // Stats by topic
    const statsByTopic = await QuizAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$topic',
          attempts: { $sum: 1 },
          averageScore: { $avg: '$percentage' },
          lastAttempted: { $max: '$completedAt' },
        },
      },
      { $sort: { attempts: -1 } },
      { $limit: 10 },
    ]);

    // Recent improvement trend (last 10 attempts)
    const recentTrend = await QuizAttempt.find({ userId })
      .sort({ completedAt: -1 })
      .limit(10)
      .select('percentage completedAt')
      .lean();

    return NextResponse.json({
      personal: {
        ...(personalStats[0] || {}),
        position: userPosition || 0,
      },
      byDifficulty: statsByDifficulty,
      byTopic: statsByTopic,
      recentTrend: recentTrend.reverse(), // Oldest to newest for trend
    });
  } catch (error) {
    console.error('Error fetching quiz statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz statistics' },
      { status: 500 }
    );
  }
}
