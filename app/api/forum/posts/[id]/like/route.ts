import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// POST - Toggle like on a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Initialize arrays if they don't exist
    if (!post.likes) post.likes = [];
    if (!post.dislikes) post.dislikes = [];

    // Remove from dislikes if present
    const dislikeIndex = post.dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      post.dislikes.splice(dislikeIndex, 1);
      post.markModified('dislikes');
    }

    // Toggle like
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(userId);
    }

    post.markModified('likes');
    post.updatedAt = new Date();
    await post.save();

    return NextResponse.json({ 
      success: true, 
      liked: likeIndex === -1,
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
