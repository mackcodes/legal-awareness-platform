import mongoose, { Schema, model, models } from 'mongoose';

export interface IQuizAttempt {
  userId: string; // Clerk user ID
  quizId: string; // Unique identifier for this quiz attempt
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  score: number; // Number of correct answers
  percentage: number; // Score percentage (0-100)
  points: number; // Points earned (for gamification)
  timeTaken: number; // seconds
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    quizId: {
      type: String,
      required: true,
      unique: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    numQuestions: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    timeTaken: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
QuizAttemptSchema.index({ userId: 1, completedAt: -1 });
QuizAttemptSchema.index({ userId: 1, topic: 1 });
QuizAttemptSchema.index({ userId: 1, difficulty: 1 });

const QuizAttempt = models.QuizAttempt || model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;
