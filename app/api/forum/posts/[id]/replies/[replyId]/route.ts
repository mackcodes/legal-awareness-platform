import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// PATCH update reply
export async function PATCH(
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

    const { content } = await request.json();

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

    // Check if user is the author
    if (reply.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this reply' },
        { status: 403 }
      );
    }

    reply.content = content;
    post.updatedAt = new Date();

    await post.save();

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update reply' },
      { status: 500 }
    );
  }
}

// DELETE reply
export async function DELETE(
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

    // Allow deletion if user is the reply author OR the post author
    if (reply.userId !== userId && post.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this reply' },
        { status: 403 }
      );
    }

    post.replies.pull(replyId);
    post.updatedAt = new Date();

    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Reply deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
