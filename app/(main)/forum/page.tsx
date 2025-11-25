"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Scale, MessageSquare, ThumbsUp, MessageCircle, Send, Loader2, Plus, Filter, X, ThumbsDown, Edit2, Trash2 } from "lucide-react";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";
import { useUser } from "@clerk/nextjs";
import ResponsiveNav from "../../components/ResponsiveNav";

interface ForumPost {
  _id: string;
  userId: string;
  userName: string;
  userImage: string;
  title: string;
  content: string;
  category: string;
  likes: string[];
  dislikes: string[];
  replies: ForumReply[];
  likesCount: number;
  dislikesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ForumReply {
  _id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

export default function ForumPage() {
  const { user } = useUser();
  const { incrementForumPosts, incrementForumReplies, decrementForumPosts, decrementForumReplies } = useUserStats();
  const [newPost, setNewPost] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Constitution");
  const [discussions, setDiscussions] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showPostForm, setShowPostForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'reply', postId: string, replyId?: string } | null>(null);

  // Translation hooks for navigation
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  
  // Translation hooks for page UI
  const { text: communityForumText } = useTranslate("Community Forum");
  const { text: discussTopicsText } = useTranslate("Discuss legal topics, share experiences, and learn from the community");
  const { text: startDiscussionText } = useTranslate("Start a Discussion");
  const { text: titlePlaceholderText } = useTranslate("Discussion title...");
  const { text: thoughtsPlaceholderText } = useTranslate("Share your thoughts, questions, or experiences...");
  const { text: selectCategoryText } = useTranslate("Select Category");
  const { text: postDiscussionText } = useTranslate("Post Discussion");
  const { text: allText } = useTranslate("All");
  const { text: consumerRightsText } = useTranslate("Consumer Rights");
  const { text: trendingText } = useTranslate("Trending");
  const { text: repliesText } = useTranslate("replies");
  const { text: criminalLawText } = useTranslate("Criminal Law");
  const { text: civilLawText } = useTranslate("Civil Law");
  const { text: otherText } = useTranslate("Other");
  
  // Translation hooks for discussion content
  const { text: d1TitleText } = useTranslate("Understanding Article 21 - Right to Life");
  const { text: d1ExcerptText } = useTranslate("Can someone explain the scope of Right to Life and Personal Liberty? What landmark cases have shaped this right?");
  const { text: d2TitleText } = useTranslate("How to file an RTI application?");
  const { text: d2ExcerptText } = useTranslate("I want to file an RTI to get information about a local government project. What's the correct procedure?");
  const { text: rtiActText } = useTranslate("RTI Act");
  const { text: d3TitleText } = useTranslate("Consumer Court Experience");
  const { text: d3ExcerptText } = useTranslate("Sharing my successful experience with consumer court. Tips for first-timers.");
  const { text: d4TitleText } = useTranslate("Fundamental Duties - Are they enforceable?");
  const { text: d4ExcerptText } = useTranslate("Discussion on whether fundamental duties can be legally enforced and their importance.");

  useEffect(() => {
    fetchPosts();
  }, [filterCategory]);

  const fetchPosts = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const url = filterCategory === "All" 
        ? '/api/forum/posts' 
        : `/api/forum/posts?category=${encodeURIComponent(filterCategory)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        if (silent) {
          // For silent updates, merge intelligently to avoid flickering
          setDiscussions(prevDiscussions => {
            const newPosts = data.posts;
            
            // Create a map of existing posts for quick lookup
            const existingMap = new Map(prevDiscussions.map(p => [p._id, p]));
            
            // Update existing posts or add new ones
            return newPosts.map((newPost: ForumPost) => {
              const existing = existingMap.get(newPost._id);
              
              // If post exists and core content hasn't changed, keep the reference
              if (existing && 
                  existing.content === newPost.content && 
                  existing.title === newPost.title &&
                  existing.likesCount === newPost.likesCount &&
                  existing.dislikesCount === newPost.dislikesCount &&
                  existing.repliesCount === newPost.repliesCount) {
                return existing;
              }
              
              return newPost;
            });
          });
        } else {
          setDiscussions(data.posts);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const handlePostSubmit = async () => {
    if (!newPost.trim() || !postTitle.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    if (!user) {
      alert('Please sign in to post');
      return;
    }

    try {
      setPosting(true);
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postTitle,
          content: newPost,
          category: selectedCategory,
          userName: user.fullName || user.firstName || 'Anonymous',
          userImage: user.imageUrl || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        incrementForumPosts();
        setNewPost("");
        setPostTitle("");
        setShowPostForm(false);
        fetchPosts();
      } else {
        alert('Failed to create post: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  const handleLikeClick = async (postId: string) => {
    if (!user) {
      alert('Please sign in to like posts');
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Update the post in the list
        setDiscussions(prevDiscussions =>
          prevDiscussions.map(post =>
            post._id === postId
              ? { 
                  ...post, 
                  likesCount: data.likesCount,
                  dislikesCount: data.dislikesCount,
                  likes: data.liked 
                    ? [...(post.likes || []).filter(id => id !== user.id), user.id]
                    : (post.likes || []).filter(id => id !== user.id),
                  dislikes: (post.dislikes || []).filter(id => id !== user.id)
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislikeClick = async (postId: string) => {
    if (!user) {
      alert('Please sign in to dislike posts');
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}/dislike`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setDiscussions(prevDiscussions =>
          prevDiscussions.map(post =>
            post._id === postId
              ? { 
                  ...post, 
                  dislikesCount: data.dislikesCount,
                  likesCount: data.likesCount,
                  dislikes: data.disliked 
                    ? [...(post.dislikes || []).filter(id => id !== user.id), user.id]
                    : (post.dislikes || []).filter(id => id !== user.id),
                  likes: (post.likes || []).filter(id => id !== user.id)
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleReplySubmit = async (postId: string) => {
    const content = replyContent[postId]?.trim();
    
    if (!content) {
      alert('Please enter a reply');
      return;
    }

    if (!user) {
      alert('Please sign in to reply');
      return;
    }

    try {
      const response = await fetch(`/api/forum/posts/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          userName: user.fullName || user.firstName || 'Anonymous',
          userImage: user.imageUrl || '',
        }),
      });

      const data = await response.json();

      if (data.success) {
        incrementForumReplies();
        setReplyContent(prev => ({ ...prev, [postId]: '' }));
        setReplyingTo(null);
        // Refresh the post to show new reply (silent)
        fetchPosts(true);
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    }
  };

  const handleDeletePost = async (postId: string) => {
    setDeleteTarget({ type: 'post', postId });
    setShowDeleteModal(true);
  };

  const handleDeleteReply = async (postId: string, replyId: string) => {
    setDeleteTarget({ type: 'reply', postId, replyId });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'post') {
        const response = await fetch(`/api/forum/posts/${deleteTarget.postId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          // Decrement stats: post + all its replies
          await decrementForumPosts();
          if (data.deletedRepliesCount && data.deletedRepliesCount > 0) {
            // Decrement for each reply that was deleted with the post
            for (let i = 0; i < data.deletedRepliesCount; i++) {
              await decrementForumReplies();
            }
          }
          fetchPosts(true);
        } else {
          alert(data.error || 'Failed to delete post');
        }
      } else {
        const response = await fetch(`/api/forum/posts/${deleteTarget.postId}/replies/${deleteTarget.replyId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          await decrementForumReplies();
          fetchPosts(true);
        } else {
          alert(data.error || 'Failed to delete reply');
        }
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete');
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleEditPost = (post: ForumPost) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const handleSavePostEdit = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingPost(null);
        setEditTitle("");
        setEditContent("");
        fetchPosts(true);
      } else {
        alert(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleEditReply = (reply: ForumReply) => {
    setEditingReply(reply._id);
    setEditContent(reply.content);
  };

  const handleSaveReplyEdit = async (postId: string, replyId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/replies/${replyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: editContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingReply(null);
        setEditContent("");
        fetchPosts(true);
      } else {
        alert(data.error || 'Failed to update reply');
      }
    } catch (error) {
      console.error('Error updating reply:', error);
      alert('Failed to update reply');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const discussions_old = [
    {
      id: 1,
      title: d1TitleText,
      author: "Priya Sharma",
      time: "2 hours ago",
      category: constitutionText,
      replies: 12,
      likes: 24,
      excerpt: d1ExcerptText,
    },
    {
      id: 2,
      title: d2TitleText,
      author: "Rahul Kumar",
      time: "5 hours ago",
      category: rtiActText,
      replies: 8,
      likes: 15,
      excerpt: d2ExcerptText,
    },
    {
      id: 3,
      title: d3TitleText,
      author: "Anjali Verma",
      time: "1 day ago",
      category: consumerRightsText,
      replies: 23,
      likes: 45,
      excerpt: d3ExcerptText,
    },
    {
      id: 4,
      title: d4TitleText,
      author: "Vikram Singh",
      time: "2 days ago",
      category: constitutionText,
      replies: 16,
      likes: 31,
      excerpt: d4ExcerptText,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 bg-justice-dots">
      <ResponsiveNav currentPage="forum" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-playfair">{communityForumText}</h1>
          <p className="text-base sm:text-lg text-gray-600">{discussTopicsText}</p>
        </div>

        {/* Create New Post Toggle Button */}
        <button
          type="button"
          onClick={() => setShowPostForm(!showPostForm)}
          className={`mb-6 flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition ${
            showPostForm 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
          }`}
        >
          {showPostForm ? (
            <>
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>{startDiscussionText}</span>
            </>
          )}
        </button>

        {/* Create New Post Form */}
        {showPostForm && (
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">{startDiscussionText}</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder={titlePlaceholderText}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                suppressHydrationWarning
              />
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={thoughtsPlaceholderText}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
                suppressHydrationWarning
              />
              <div className="flex items-center justify-between gap-4">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option>{constitutionText}</option>
                  <option>{rtiActText}</option>
                  <option>{consumerRightsText}</option>
                  <option>{criminalLawText}</option>
                  <option>{civilLawText}</option>
                  <option>{otherText}</option>
                </select>
                <button
                  type="button"
                  onClick={handlePostSubmit}
                  disabled={posting || !postTitle.trim() || !newPost.trim()}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition flex items-center space-x-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {posting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{postDiscussionText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[allText, constitutionText, actsText, consumerRightsText, criminalLawText, civilLawText].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filterCategory === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Discussion List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600 mb-4">Be the first to start a conversation!</p>
            <button
              type="button"
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              <Plus className="h-5 w-5" />
              <span>{startDiscussionText}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion) => {
              const isLiked = user?.id && discussion.likes?.includes(user.id);
              const isDisliked = user?.id && discussion.dislikes?.includes(user.id);
              const isExpanded = expandedPost === discussion._id;
              const isAuthor = user?.id === discussion.userId;
              const isEditing = editingPost === discussion._id;
              
              return (
                <div key={discussion._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition">
                  <div className="flex items-start gap-4 mb-3">
                    {/* User Avatar */}
                    <img
                      src={discussion.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.userName)}&background=3b82f6&color=fff`}
                      alt={discussion.userName}
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">{discussion.userName}</span>
                          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                            {discussion.category}
                          </span>
                          <span className="text-sm text-gray-500">{getTimeAgo(discussion.createdAt)}</span>
                        </div>
                        
                        {/* Edit/Delete buttons for post author */}
                        {isAuthor && !isEditing && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditPost(discussion)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit post"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePost(discussion._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete post"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-3 mb-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold"
                            placeholder="Title"
                            suppressHydrationWarning
                          />
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Content"
                            suppressHydrationWarning
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSavePostEdit(discussion._id)}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPost(null);
                                setEditTitle("");
                                setEditContent("");
                              }}
                              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{discussion.title}</h3>
                          <p className="text-gray-600 mb-3 whitespace-pre-wrap">{discussion.content}</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 pt-3 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleLikeClick(discussion._id)}
                      className={`flex items-center gap-2 hover:text-blue-600 transition ${isLiked ? 'text-blue-600 font-semibold' : ''}`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{discussion.likesCount || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDislikeClick(discussion._id)}
                      className={`flex items-center gap-2 hover:text-red-600 transition ${isDisliked ? 'text-red-600 font-semibold' : ''}`}
                    >
                      <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
                      <span>{discussion.dislikesCount || 0}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedPost(isExpanded ? null : discussion._id)}
                      className="flex items-center gap-2 hover:text-blue-600 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{discussion.repliesCount} {repliesText}</span>
                    </button>
                  </div>

                  {/* Replies Section */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Reply Form */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <textarea
                          value={replyContent[discussion._id] || ''}
                          onChange={(e) => setReplyContent(prev => ({ ...prev, [discussion._id]: e.target.value }))}
                          placeholder="Write a reply..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition text-sm"
                          suppressHydrationWarning
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(discussion._id)}
                            disabled={!replyContent[discussion._id]?.trim()}
                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Send className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>

                      {/* Replies List */}
                      {discussion.replies && discussion.replies.length > 0 && (
                        <div className="space-y-3">
                          {discussion.replies.map((reply) => {
                            const isReplyAuthor = user?.id === reply.userId;
                            const isPostAuthor = user?.id === discussion.userId;
                            const canDeleteReply = isReplyAuthor || isPostAuthor;
                            const isEditingThisReply = editingReply === reply._id;
                            
                            return (
                              <div key={reply._id} className="bg-gray-50 rounded-lg p-4 flex gap-3">
                                <img
                                  src={reply.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.userName)}&background=3b82f6&color=fff`}
                                  alt={reply.userName}
                                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-gray-900 text-sm">{reply.userName}</span>
                                      <span className="text-xs text-gray-500">{getTimeAgo(reply.createdAt)}</span>
                                    </div>
                                    
                                    {/* Edit/Delete buttons for reply */}
                                    {!isEditingThisReply && (
                                      <div className="flex items-center gap-1">
                                        {isReplyAuthor && (
                                          <button
                                            type="button"
                                            onClick={() => handleEditReply(reply)}
                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                                            title="Edit reply"
                                          >
                                            <Edit2 className="h-3.5 w-3.5" />
                                          </button>
                                        )}
                                        {canDeleteReply && (
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteReply(discussion._id, reply._id)}
                                            className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                            title={isPostAuthor && !isReplyAuthor ? "Delete reply (post author)" : "Delete reply"}
                                          >
                                            <Trash2 className="h-3.5 w-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  {isEditingThisReply ? (
                                    <div className="space-y-2">
                                      <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                                        suppressHydrationWarning
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleSaveReplyEdit(discussion._id, reply._id)}
                                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-xs"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingReply(null);
                                            setEditContent("");
                                          }}
                                          className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition text-xs"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this {deleteTarget?.type === 'post' ? 'post' : 'reply'}? 
              All associated data will be permanently removed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}