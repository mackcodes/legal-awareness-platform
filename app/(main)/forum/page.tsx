"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Scale, MessageSquare, ThumbsUp, MessageCircle, Send } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";

export default function ForumPage() {
  const { incrementForumPosts, incrementForumReplies } = useUserStats();
  const [newPost, setNewPost] = useState("");
  const [postTitle, setPostTitle] = useState("");

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

  const handlePostSubmit = () => {
    if (newPost.trim() && postTitle.trim()) {
      // Track the forum post
      incrementForumPosts();
      // Clear the form
      setNewPost("");
      setPostTitle("");
      // In a real app, you would also save the post to a database
    }
  };

  const handleReplyClick = (discussionId: number) => {
    // Track when user replies to a discussion
    incrementForumReplies();
    // In a real app, you would show a reply form
  };

  const discussions = [
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
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Legal Awareness</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">{dashboardText}</Link>
              <Link href="/preamble" className="text-gray-600 hover:text-blue-600 transition-colors">{preambleText}</Link>
              <Link href="/constitution" className="text-gray-600 hover:text-blue-600 transition-colors">{constitutionText}</Link>
              <Link href="/acts" className="text-gray-600 hover:text-blue-600 transition-colors">{actsText}</Link>
              <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors">{quizText}</Link>
              <Link href="/forum" className="text-blue-600 font-medium">{forumText}</Link>
              <LanguageSelector />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">{communityForumText}</h1>
          <p className="text-lg text-gray-600">{discussTopicsText}</p>
        </div>

        {/* Create New Post */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{startDiscussionText}</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder={titlePlaceholderText}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={thoughtsPlaceholderText}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
            />
            <div className="flex items-center justify-between">
              <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                <option>{selectCategoryText}</option>
                <option>{constitutionText}</option>
                <option>{rtiActText}</option>
                <option>{consumerRightsText}</option>
                <option>{criminalLawText}</option>
                <option>{civilLawText}</option>
                <option>{otherText}</option>
              </select>
              <button 
                onClick={handlePostSubmit}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition flex items-center space-x-2 shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>{postDiscussionText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap shadow-sm">{allText}</button>
          <button className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg font-medium border border-gray-300 whitespace-nowrap transition">{constitutionText}</button>
          <button className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg font-medium border border-gray-300 whitespace-nowrap transition">{actsText}</button>
          <button className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg font-medium border border-gray-300 whitespace-nowrap transition">{consumerRightsText}</button>
          <button className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 rounded-lg font-medium border border-gray-300 whitespace-nowrap transition">{trendingText}</button>
        </div>

        {/* Discussion List */}
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                      {discussion.category}
                    </span>
                    <span className="text-sm text-gray-500">{discussion.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{discussion.title}</h3>
                  <p className="text-gray-600 mb-3">{discussion.excerpt}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="font-medium">{discussion.author}</span>
                  </div>
                </div>
                <MessageSquare className="h-6 w-6 text-gray-400 ml-4 flex-shrink-0" />
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600 pt-3 border-t border-gray-200">
                <button className="flex items-center space-x-2 hover:text-blue-600 transition">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{discussion.likes}</span>
                </button>
                <button 
                  onClick={() => handleReplyClick(discussion.id)}
                  className="flex items-center space-x-2 hover:text-blue-600 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{discussion.replies} {repliesText}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}