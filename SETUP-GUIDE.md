# Project Structure Guide

## Directory Structure

Create the following folder structure:

```
legal-awareness-platform/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx          → Use sign-in-page.tsx
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx          → Use sign-up-page.tsx
│   ├── dashboard/
│   │   └── page.tsx                  → Use dashboard-page.tsx
│   ├── constitution/
│   │   └── page.tsx                  → Use constitution-page.tsx
│   ├── acts/
│   │   └── page.tsx                  → Use acts-page.tsx
│   ├── quiz/
│   │   └── page.tsx                  → Use quiz-page.tsx
│   ├── forum/
│   │   └── page.tsx                  → Use forum-page.tsx
│   ├── layout.tsx                    → Use app-layout.tsx
│   ├── page.tsx                      → Use app-page.tsx
│   └── globals.css                   → Use app-globals.css
├── middleware.ts                     → Use middleware.ts
├── next.config.js                    → Use next.config.js
├── tailwind.config.ts                → Use tailwind.config.ts
├── tsconfig.json                     → Use tsconfig.json
├── package.json                      → Use package.json
├── .env.local                        → Create using .env.local.example
└── README.md                         → Use README.md
```

## Setup Steps

### 1. Create Project Directory
```bash
mkdir legal-awareness-platform
cd legal-awareness-platform
```

### 2. Copy Configuration Files
Place these files in the root directory:
- `package.json`
- `next.config.js`
- `tailwind.config.ts`
- `tsconfig.json`
- `middleware.ts`
- `README.md`

### 3. Create App Directory Structure
```bash
mkdir -p app/(auth)/sign-in/[[...sign-in]]
mkdir -p app/(auth)/sign-up/[[...sign-up]]
mkdir -p app/dashboard
mkdir -p app/constitution
mkdir -p app/acts
mkdir -p app/quiz
mkdir -p app/forum
```

### 4. Place Page Files

**Root app files:**
- `app/layout.tsx` → Content from `app-layout.tsx`
- `app/page.tsx` → Content from `app-page.tsx`
- `app/globals.css` → Content from `app-globals.css`

**Auth pages:**
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` → Content from `sign-in-page.tsx`
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` → Content from `sign-up-page.tsx`

**Feature pages:**
- `app/dashboard/page.tsx` → Content from `dashboard-page.tsx`
- `app/constitution/page.tsx` → Content from `constitution-page.tsx`
- `app/acts/page.tsx` → Content from `acts-page.tsx`
- `app/quiz/page.tsx` → Content from `quiz-page.tsx`
- `app/forum/page.tsx` → Content from `forum-page.tsx`

### 5. Install Dependencies
```bash
npm install
```

### 6. Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose authentication methods (Email, Google, etc.)
4. Copy your API keys from the dashboard

### 7. Configure Environment Variables

Create `.env.local` in root directory:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 8. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## Important Notes

### Clerk Authentication Setup
- The `(auth)` folder with parentheses is a route group that doesn't affect the URL structure
- The `[[...sign-in]]` syntax creates catch-all routes for Clerk's authentication flow
- Make sure to add your Clerk keys before running the app

### Dark Mode Support
- The app automatically supports dark mode based on system preferences
- Uses Tailwind's `dark:` prefix for dark mode styling

### Features Included
- ✅ Clerk authentication (sign up, sign in, user management)
- ✅ Protected routes (requires authentication)
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Interactive quiz system
- ✅ Forum discussions
- ✅ Constitution and acts browser
- ✅ Dashboard with user stats

## Troubleshooting

### Clerk Not Working?
1. Check if `.env.local` exists and has correct keys
2. Restart dev server after adding env variables
3. Verify your Clerk app is active in dashboard

### Styling Issues?
1. Make sure `globals.css` is imported in `layout.tsx`
2. Run `npm install` to ensure Tailwind is installed
3. Check browser console for errors

### TypeScript Errors?
1. Run `npm install` to install all dependencies
2. Ensure all files are in correct directories
3. Check for missing imports

## Next Steps

1. Add actual constitution articles content
2. Implement search functionality
3. Add database for storing user progress
4. Implement real forum with database
5. Add more quiz questions
6. Add user profile pages
7. Implement notification system
8. Add admin panel for content management

## Tech Stack
- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript 5.6.3
- **Authentication:** Clerk 6.7.0
- **Styling:** Tailwind CSS 3.4.14
- **Icons:** Lucide React 0.454.0
- **React:** 19.0.0

## Support
For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)