"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Scale, BookOpen, MessageSquare, Award, Search, TrendingUp } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";
import { useTranslation } from "../../contexts/TranslationContext";
import { useUserStats } from "../../hooks/useUserStats";
import { CONSTITUTION_PARTS } from "../../data/constitution";
import { INDIAN_ACTS } from "../../data/acts";

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
  const { stats, loading, getAverageQuizScore, getTotalForumContributions } = useUserStats();
  const { currentLanguage } = useTranslation();
  
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
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                {legalAwarenessText}
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-blue-600 font-medium"
              >
                {dashboardText}
              </Link>
              <Link
                href="/preamble"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {preambleText}
              </Link>
              <Link
                href="/constitution"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {constitutionText}
              </Link>
              <Link
                href="/acts"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {actsText}
              </Link>
              <Link
                href="/quiz"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {quizText}
              </Link>
              <Link
                href="/forum"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {forumText}
              </Link>
              <LanguageSelector />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-blue-600 rounded-xl p-8 mb-8 text-white bg-scales-pattern relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 font-playfair">
              {currentLanguage === 'hi' 
                ? `स्वागत है, ${user?.firstName || "उपयोगकर्ता"}!`
                : `${welcomeText}, ${user?.firstName || "User"}!`
              }
            </h1>
            <p className="text-blue-100 font-inter">
              {journeyText}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{articlesReadText}</span>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.articlesRead}</div>
            <div className="text-gray-500 text-sm mt-1">{stats.readArticles.length} {totalText}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{quizScoreText}</span>
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{loading ? "..." : getAverageQuizScore()}%</div>
            <div className="text-gray-500 text-sm mt-1">{stats.quizzesTaken} {quizzesTakenText}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{forumPostsText}</span>
              <MessageSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{loading ? "..." : getTotalForumContributions()}</div>
            <div className="text-gray-500 text-sm mt-1">{stats.forumPosts} {postsText}, {stats.forumReplies} {repliesLowercaseText}</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">{streakText}</span>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{loading ? "..." : stats.currentStreak}</div>
            <div className="text-gray-600 text-sm mt-1">{daysText}</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Continue Learning */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {continueLearningText}
              </h2>
              <div className="space-y-4">
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
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm">Start reading articles and acts to track your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Forum Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {recentDiscussionsText}
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {understandingArticle21Text}
                    </h3>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {article21QuestionText}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>12 {repliesText}</span>
                    <span>•</span>
                    <span>45 {viewsText}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {consumerProtectionText}
                    </h3>
                    <span className="text-xs text-gray-500">5h ago</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {quickAccessText}
              </h2>
              <div className="space-y-3">
                <Link
                  href="/constitution"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-900">{browseConstitutionText}</span>
                </Link>
                <Link
                  href="/acts"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Scale className="h-5 w-5 text-green-600" />
                  <span className="text-gray-900">{exploreActsText}</span>
                </Link>
                <Link
                  href="/quiz"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-900">{takeQuizText}</span>
                </Link>
                <Link
                  href="/forum"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-900">{joinDiscussionText}</span>
                </Link>
              </div>
            </div>

            {/* Learning Tip */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">
                💡 {didYouKnowText}
              </h3>
              <p className="text-sm text-gray-700">
                {constitutionFactText}
              </p>
            </div>

            {/* Progress Badge */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                {legalExplorerText}
              </h3>
              <p className="text-sm text-gray-600">
                {unlockBadgesText}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}