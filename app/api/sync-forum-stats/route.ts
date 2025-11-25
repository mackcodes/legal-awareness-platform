import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import UserStats from '@/models/UserStats';

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Count actual posts by this user
    const userPosts = await ForumPost.find({ userId }).lean();
    const actualPostsCount = userPosts.length;

    // Count actual replies by this user across all posts
    const allPosts = await ForumPost.find({}).lean();
    let actualRepliesCount = 0;

    allPosts.forEach(post => {
      if (post.replies && Array.isArray(post.replies)) {
        const userReplies = post.replies.filter((reply: any) => reply.userId === userId);
        actualRepliesCount += userReplies.length;
      }
    });

    // Update user stats with actual counts
    const updatedStats = await UserStats.findOneAndUpdate(
      { userId },
      {
        $set: {
          forumPosts: actualPostsCount,
          forumReplies: actualRepliesCount,
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Forum stats synced successfully',
      stats: {
        forumPosts: actualPostsCount,
        forumReplies: actualRepliesCount,
        totalContributions: actualPostsCount + actualRepliesCount,
      },
      previous: {
        forumPosts: updatedStats.forumPosts,
        forumReplies: updatedStats.forumReplies,
      },
    });
  } catch (error) {
    console.error('Error syncing forum stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync forum stats' },
      { status: 500 }
    );
  }
}
