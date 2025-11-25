import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// POST - Toggle dislike on a post
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

    // Remove from likes if present
    const likeIndex = post.likes.indexOf(userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      post.markModified('likes');
    }

    // Toggle dislike
    const dislikeIndex = post.dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      // Remove dislike
      post.dislikes.splice(dislikeIndex, 1);
    } else {
      // Add dislike
      post.dislikes.push(userId);
    }
    
    post.markModified('dislikes');
    post.updatedAt = new Date();
    await post.save();

    return NextResponse.json({ 
      success: true, 
      disliked: dislikeIndex === -1,
      dislikesCount: post.dislikes.length,
      likesCount: post.likes.length
    });
  } catch (error) {
    console.error('Error toggling dislike:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle dislike' },
      { status: 500 }
    );
  }
}
