import mongoose from 'mongoose';

export interface IForumPost {
  _id?: string;
  userId: string;
  userName: string;
  userImage: string;
  title: string;
  content: string;
  category: string;
  likes: string[]; // Array of user IDs who liked
  dislikes: string[]; // Array of user IDs who disliked
  replies: IForumReply[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IForumReply {
  _id?: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  likes: string[];
  dislikes: string[];
  createdAt: Date;
}

const ForumReplySchema = new mongoose.Schema<IForumReply>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userImage: { type: String, default: '' },
  content: { type: String, required: true },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const ForumPostSchema = new mongoose.Schema<IForumPost>({
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  userImage: { type: String, default: '' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  likes: [{ type: String }],
  dislikes: [{ type: String }],
  replies: [ForumReplySchema],
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now }
});

// Index for sorting by createdAt
ForumPostSchema.index({ createdAt: -1 });

export default mongoose.models.ForumPost || mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
