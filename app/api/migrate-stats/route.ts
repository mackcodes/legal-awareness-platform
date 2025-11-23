import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import UserStats from '@/models/UserStats';

// POST - Migrate localStorage data to database
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const localData = await request.json();

    await dbConnect();

    // Check if user already has stats in database
    const existingStats = await UserStats.findOne({ userId });

    if (existingStats) {
      return NextResponse.json({
        success: false,
        message: 'Stats already exist in database. Migration skipped to prevent data loss.',
        existingStats,
      });
    }

    // Create new stats from localStorage data
    const userStats = await UserStats.create({
      userId,
      ...localData,
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully migrated localStorage data to database!',
      userStats,
    });
  } catch (error) {
    console.error('Error migrating stats:', error);
    return NextResponse.json(
      { error: 'Failed to migrate stats' },
      { status: 500 }
    );
  }
}
