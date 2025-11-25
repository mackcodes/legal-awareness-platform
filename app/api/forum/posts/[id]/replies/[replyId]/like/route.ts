import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// POST - Toggle like on a reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
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
    const { id, replyId } = await params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const reply = post.replies.id(replyId);

    if (!reply) {
      return NextResponse.json(
        { success: false, error: 'Reply not found' },
        { status: 404 }
      );
    }

    const likeIndex = reply.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      reply.likes.splice(likeIndex, 1);
    } else {
      // Like
      reply.likes.push(userId);
    }

    post.updatedAt = new Date();
    await post.save();

    return NextResponse.json({ 
      success: true, 
      liked: likeIndex === -1,
      likesCount: reply.likes.length
    });
  } catch (error) {
    console.error('Error toggling reply like:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
