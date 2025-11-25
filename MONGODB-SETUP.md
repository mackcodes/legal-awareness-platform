# MongoDB Database Configuration Guide

## Overview
This application uses **MongoDB Atlas** to store and manage all user data, quiz attempts, statistics, and leaderboard information.

## Database Collections

### 1. **userstats** Collection
Stores aggregate user statistics and activity tracking.

**Schema (UserStats):**
```typescript
{
  userId: string;              // Clerk authentication ID
  articlesRead: number;        // Total articles viewed
  quizzesTaken: number;        // Total quiz attempts
  totalQuizScore: number;      // Sum of all quiz percentages
  forumPosts: number;          // Forum posts created
  forumReplies: number;        // Forum replies posted
  lastVisitDate: Date;         // Last login timestamp
  currentStreak: number;       // Consecutive days visiting
  readArticles: string[];      // Array of article IDs read
  completedQuizzes: string[];  // Array of quiz IDs completed
  learningProgress: Map;       // Topic -> Progress percentage
  
  // Enhanced Quiz Statistics
  bestQuizScore: number;       // Highest quiz percentage achieved
  totalHintsUsed: number;      // Total hints used across all quizzes
  totalQuizTime: number;       // Total seconds spent on quizzes
  quizStreak: number;          // Consecutive days with at least one quiz
  lastQuizDate: Date;          // Last quiz completion date
  favoriteTopics: string[];    // Top 5 most attempted quiz topics
  
  createdAt: Date;             // Account creation
  updatedAt: Date;             // Last update
}
```

**Indexes:**
- `userId` (unique, indexed)

**Purpose:**
- Dashboard statistics display
- User progress tracking
- Streak calculations
- Learning analytics

---

### 2. **quizattempts** Collection
Stores detailed information about each quiz attempt, including question-level analytics.

**Schema (QuizAttempt):**
```typescript
{
  userId: string;              // Clerk authentication ID
  quizId: string;              // Unique quiz attempt identifier
  topic: string;               // Quiz topic (e.g., "Indian Penal Code")
  difficulty: string;          // "easy" | "medium" | "hard"
  numQuestions: number;        // Total questions in quiz
  score: number;               // Number of correct answers
  percentage: number;          // Score percentage (0-100)
  timeTaken: number;           // Total seconds to complete
  hintsUsed: number;           // Number of hints viewed
  
  // Question-level analytics
  questions: [{
    question: string;          // Question text
    selectedAnswer: string;    // User's answer
    correctAnswer: string;     // Correct answer
    isCorrect: boolean;        // Whether answer was correct
    timeSpent: number;         // Seconds spent on this question
    hintViewed: boolean;       // Whether hint was used
  }];
  
  completedAt: Date;           // Quiz completion timestamp
  createdAt: Date;             // Record creation
  updatedAt: Date;             // Last update
}
```

**Indexes:**
- `userId` + `completedAt` (compound, descending)
- `userId` + `topic` (compound)
- `userId` + `difficulty` (compound)
- `quizId` (unique)

**Purpose:**
- Quiz history display
- Leaderboard calculations
- Performance analytics
- Weak area identification
- Time-based insights

---

## API Endpoints

### User Statistics

#### `GET /api/user-stats`
Fetches user statistics for the authenticated user.

**Response:**
```json
{
  "userId": "user_abc123",
  "quizzesTaken": 15,
  "totalQuizScore": 1275,
  "bestQuizScore": 95,
  "totalHintsUsed": 8,
  "totalQuizTime": 1800,
  "quizStreak": 5,
  "favoriteTopics": ["IPC", "Constitution", "CrPC"],
  ...
}
```

#### `POST /api/user-stats`
Updates user statistics.

**Request Body:** Partial `UserStats` object
**Response:** Updated `UserStats`

---

### Quiz Attempts

#### `GET /api/quiz-attempts`
Fetches quiz attempts for the authenticated user.

**Query Parameters:**
- `limit` (optional): Max results (default: 50)
- `topic` (optional): Filter by topic
- `difficulty` (optional): Filter by difficulty

**Response:**
```json
{
  "attempts": [
    {
      "quizId": "quiz-IPC-1732547123456",
      "topic": "Indian Penal Code",
      "difficulty": "medium",
      "percentage": 85,
      "timeTaken": 120,
      "hintsUsed": 2,
      "completedAt": "2025-11-25T10:30:00Z",
      "questions": [...]
    }
  ]
}
```

#### `POST /api/quiz-attempts`
Saves a new quiz attempt.

**Request Body:**
```json
{
  "quizId": "quiz-topic-timestamp",
  "topic": "Indian Penal Code",
  "difficulty": "medium",
  "numQuestions": 10,
  "score": 8,
  "percentage": 80,
  "timeTaken": 240,
  "hintsUsed": 3,
  "questions": [
    {
      "question": "What is Section 302?",
      "selectedAnswer": "Murder",
      "correctAnswer": "Murder",
      "isCorrect": true,
      "timeSpent": 15,
      "hintViewed": false
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "attempt": { ... }
}
```

---

### Quiz Statistics

#### `GET /api/quiz-statistics?type=personal`
Gets detailed personal quiz statistics.

**Response:**
```json
{
  "personal": {
    "totalAttempts": 25,
    "averageScore": 78.5,
    "totalTimeTaken": 3600,
    "averageTimeTaken": 144,
    "bestScore": 95,
    "worstScore": 45,
    "totalHintsUsed": 12,
    "averageHintsUsed": 0.48
  },
  "byDifficulty": [
    {
      "_id": "easy",
      "attempts": 8,
      "averageScore": 85.5,
      "averageTime": 90
    },
    {
      "_id": "medium",
      "attempts": 12,
      "averageScore": 75.3,
      "averageTime": 150
    },
    {
      "_id": "hard",
      "attempts": 5,
      "averageScore": 68.2,
      "averageTime": 210
    }
  ],
  "byTopic": [
    {
      "_id": "Indian Penal Code",
      "attempts": 10,
      "averageScore": 80,
      "lastAttempted": "2025-11-25T10:30:00Z"
    }
  ],
  "recentTrend": [
    { "percentage": 75, "completedAt": "2025-11-20T..." },
    { "percentage": 80, "completedAt": "2025-11-21T..." },
    { "percentage": 85, "completedAt": "2025-11-22T..." }
  ]
}
```

#### `GET /api/quiz-statistics?type=leaderboard`
Gets top 10 performers (anonymized).

**Response:**
```json
{
  "leaderboard": [
    {
      "anonymousId": "user_abc",
      "totalAttempts": 50,
      "averageScore": 88.5,
      "averageTimeTaken": 120,
      "bestScore": 100
    }
  ]
}
```

---

### Migration

#### `POST /api/migrate-stats`
Migrates data from localStorage to MongoDB (one-time).

**Request Body:** localStorage stats object
**Response:** `{ "success": true }`

---

## MongoDB Atlas Setup

### 1. Create Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Choose Free M0 cluster

### 2. Configure Cluster
1. **Cloud Provider:** Any (AWS recommended)
2. **Region:** Closest to your users
3. **Cluster Name:** `lawawareness` (or custom)

### 3. Database Access
1. Go to **Database Access** tab
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `mackcodes` (or custom)
5. Password: Generate secure password
6. Database User Privileges: **Read and write to any database**

### 4. Network Access
1. Go to **Network Access** tab
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - **Note:** For production, restrict to specific IPs

### 5. Get Connection String
1. Go to **Database** tab
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy connection string:
   ```
   mongodb+srv://mackcodes:<password>@lawawareness.xxxxx.mongodb.net/?appName=lawAwareness
   ```
6. Replace `<password>` with your database user password

### 6. Update .env.local
Add to your `.env.local` file:
```env
MONGODB_URI=mongodb+srv://mackcodes:YourPassword@lawawareness.xxxxx.mongodb.net/?appName=lawAwareness
```

---

## Data Flow

### Quiz Completion Flow:
1. User completes quiz in UI
2. `QuizPage` component:
   - Tracks question-level data (answers, time, hints)
   - Calculates final score and statistics
3. Calls `saveQuizAttempt()` from `useUserStats` hook
4. API route `/api/quiz-attempts` (POST):
   - Validates user authentication
   - Saves detailed attempt to `quizattempts` collection
5. Hook updates aggregate stats in `userstats` collection:
   - Increments `quizzesTaken`
   - Updates `totalQuizScore`
   - Updates `bestQuizScore` if new high
   - Adds to `totalHintsUsed`
   - Increments `quizStreak` if applicable
   - Updates `favoriteTopics`
6. Both localStorage and MongoDB updated for redundancy

### Statistics Display Flow:
1. User visits Dashboard
2. `useUserStats` hook:
   - Fetches from `/api/user-stats`
   - Returns aggregated statistics
3. Dashboard displays:
   - Total quizzes taken
   - Average score
   - Best score
   - Current streak
   - Quiz history

### Leaderboard Flow:
1. Quiz page loads
2. Fetches from `/api/quiz-statistics?type=leaderboard`
3. MongoDB aggregates:
   - Groups by `userId`
   - Calculates average scores
   - Sorts by score then time
   - Returns top 10 (anonymized)
4. Displays on Quiz page

---

## Testing Database Connection

### Method 1: Check Logs
After starting the dev server:
```bash
npm run dev
```

Look for:
```
✅ Successfully migrated localStorage data to database!
✅ Quiz data saved to MongoDB
```

### Method 2: MongoDB Atlas Dashboard
1. Go to your cluster in MongoDB Atlas
2. Click **Browse Collections**
3. You should see:
   - `userstats` collection
   - `quizattempts` collection

### Method 3: Test API Directly
```bash
# Get user stats (requires authentication)
curl http://localhost:3000/api/user-stats

# Get quiz attempts
curl http://localhost:3000/api/quiz-attempts
```

---

## Database Maintenance

### Indexes
All indexes are automatically created via Mongoose schemas.

To verify indexes in MongoDB Atlas:
1. Go to **Collections** > **Indexes** tab
2. Check for:
   - `userstats`: `userId_1` (unique)
   - `quizattempts`: 
     - `quizId_1` (unique)
     - `userId_1_completedAt_-1`
     - `userId_1_topic_1`
     - `userId_1_difficulty_1`

### Data Retention
- **User Stats:** Permanent (until user deletion)
- **Quiz Attempts:** Permanent (for analytics)
- **localStorage:** Max 50 recent attempts (UI cache)

### Backup Strategy
MongoDB Atlas automatic backups:
1. Go to **Backup** tab
2. Enable **Continuous Backup** (paid tier)
3. Or use **Snapshots** (free tier - manual)

---

## Troubleshooting

### Connection Errors

**Error:** `MongoNetworkError: failed to connect`
**Solution:** 
- Check IP whitelist in Network Access
- Verify MONGODB_URI in .env.local
- Ensure cluster is running (not paused)

**Error:** `MongoServerError: bad auth`
**Solution:**
- Verify username/password in connection string
- Check Database User has correct privileges

### Data Not Saving

**Check 1:** Authentication
- User must be signed in with Clerk
- Check `userId` is present

**Check 2:** Console Logs
- Look for error messages
- Check Network tab for failed API calls

**Check 3:** MongoDB Atlas
- Browse Collections to verify data exists
- Check Recent Activity for write operations

---

## Production Considerations

### Security
- [ ] Restrict Network Access to specific IPs
- [ ] Use environment-specific connection strings
- [ ] Enable MongoDB Atlas Advanced Security features
- [ ] Rotate database passwords regularly

### Performance
- [ ] Monitor query performance in Atlas
- [ ] Add additional indexes if queries are slow
- [ ] Consider connection pooling settings
- [ ] Use `lean()` for read-only queries

### Scaling
- [ ] Monitor cluster metrics (CPU, RAM, Storage)
- [ ] Upgrade cluster tier if needed
- [ ] Consider sharding for large datasets
- [ ] Implement data archival for old quiz attempts

---

## Support Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Next.js + MongoDB Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)
- Project Issues: Create issue in repository
