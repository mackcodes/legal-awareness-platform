"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, X, Star, Target, Clock, Zap, TrendingDown } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface LeaderboardEntry {
  position: number;
  userId: string;
  userName: string;
  userImage: string;
  totalPoints: number;
  averageScore: number;
  totalAttempts: number;
  bestScore: number;
  worstScore?: number;
  averageTime?: number;
  totalTime?: number;
}

interface LeaderboardProps {
  compact?: boolean;
}

export default function Leaderboard({ compact = false }: LeaderboardProps) {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [fullLeaderboard, setFullLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        const allData = data.leaderboard || [];
        setFullLeaderboard(allData);
        setLeaderboard(allData.slice(0, 5)); // Show only top 5
        setUserRank(data.userPosition || null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-gray-500 font-semibold">#{position}</span>;
    }
  };

  const getPositionBgColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${compact ? 'h-full' : ''}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-lg bg-gray-100">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Trophy className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Top Players</h3>
        </div>
        {userRank && (
          <div className="inline-flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">Your Rank: #{userRank}</span>
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No data yet. Complete quizzes to appear on the leaderboard!</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all hover:shadow-md ${
                getPositionBgColor(entry.position)
              } ${
                isCurrentUser(entry.userId)
                  ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-300'
                  : ''
              }`}
            >
              {/* Position/Medal */}
              <div className="flex items-center justify-center w-8">
                {getMedalIcon(entry.position)}
              </div>

              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <img
                  src={entry.userImage || '/default-avatar.png'}
                  alt={entry.userName}
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName)}&background=3b82f6&color=fff&size=128`;
                  }}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${
                  isCurrentUser(entry.userId) ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {entry.userName}
                  {isCurrentUser(entry.userId) && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">You</span>
                  )}
                </p>
                <div className="flex items-center space-x-3 text-xs text-gray-600">
                  <span className="font-medium">{entry.totalAttempts} quizzes</span>
                  <span>•</span>
                  <span>{entry.averageScore.toFixed(1)}% avg</span>
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  entry.position === 1 ? 'text-yellow-600' :
                  entry.position === 2 ? 'text-gray-600' :
                  entry.position === 3 ? 'text-amber-600' :
                  'text-gray-700'
                }`}>
                  {entry.totalPoints.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Note & View Full Button */}
      {leaderboard.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            View Full Leaderboard
          </button>
          <p className="text-xs text-gray-500 text-center">
            Rankings updated in real-time based on total points earned
          </p>
        </div>
      )}

      {/* Full Leaderboard Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Trophy className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Full Leaderboard</h2>
                    <p className="text-blue-100 text-sm">Top performers across all categories</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="space-y-3">
                {fullLeaderboard.map((entry) => (
                  <div
                    key={entry.userId}
                    className={`flex flex-col p-4 rounded-lg border transition-all hover:shadow-lg ${
                      getPositionBgColor(entry.position)
                    } ${
                      isCurrentUser(entry.userId)
                        ? 'ring-2 ring-blue-400 bg-blue-50 border-blue-300'
                        : ''
                    }`}
                  >
                    {/* Top Row - Main Info */}
                    <div className="flex items-center space-x-4 mb-3">
                      {/* Position/Medal */}
                      <div className="flex items-center justify-center w-10">
                        {getMedalIcon(entry.position)}
                      </div>

                      {/* Profile Picture */}
                      <div className="flex-shrink-0">
                        <img
                          src={entry.userImage || '/default-avatar.png'}
                          alt={entry.userName}
                          className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.userName)}&background=3b82f6&color=fff&size=128`;
                          }}
                        />
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-lg truncate ${
                          isCurrentUser(entry.userId) ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {entry.userName}
                          {isCurrentUser(entry.userId) && (
                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">You</span>
                          )}
                        </p>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          entry.position === 1 ? 'text-yellow-600' :
                          entry.position === 2 ? 'text-gray-600' :
                          entry.position === 3 ? 'text-amber-600' :
                          'text-gray-700'
                        }`}>
                          {entry.totalPoints.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">points</div>
                      </div>
                    </div>

                    {/* Bottom Row - Detailed Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Total Quizzes</p>
                          <p className="font-semibold text-gray-900">{entry.totalAttempts}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <div>
                          <p className="text-xs text-gray-500">Best Score</p>
                          <p className="font-semibold text-gray-900">{entry.bestScore}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Avg Score</p>
                          <p className="font-semibold text-gray-900">{entry.averageScore.toFixed(1)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Avg Time</p>
                          <p className="font-semibold text-gray-900">
                            {entry.averageTime 
                              ? `${Math.floor(entry.averageTime / 60)}:${Math.floor(entry.averageTime % 60).toString().padStart(2, '0')}` 
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Total Time</p>
                          <p className="font-semibold text-gray-900">
                            {entry.totalTime 
                              ? `${Math.floor(entry.totalTime / 60)}m` 
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {fullLeaderboard.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No data yet</p>
                  <p className="text-sm">Complete quizzes to appear on the leaderboard!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
