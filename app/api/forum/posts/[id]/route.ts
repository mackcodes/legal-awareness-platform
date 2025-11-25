import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch a single post with all replies
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const post = await ForumPost.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      post: {
        ...post,
        _id: post._id.toString(),
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        repliesCount: post.replies?.length || 0
      }
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// POST - Add a reply to a post
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

    const { content, userName, userImage } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const post = await ForumPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const newReply = {
      userId,
      userName: userName || 'Anonymous',
      userImage: userImage || '',
      content,
      likes: [],
      dislikes: [],
      createdAt: new Date()
    };

    post.replies.push(newReply);
    post.updatedAt = new Date();
    await post.save();

    return NextResponse.json({ 
      success: true, 
      reply: newReply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}

// PATCH - Update a post
export async function PATCH(
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

    const { title, content } = await request.json();

    await dbConnect();
    const { id } = await params;

    const post = await ForumPost.findById(id);

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user is the author
    if (post.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to edit this post' },
        { status: 403 }
      );
    }

    if (title) post.title = title;
    if (content) post.content = content;
    post.updatedAt = new Date();

    await post.save();

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a post
export async function DELETE(
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

    // Check if user is the author
    if (post.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this post' },
        { status: 403 }
      );
    }

    await ForumPost.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
