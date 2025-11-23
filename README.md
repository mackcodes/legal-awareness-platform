# Legal Awareness Platform 🏛️

> **Empowering Citizens with Legal Knowledge**

A comprehensive digital platform for accessing and understanding India's Constitution and key legal acts, built with modern web technologies. Features bilingual support (English/Hindi), AI-powered quizzes, traffic fine information, and community discussions.

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Auth-6c47ff)](https://clerk.com/)

## ✨ Features

### 🔐 Authentication & User Management
- Secure user authentication with Clerk
- Personalized dashboard with learning progress
- User stats tracking (articles read, quiz scores, forum activity)

### 📚 Constitution & Legal Acts
- **Complete Indian Constitution** with all parts and articles
- **25+ Key Legal Acts** including:
  - Right to Information Act
  - Motor Vehicles Act with traffic fines
  - Consumer Protection Act
  - Information Technology Act
  - And many more...
- Search functionality across all content
- Progress tracking for articles/sections read

### 🚗 Traffic Fines & Challenges
- Comprehensive Motor Vehicles Act penalties table
- **Challenge Wrong Charges** guide with:
  - Step-by-step appeal process
  - Official websites and helpline numbers
  - Contact information for authorities

### 🧠 AI-Powered Quiz System
- 26+ quiz topics across Constitution and Acts
- AI-generated questions via OpenAI integration
- Multiple difficulty levels (Easy, Medium, Hard)
- Customizable question count (3-30 questions)
- Random quiz feature with surprise topics
- Real-time scoring and progress tracking

### 🌐 Bilingual Support
- **English ↔ Hindi** translation
- Real-time translation using Google Translate API
- Persistent language preference
- All UI elements translated

### 💬 Community Features
- Discussion forum (Coming Soon)
- Share experiences and ask questions

### 📱 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support
- Beautiful gradients and animations
- Accessible navigation
- Fast performance with Next.js 15

## 🛠️ Tech Stack

**Frontend Framework:**
- Next.js 15.0.3 (App Router with Turbopack)
- React 19.0 (RC)
- TypeScript 5.9.3

**Styling:**
- Tailwind CSS 3.4.1
- Custom CSS patterns and gradients
- Lucide React icons

**Authentication:**
- Clerk (@clerk/nextjs 6.8.2)

**State Management:**
- React Hooks (useState, useEffect, useContext)
- localStorage for user stats
- Custom hooks (useTranslate, useUserStats)

**APIs:**
- OpenAI API (quiz generation)
- Google Translate API (translations)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Clerk account (free tier available)
- OpenAI API key (for quiz feature)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/mackcodes/legal-awareness-platform.git
cd legal-awareness-platform
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI API (for AI quiz generation)
OPENAI_API_KEY=sk-your_openai_key_here
```

4. **Get your API keys:**

**Clerk Keys:**
- Go to [clerk.com](https://clerk.com)
- Sign up and create a new application
- Navigate to **API Keys** section
- Copy **Publishable Key** and **Secret Key**

**OpenAI Key:**
- Go to [platform.openai.com](https://platform.openai.com)
- Sign up/Login and go to API Keys
- Create a new secret key
- Copy and paste into `.env.local`

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
legal-awareness-platform/
├── app/
│   ├── (auth)/                      # Authentication routes
│   │   ├── sign-in/[[...sign-in]]/
│   │   └── sign-up/[[...sign-up]]/
│   ├── (main)/                      # Protected routes
│   │   ├── dashboard/               # User dashboard
│   │   ├── constitution/            # Constitution browser
│   │   ├── acts/                    # Legal acts browser
│   │   ├── quiz/                    # Quiz system
│   │   └── forum/                   # Discussion forum
│   ├── api/
│   │   ├── generate-quiz/           # AI quiz generation endpoint
│   │   └── translate/               # Translation endpoint
│   ├── components/                  # Reusable components
│   │   └── LanguageSelector.tsx
│   ├── contexts/                    # React contexts
│   │   └── TranslationContext.tsx
│   ├── data/                        # Static data
│   │   ├── constitution.ts          # Constitution data
│   │   └── acts.ts                  # Legal acts data
│   ├── hooks/                       # Custom hooks
│   │   ├── useTranslate.ts
│   │   └── useUserStats.ts
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── middleware.ts                     # Clerk auth middleware
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Deploy on Vercel:**
- Go to [vercel.com](https://vercel.com)
- Sign in with GitHub
- Import your repository
- Add environment variables (from `.env.local`)
- Click Deploy

3. **Environment Variables to Add:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `OPENAI_API_KEY`

Your app will be live at `https://your-app.vercel.app` 🎉

### Other Deployment Options
- **Netlify:** Similar process to Vercel
- **Self-hosted:** Use `npm run build` and `npm start`

## 🎯 Key Features Explained

### Translation System
- Custom `useTranslate` hook for real-time translations
- Translation context provider manages language state
- Google Translate API integration
- Caching for better performance

### User Statistics
- `useUserStats` hook tracks:
  - Articles/sections read
  - Quiz attempts and scores
  - Forum participation
  - Learning progress by topic
- Data persisted in localStorage
- Synced with user authentication

### AI Quiz Generation
- OpenAI GPT-3.5/4 integration
- Generates questions based on topic and difficulty
- Multiple-choice format with 4 options
- Instant feedback on answers

### Search Functionality
- Real-time filtering across Constitution and Acts
- Searches titles, descriptions, and content
- Highlights matching results

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Team

**B.Tech Mini Project - Greater Noida Institute of Technology**

**Development Team:**
- **Kumkum Kumari** - 2301320100083
- **Mayank Kumar** - 2301320100089  
- **Om Yadav** - 2301320100099

**Supervisor:** Mr. Asif Khan

**Institution:**
- Greater Noida Institute of Technology, Greater Noida
- Dr. A.P.J. Abdul Kalam Technical University, Lucknow

## 📄 License

This project is developed as part of academic curriculum at GNIOT.

## 🙏 Acknowledgments

- Indian Constitution data sourced from official government resources
- Legal acts information from Ministry of Law and Justice
- Icons by [Lucide](https://lucide.dev)
- UI inspiration from modern web design principles
- OpenAI for AI-powered quiz generation
- Clerk for seamless authentication

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your contact email]

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] More regional languages
- [ ] Video explanations of key articles
- [ ] Legal document templates
- [ ] Case law database
- [ ] Lawyer consultation feature
- [ ] Offline mode with PWA

---

**Made with ❤️ for the citizens of India**

*Educating people about their constitutional rights and legal responsibilities*