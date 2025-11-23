# Database Setup Guide

Your Legal Awareness Platform now syncs user stats across devices using MongoDB! 🎉

## What Changed

### ✅ **Before** (localStorage only):
- Stats stored only in browser
- No sync across devices
- Data lost when clearing browser

### 🚀 **Now** (MongoDB + Clerk):
- Stats stored in cloud database
- Syncs across all devices
- Tied to Clerk user account
- Never loses data

## Setup Steps

### 1. **Get a Free MongoDB Database**

#### Option A: MongoDB Atlas (Recommended - Free Tier)

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (choose FREE tier M0)
4. Click "Connect" on your cluster
5. Add your IP address to the whitelist (or use `0.0.0.0/0` for development)
6. Create a database user (username + password)
7. Choose "Connect your application"
8. Copy the connection string (looks like `mongodb+srv://...`)

#### Option B: Local MongoDB (For Development)

```bash
# Install MongoDB locally
# Windows: Download from https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB
mongod
```

Your connection string will be: `mongodb://localhost:27017/legal-awareness`

### 2. **Add MongoDB URI to Environment Variables**

Create or update `.env.local` file in your project root:

```env
# Your existing Clerk keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Add this new line with YOUR MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/legal-awareness?retryWrites=true&w=majority
```

**Important:** Replace `username`, `password`, and `cluster` with your actual MongoDB credentials!

### 3. **Restart Your Development Server**

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## How It Works Now

### 📊 **Data Flow:**

1. **User signs in** → Clerk authenticates
2. **Dashboard loads** → Fetches stats from MongoDB using user's Clerk ID
3. **User interacts** (clicks article, completes quiz, etc.) → Stats update in MongoDB
4. **User switches devices** → Same stats appear everywhere!

### 🔄 **API Routes Created:**

- `GET /api/user-stats` - Fetch user's stats from database
- `POST /api/user-stats` - Update user's stats in database

### 📁 **Files Created/Modified:**

**New Files:**
- `lib/mongodb.ts` - Database connection handler
- `models/UserStats.ts` - User stats data model
- `app/api/user-stats/route.ts` - API endpoints
- `.env.example` - Environment variable template
- `DATABASE-SETUP.md` - This guide

**Modified Files:**
- `app/hooks/useUserStats.ts` - Now uses database instead of localStorage
- All existing tracking remains the same (Constitution, Acts, Quiz, Forum)

## Testing

### ✅ **Verify It's Working:**

1. **Open browser console** (F12) and go to Network tab
2. **Visit Dashboard** - You should see:
   - `GET /api/user-stats` request
   - Response with your stats

3. **Click an article in Constitution page**
4. **Check Network tab** - You should see:
   - `POST /api/user-stats` request
   - Updated stats in response

5. **Open in different browser** or **incognito mode**
6. **Sign in with same account**
7. **Check Dashboard** - Same stats appear! 🎉

### 🧪 **Multi-Device Test:**

1. Sign in on your computer
2. Click some articles, take a quiz
3. Sign in on your phone (or another browser)
4. See the same stats!

## Database Structure

```javascript
{
  userId: "user_2abc123...",           // Clerk user ID
  articlesRead: 5,
  quizzesTaken: 3,
  totalQuizScore: 255,
  forumPosts: 2,
  forumReplies: 8,
  currentStreak: 4,
  readArticles: ["constitution-part-3", "rti-act"],
  completedQuizzes: ["quiz-123", "quiz-456"],
  learningProgress: {
    "fundamental-rights": 60,
    "rti-act": 30
  },
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T15:30:00.000Z"
}
```

## Troubleshooting

### ❌ "Failed to fetch user stats"

**Solution:**
1. Check `.env.local` has `MONGODB_URI`
2. Verify MongoDB connection string is correct
3. Check MongoDB Atlas IP whitelist includes your IP
4. Restart dev server after adding env variables

### ❌ "Unauthorized"

**Solution:**
1. Make sure you're signed in with Clerk
2. Check Clerk keys are in `.env.local`
3. Clear browser cache and sign in again

### ❌ Stats not syncing

**Solution:**
1. Open browser console - check for errors
2. Verify network requests to `/api/user-stats` are successful
3. Check MongoDB connection in database dashboard

### ❌ "MongooseError: Operation buffering timed out"

**Solution:**
1. Check your internet connection
2. Verify MongoDB Atlas cluster is running
3. Check IP whitelist settings in MongoDB Atlas

## MongoDB Atlas Dashboard

To view your data:
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Find the `userstats` collection
4. See all user data in real-time!

## Security Notes

- ✅ API routes protected by Clerk authentication
- ✅ Users can only access their own stats
- ✅ Connection string encrypted in environment variables
- ⚠️ Never commit `.env.local` to git (already in `.gitignore`)

## Cost

- **MongoDB Atlas Free Tier:**
  - 512 MB storage
  - Shared RAM
  - Perfect for development and small apps
  - No credit card required

- **When to Upgrade:**
  - 500+ active users
  - Need more than 512 MB storage
  - Need dedicated resources

## Next Steps

Once running:
1. ✅ Sign in and test stats tracking
2. ✅ Test on multiple devices
3. 🎨 Consider adding stats export/import
4. 📊 Build admin analytics dashboard
5. 🏆 Add achievements and badges
6. 📈 Create progress charts and graphs

Your platform is now production-ready with cloud sync! 🚀
