"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Scale, Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import { useTranslate } from "../../hooks/useTranslate";
import { useUserStats } from "../../hooks/useUserStats";
import { CONSTITUTION_PARTS } from "../../data/constitution";

export default function ConstitutionPage() {
  const { incrementArticlesRead, updateLearningProgress, stats } = useUserStats();
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Translation hooks
  const { text: constitutionOfIndiaText } = useTranslate("Constitution of India");
  const { text: exploreDescriptionText } = useTranslate("Explore the fundamental law of the land, adopted on 26th November 1949");
  const { text: searchPlaceholderText } = useTranslate("Search articles, parts, or amendments...");
  const { text: partText } = useTranslate("Part");
  const { text: articlesText } = useTranslate("Articles");
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");
  const { text: backToPartsText } = useTranslate("Back to Parts");
  const { text: backToArticlesText } = useTranslate("Back to Articles");
  const { text: articleText } = useTranslate("Article");

  const handlePartClick = (partId: number) => {
    setSelectedPart(partId);
    setSelectedArticle(null);
    incrementArticlesRead(`constitution-part-${partId}`);
  };

  const handleArticleClick = (articleIndex: number) => {
    setSelectedArticle(articleIndex);
    const part = CONSTITUTION_PARTS.find(p => p.id === selectedPart);
    if (part) {
      incrementArticlesRead(`article-${part.articlesList[articleIndex].number}`);
      
      // Calculate progress based on articles read in this part
      const totalArticles = part.articlesList.length;
      const articlesRead = stats.readArticles.filter(id => {
        const articleNumbers = part.articlesList.map(a => a.number);
        return articleNumbers.some(num => id === `article-${num}`);
      }).length + 1; // +1 for the current article
      const progress = Math.round((articlesRead / totalArticles) * 100);
      
      // Update progress with appropriate key
      if (part.id === 3) {
        updateLearningProgress('fundamental-rights', progress);
      } else {
        updateLearningProgress(`part-${part.number.toLowerCase()}`, progress);
      }
    }
  };

  // Filter parts based on search query
  const filteredParts = CONSTITUTION_PARTS.filter(part => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      part.name.toLowerCase().includes(query) ||
      part.description.toLowerCase().includes(query) ||
      part.articles.includes(query) ||
      part.articlesList.some(article => 
        article.title.toLowerCase().includes(query) ||
        article.number.includes(query)
      )
    );
  });

  const currentPart = selectedPart ? CONSTITUTION_PARTS.find(p => p.id === selectedPart) : null;
  const currentArticle = currentPart && selectedArticle !== null ? currentPart.articlesList[selectedArticle] : null;

  return (
    <div className="min-h-screen bg-gray-50 bg-constitution-lines">
      {/* Navigation */}
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
              <Link href="/constitution" className="text-blue-600 font-medium">{constitutionText}</Link>
              <Link href="/acts" className="text-gray-600 hover:text-blue-600 transition-colors">{actsText}</Link>
              <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors">{quizText}</Link>
              <Link href="/forum" className="text-gray-600 hover:text-blue-600 transition-colors">{forumText}</Link>
              <LanguageSelector />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">{constitutionOfIndiaText}</h1>
          <p className="text-lg text-gray-600">{exploreDescriptionText}</p>
        </div>

        {/* Back Button */}
        {(selectedPart || selectedArticle !== null) && (
          <button
            onClick={() => {
              if (selectedArticle !== null) {
                setSelectedArticle(null);
              } else {
                setSelectedPart(null);
              }
            }}
            className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{selectedArticle !== null ? backToArticlesText : backToPartsText}</span>
          </button>
        )}

        {/* Search */}
        {!selectedPart && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder={searchPlaceholderText} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              />
            </div>
          </div>
        )}

        {/* Show Article Detail */}
        {currentArticle && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <span className="text-sm font-semibold text-blue-600">{articleText} {currentArticle.number}</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3 font-playfair">{currentArticle.title}</h2>
              <p className="text-lg text-blue-600 mb-6">{currentArticle.description}</p>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{currentArticle.content}</p>
              </div>
            </div>

            {/* Navigation between articles */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {selectedArticle > 0 && (
                <button
                  onClick={() => setSelectedArticle(selectedArticle - 1)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous Article</span>
                </button>
              )}
              <div className="flex-1" />
              {currentPart && selectedArticle < currentPart.articlesList.length - 1 && (
                <button
                  onClick={() => setSelectedArticle(selectedArticle + 1)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition"
                >
                  <span>Next Article</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show Articles List for Selected Part */}
        {selectedPart && !currentArticle && currentPart && (
          <div>
            <div className="mb-6">
              <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200 inline-block mb-3">
                <span className="text-sm font-semibold text-blue-600">{partText} {currentPart.number}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 font-playfair">{currentPart.name}</h2>
              <p className="text-lg text-gray-600">{currentPart.description}</p>
            </div>

            <div className="grid gap-4">
              {currentPart.articlesList.map((article, index) => (
                <div
                  key={article.number}
                  onClick={() => handleArticleClick(index)}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-50 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
                          {articleText} {article.number}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600">{article.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show Parts Grid */}
        {!selectedPart && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.length > 0 ? filteredParts.map((part) => (
              <div 
                key={part.id} 
                onClick={() => handlePartClick(part.id)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-500 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    <span className="text-sm font-semibold text-blue-600">{partText} {part.number}</span>
                  </div>
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{part.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{part.description}</p>
                <div className="text-xs text-gray-500">{articlesText} {part.articles}</div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No parts found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}