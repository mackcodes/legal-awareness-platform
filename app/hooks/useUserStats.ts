"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export interface UserStats {
  articlesRead: number;
  quizzesTaken: number;
  totalQuizScore: number; // Sum of all quiz scores
  forumPosts: number;
  forumReplies: number;
  lastVisitDate: string;
  currentStreak: number;
  readArticles: string[]; // IDs of articles read
  completedQuizzes: string[]; // IDs of quizzes completed
  learningProgress: {
    [key: string]: number; // Module ID -> Progress percentage
  };
  // Enhanced quiz statistics
  bestQuizScore: number;
  totalPoints: number;
  totalQuizTime: number;
  quizStreak: number;
  lastQuizDate?: string;
}

const DEFAULT_STATS: UserStats = {
  articlesRead: 0,
  quizzesTaken: 0,
  totalQuizScore: 0,
  forumPosts: 0,
  forumReplies: 0,
  lastVisitDate: new Date().toISOString(),
  currentStreak: 0,
  readArticles: [],
  completedQuizzes: [],
  learningProgress: {},
  bestQuizScore: 0,
  totalPoints: 0,
  totalQuizTime: 0,
  quizStreak: 0,
};

export function useUserStats() {
  const { isSignedIn, user } = useUser();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  // Fetch stats from database
  const fetchStats = async () => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user-stats');
      if (response.ok) {
        const data = await response.json();
        // Convert Map to object for learningProgress
        const statsData = {
          ...data,
          learningProgress: data.learningProgress || {},
        };
        setStats(statsData);
        // Update streak after fetching stats
        await updateStreakOnVisit(statsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save stats to database
  const saveStats = async (newStats: UserStats) => {
    setStats(newStats);

    if (!isSignedIn) return;

    try {
      await fetch('/api/user-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStats),
      });
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  };

  // Load stats on mount
  useEffect(() => {
    const initializeStats = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      // Try to migrate localStorage data if it exists
      if (typeof window !== 'undefined') {
        const localData = localStorage.getItem('userStats');
        if (localData) {
          try {
            const parsedData = JSON.parse(localData);
            // Attempt migration
            const migrateResponse = await fetch('/api/migrate-stats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsedData),
            });
            
            if (migrateResponse.ok) {
              const result = await migrateResponse.json();
              if (result.success) {
                console.log('✅ Successfully migrated localStorage data to database!');
                localStorage.removeItem('userStats'); // Clear old data
              }
            }
          } catch (err) {
            console.error('Migration error:', err);
          }
        }
      }

      // Fetch current stats from database
      await fetchStats();
    };

    initializeStats();
  }, [isSignedIn, user?.id]);

  // Update streak based on last visit
  const updateStreakOnVisit = async (currentStats: UserStats) => {
    const today = new Date().toDateString();
    const lastVisit = new Date(currentStats.lastVisitDate).toDateString();
    
    if (today === lastVisit) {
      // Same day, no change
      return;
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    
    let newStreak = currentStats.currentStreak;
    
    if (lastVisit === yesterdayStr) {
      // Consecutive day
      newStreak = currentStats.currentStreak + 1;
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }
    
    const updatedStats = {
      ...currentStats,
      currentStreak: newStreak,
      lastVisitDate: new Date().toISOString(),
    };
    
    await saveStats(updatedStats);
  };

  // Increment articles read
  const incrementArticlesRead = (articleId: string) => {
    if (stats.readArticles.includes(articleId)) {
      return; // Already read
    }
    
    const newStats = {
      ...stats,
      articlesRead: stats.articlesRead + 1,
      readArticles: [...stats.readArticles, articleId],
    };
    saveStats(newStats);
  };

  // Add quiz completion
  const addQuizCompletion = (quizId: string, score: number) => {
    const newStats = {
      ...stats,
      quizzesTaken: stats.quizzesTaken + 1,
      totalQuizScore: stats.totalQuizScore + score,
      completedQuizzes: [...stats.completedQuizzes, quizId],
    };
    saveStats(newStats);
  };

  // Save quiz attempt to database (stats and leaderboard data only)
  const saveQuizAttempt = async (attemptData: {
    quizId: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    numQuestions: number;
    score: number;
    percentage: number;
    points: number;
    timeTaken: number;
  }) => {
    if (!isSignedIn) {
      console.warn('Cannot save quiz attempt: User not signed in');
      return;
    }

    try {
      // Save to quiz attempts collection
      const response = await fetch('/api/quiz-attempts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attemptData),
      });

      if (!response.ok) {
        throw new Error('Failed to save quiz attempt');
      }

      // Update quiz streak
      const today = new Date().toDateString();
      const lastQuiz = stats.lastQuizDate ? new Date(stats.lastQuizDate).toDateString() : null;
      
      let newQuizStreak = stats.quizStreak;
      if (lastQuiz !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastQuiz === yesterdayStr) {
          newQuizStreak = stats.quizStreak + 1;
        } else if (lastQuiz !== today) {
          newQuizStreak = 1;
        }
      }

      // Update user stats - only update non-quiz fields
      // Quiz stats (quizzesTaken, totalQuizScore, bestQuizScore, totalPoints, totalQuizTime) 
      // are calculated from QuizAttempt collection in the GET endpoint
      const updatedStats = {
        ...stats,
        completedQuizzes: [...stats.completedQuizzes, attemptData.quizId],
        quizStreak: newQuizStreak,
        lastQuizDate: new Date().toISOString(),
      };

      await saveStats(updatedStats);

      console.log('✅ Quiz attempt saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      return false;
    }
  };

  // Increment forum posts
  const incrementForumPosts = () => {
    const newStats = {
      ...stats,
      forumPosts: stats.forumPosts + 1,
    };
    saveStats(newStats);
  };

  // Increment forum replies
  const incrementForumReplies = () => {
    const newStats = {
      ...stats,
      forumReplies: stats.forumReplies + 1,
    };
    saveStats(newStats);
  };

  // Update learning progress for a module
  const updateLearningProgress = (moduleId: string, progress: number) => {
    const newStats = {
      ...stats,
      learningProgress: {
        ...stats.learningProgress,
        [moduleId]: Math.min(100, Math.max(0, progress)),
      },
    };
    saveStats(newStats);
  };

  // Get average quiz score
  const getAverageQuizScore = (): number => {
    if (stats.quizzesTaken === 0) return 0;
    return Math.round(stats.totalQuizScore / stats.quizzesTaken);
  };

  // Get total forum contributions
  const getTotalForumContributions = (): number => {
    return stats.forumPosts + stats.forumReplies;
  };

  // Reset all stats (for testing or user reset)
  const resetStats = () => {
    saveStats(DEFAULT_STATS);
  };

  return {
    stats,
    loading,
    incrementArticlesRead,
    addQuizCompletion,
    saveQuizAttempt,
    incrementForumPosts,
    incrementForumReplies,
    updateLearningProgress,
    getAverageQuizScore,
    getTotalForumContributions,
    resetStats,
  };
}
