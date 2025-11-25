import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

// GET - Fetch leaderboard with user details
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    await dbConnect();

    // Get aggregated leaderboard data - fetch all for full leaderboard
    const leaderboardData = await QuizAttempt.aggregate([
      {
        $group: {
          _id: '$userId',
          totalAttempts: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          averageScore: { $avg: '$percentage' },
          bestScore: { $max: '$percentage' },
          worstScore: { $min: '$percentage' },
          averageTime: { $avg: '$timeTaken' },
          totalTime: { $sum: '$timeTaken' },
        },
      },
      {
        $sort: { totalPoints: -1, averageScore: -1 },
      },
    ]);

    console.log(`📊 Leaderboard: Found ${leaderboardData.length} users with quiz attempts`);
    console.log('👥 User IDs:', leaderboardData.map(entry => entry._id));

    // Get user details from Clerk
    const userIds = leaderboardData.map(entry => entry._id);
    const client = await clerkClient();
    
    // Fetch all users at once (Clerk handles batching internally)
    let allUsers: any[] = [];
    
    if (userIds.length > 0) {
      try {
        const usersResponse = await client.users.getUserList({
          userId: userIds,
        });
        allUsers = usersResponse.data;
        console.log(`✅ Fetched ${allUsers.length} users from Clerk`);
      } catch (error) {
        console.error('❌ Error fetching users from Clerk:', error);
      }
    }

    // Create a map of user details
    const userMap = new Map(
      allUsers.map(user => [
        user.id,
        {
          userName: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.username || user.emailAddresses[0]?.emailAddress || 'Anonymous',
          userImage: user.imageUrl,
        },
      ])
    );

    // Combine leaderboard data with user details
    const leaderboard = leaderboardData.map((entry, index) => ({
      position: index + 1,
      userId: entry._id,
      userName: userMap.get(entry._id)?.userName || 'Anonymous User',
      userImage: userMap.get(entry._id)?.userImage || '',
      totalPoints: entry.totalPoints,
      averageScore: Math.round(entry.averageScore * 10) / 10,
      totalAttempts: entry.totalAttempts,
      bestScore: entry.bestScore,
      worstScore: entry.worstScore,
      averageTime: Math.round(entry.averageTime),
      totalTime: entry.totalTime,
    }));

    // Get current user's position if authenticated
    let userPosition = null;
    if (userId) {
      const allUsersData = await QuizAttempt.aggregate([
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

      const position = allUsersData.findIndex(u => u._id === userId);
      userPosition = position >= 0 ? position + 1 : null;
    }

    return NextResponse.json({
      leaderboard,
      userPosition,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard', leaderboard: [], userPosition: null },
      { status: 500 }
    );
  }
}
