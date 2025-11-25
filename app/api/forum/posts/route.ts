import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ForumPost from '@/models/ForumPost';
import { auth } from '@clerk/nextjs/server';

// GET - Fetch all forum posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = {};
    if (category && category !== 'All') {
      query = { category };
    }

    const posts = await ForumPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ 
      success: true, 
      posts: posts.map(post => ({
        ...post,
        _id: post._id.toString(),
        likesCount: post.likes?.length || 0,
        dislikesCount: post.dislikes?.length || 0,
        repliesCount: post.replies?.length || 0
      }))
    });
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST - Create a new forum post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { title, content, category, userName, userImage } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newPost = await ForumPost.create({
      userId,
      userName: userName || 'Anonymous',
      userImage: userImage || '',
      title,
      content,
      category,
      likes: [],
      dislikes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      post: {
        ...newPost.toObject(),
        _id: newPost._id.toString(),
        likesCount: 0,
        repliesCount: 0
      }
    });
  } catch (error) {
    console.error('Error creating forum post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
