import mongoose, { Schema, model, models } from 'mongoose';

export interface IUserStats {
  userId: string; // Clerk user ID
  articlesRead: number;
  quizzesTaken: number;
  totalQuizScore: number;
  forumPosts: number;
  forumReplies: number;
  lastVisitDate: Date;
  currentStreak: number;
  readArticles: string[];
  completedQuizzes: string[];
  learningProgress: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    articlesRead: {
      type: Number,
      default: 0,
    },
    quizzesTaken: {
      type: Number,
      default: 0,
    },
    totalQuizScore: {
      type: Number,
      default: 0,
    },
    forumPosts: {
      type: Number,
      default: 0,
    },
    forumReplies: {
      type: Number,
      default: 0,
    },
    lastVisitDate: {
      type: Date,
      default: Date.now,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    readArticles: {
      type: [String],
      default: [],
    },
    completedQuizzes: {
      type: [String],
      default: [],
    },
    learningProgress: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  {
    timestamps: true,
  }
);

const UserStats = models.UserStats || model<IUserStats>('UserStats', UserStatsSchema);

export default UserStats;
