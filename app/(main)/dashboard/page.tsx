"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { BookOpen, MessageSquare, Award, TrendingUp, Scale, RefreshCw } from "lucide-react";
import { useTranslate } from "../../hooks/useTranslate";
import { useTranslation } from "../../contexts/TranslationContext";
import { useUserStats } from "../../hooks/useUserStats";
import { CONSTITUTION_PARTS } from "../../data/constitution";
import { INDIAN_ACTS } from "../../data/acts";
import Leaderboard from "../../components/Leaderboard";
import ResponsiveNav from "../../components/ResponsiveNav";
import ConstitutionChatbot from "../../components/ConstitutionChatbot";

// Component for rendering learning items with translation
function LearningItemCard({ item, colorClasses, progressBarClasses, IconComponent, completeText }: any) {
  const { text: translatedTitle } = useTranslate(item.title);
  const { text: translatedDescription } = useTranslate(item.description);
  
  return (
    <Link
      href={item.link}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition"
    >
      <div className="flex items-start justify-between">
        <div className="w-full">
          <h3 className="font-semibold text-gray-900 mb-1">
            {translatedTitle}
          </h3>
          <p className="text-sm text-gray-600">
            {translatedDescription}
          </p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`${progressBarClasses[item.color]} h-2 rounded-full transition-all`}
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {item.progress}% {completeText}
          </p>
        </div>
        <IconComponent className={`h-5 w-5 ${colorClasses[item.color]} ml-4 flex-shrink-0`} />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const { stats, loading, getAverageQuizScore, getTotalForumContributions, refreshStats } = useUserStats();
  const { currentLanguage } = useTranslation();
  const [syncing, setSyncing] = useState(false);
  
  // Sync forum stats with actual database counts
  const syncForumStats = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/sync-forum-stats', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Forum stats synced:', data.stats);
        // Refresh stats to show updated values
        await refreshStats();
        alert(`Stats synced! Posts: ${data.stats.forumPosts}, Replies: ${data.stats.forumReplies}`);
      } else {
        alert('Failed to sync stats: ' + data.error);
      }
    } catch (error) {
      console.error('Error syncing stats:', error);
      alert('Failed to sync stats');
    } finally {
      setSyncing(false);
    }
  };
  
  // Refresh stats when dashboard comes into view
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && refreshStats) {
        refreshStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshStats]);
  
  // Translation hooks for dashboard text
  const { text: welcomeText } = useTranslate("Welcome back");
  const { text: journeyText } = useTranslate("Continue your journey in understanding India's legal framework");
  const { text: searchPlaceholder } = useTranslate("Search for articles, acts, or legal topics...");
  const { text: articlesReadText } = useTranslate("Articles Read");
  const { text: quizScoreText } = useTranslate("Quiz Score");
  const { text: forumPostsText } = useTranslate("Forum Posts");
  const { text: streakText } = useTranslate("Streak");
  const { text: daysText } = useTranslate("days");
  const { text: continueLearningText } = useTranslate("Continue Learning");
  const { text: thisWeekText } = useTranslate("this week");
  const { text: aboveAverageText } = useTranslate("Above average");
  const { text: newRepliesText } = useTranslate("new replies");
  const { text: fundamentalRightsText } = useTranslate("Fundamental Rights");
  const { text: articles1235Text } = useTranslate("Articles 12-35: Rights guaranteed to all citizens");
  const { text: completeText } = useTranslate("complete");
  const { text: rtiActText } = useTranslate("Right to Information Act");
  const { text: learnAccessText } = useTranslate("Learn how to access government information");
  const { text: recentActivityText } = useTranslate("Recent Forum Activity");
  const { text: recommendedText } = useTranslate("Recommended for You");
  const { text: viewAllText } = useTranslate("View All");
  
  // Navigation translation hooks
  const { text: legalAwarenessText } = useTranslate("Legal Awareness");
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  const { text: recentDiscussionsText } = useTranslate("Recent Discussions");
  const { text: understandingArticle21Text } = useTranslate("Understanding Article 21");
  const { text: article21QuestionText } = useTranslate("Can someone explain the scope of Right to Life and Personal Liberty?");
  const { text: repliesText } = useTranslate("replies");
  const { text: viewsText } = useTranslate("views");
  const { text: consumerProtectionText } = useTranslate("Consumer Protection Tips");
  const { text: consumerExperienceText } = useTranslate("Share your experiences with consumer court proceedings");
  const { text: viewAllDiscussionsText } = useTranslate("View All Discussions");
  const { text: quickAccessText } = useTranslate("Quick Access");
  const { text: browseConstitutionText } = useTranslate("Browse Constitution");
  const { text: exploreActsText } = useTranslate("Explore Key Acts");
  const { text: takeQuizText } = useTranslate("Take a Quiz");
  const { text: joinDiscussionText } = useTranslate("Join Discussion");
  const { text: didYouKnowText } = useTranslate("Did You Know?");
  const { text: constitutionFactText } = useTranslate("The Indian Constitution is the longest written constitution in the world, with 470 articles divided into 25 parts and 12 schedules.");
  const { text: keepLearningText } = useTranslate("Keep Learning!");
  const { text: journeyStartedText } = useTranslate("You're on your way to becoming a legal awareness champion. Keep up the great work!");
  const { text: legalExplorerText } = useTranslate("Legal Explorer");
  const { text: unlockBadgesText } = useTranslate("Keep learning to unlock more badges!");
  const { text: totalText } = useTranslate("total");
  const { text: quizzesTakenText } = useTranslate("quizzes taken");
  const { text: postsText } = useTranslate("posts");
  const { text: repliesLowercaseText } = useTranslate("replies");

  // Get top 3 learning progress items sorted by percentage
  const getTopLearningItems = () => {
    const progressItems = Object.entries(stats.learningProgress)
      .filter(([_, progress]) => progress > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return progressItems.map(([id, progress]) => {
      // Check if it's a constitution part
      const constitutionPart = CONSTITUTION_PARTS.find(part => 
        `part-${part.number.toLowerCase()}` === id || 
        id === 'fundamental-rights'
      );
      
      if (constitutionPart) {
        return {
          id,
          type: 'constitution' as const,
          title: constitutionPart.name,
          description: constitutionPart.description,
          progress,
          link: '/constitution',
          icon: BookOpen,
          color: 'blue'
        };
      }

      // Check if it's an act
      const act = INDIAN_ACTS.find(a => a.id === id);
      if (act) {
        return {
          id,
          type: 'act' as const,
          title: act.name,
          description: act.description,
          progress,
          link: '/acts',
          icon: Scale,
          color: 'green'
        };
      }

      // Fallback for unknown items
      return {
        id,
        type: 'other' as const,
        title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: 'Continue learning',
        progress,
        link: '/dashboard',
        icon: BookOpen,
        color: 'gray'
      };
    });
  };

  const topLearningItems = getTopLearningItems();

  return (
    <div className="min-h-screen bg-gray-50 bg-justice-dots">
      <ResponsiveNav currentPage="dashboard" />

      {/* Main Content */}
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* AI Constitution Chatbot */}
        <div className="mb-4 sm:mb-8">
          <ConstitutionChatbot />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">{articlesReadText}</span>
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? "..." : stats.articlesRead}</div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">{stats.readArticles.length} {totalText}</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">{quizScoreText}</span>
              <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? "..." : getAverageQuizScore()}%</div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">{stats.quizzesTaken} {quizzesTakenText}</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">{forumPostsText}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={syncForumStats}
                  disabled={syncing}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Sync forum stats with database"
                >
                  <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-400 hover:text-purple-600 ${syncing ? 'animate-spin' : ''}`} />
                </button>
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? "..." : getTotalForumContributions()}</div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">{stats.forumPosts} {postsText}, {stats.forumReplies} {repliesLowercaseText}</div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-xs sm:text-sm">{streakText}</span>
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">{loading ? "..." : stats.currentStreak}</div>
            <div className="text-gray-600 text-xs sm:text-sm mt-1">{daysText}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Left Column - Main Content (Smaller) */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Continue Learning Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {continueLearningText}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {topLearningItems.length > 0 ? (
                  topLearningItems.map((item) => {
                    const IconComponent = item.icon;
                    const colorClasses = {
                      blue: 'text-blue-600',
                      green: 'text-green-600',
                      gray: 'text-gray-600'
                    };
                    const progressBarClasses = {
                      blue: 'bg-blue-600',
                      green: 'bg-green-600',
                      gray: 'bg-gray-600'
                    };
                    
                    return (
                      <LearningItemCard
                        key={item.id}
                        item={item}
                        colorClasses={colorClasses}
                        progressBarClasses={progressBarClasses}
                        IconComponent={IconComponent}
                        completeText={completeText}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Start reading articles and acts to track your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Two Column Layout for Forum and Quick Access */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Recent Forum Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {recentDiscussionsText}
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {understandingArticle21Text}
                      </h3>
                      <span className="text-xs text-gray-500">2h</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {article21QuestionText}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>12 {repliesText}</span>
                      <span>•</span>
                      <span>45 {viewsText}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {consumerProtectionText}
                      </h3>
                      <span className="text-xs text-gray-500">5h</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {consumerExperienceText}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>8 {repliesText}</span>
                      <span>•</span>
                      <span>32 {viewsText}</span>
                    </div>
                  </div>
                </div>
                <Link
                  href="/forum"
                  className="block mt-4 text-center text-blue-600 hover:underline text-sm font-medium"
                >
                  {viewAllDiscussionsText} →
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {quickAccessText}
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/constitution"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <BookOpen className="h-5 w-5 text-blue-600 group-hover:scale-110 transition" />
                    <span className="text-gray-900 font-medium">{browseConstitutionText}</span>
                  </Link>
                  <Link
                    href="/acts"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <Scale className="h-5 w-5 text-green-600 group-hover:scale-110 transition" />
                    <span className="text-gray-900 font-medium">{exploreActsText}</span>
                  </Link>
                  <Link
                    href="/quiz"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <Award className="h-5 w-5 text-orange-600 group-hover:scale-110 transition" />
                    <span className="text-gray-900 font-medium">{takeQuizText}</span>
                  </Link>
                  <Link
                    href="/forum"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group"
                  >
                    <MessageSquare className="h-5 w-5 text-purple-600 group-hover:scale-110 transition" />
                    <span className="text-gray-900 font-medium">{joinDiscussionText}</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Learning Tip */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  {didYouKnowText}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {constitutionFactText}
                </p>
              </div>

              {/* Progress Badge */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-sm border border-yellow-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full ring-4 ring-yellow-200">
                      <Award className="h-8 w-8 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {legalExplorerText}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {unlockBadgesText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard (Wider Sidebar) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}