# Legal Awareness Platform

A comprehensive digital platform for accessing and understanding India's Constitution and key acts, built with Next.js 15, TypeScript, and Clerk Authentication.

## Features

- 🔐 Secure authentication with Clerk
- 📚 Browse Constitution articles and key acts
- 🔍 Advanced search functionality
- 📖 Simplified explanations of legal provisions
- 💬 Discussion forums
- 📝 Quiz system for legal awareness
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript
- **Authentication:** Clerk
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd legal-awareness-platform
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Get your Clerk keys:
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable and secret keys
   - Paste them into `.env.local`

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
legal-awareness-platform/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── constitution/
│   │   └── page.tsx
│   ├── acts/
│   │   └── page.tsx
│   ├── quiz/
│   │   └── page.tsx
│   ├── forum/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   └── Footer.tsx
├── middleware.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Team

- Kumkum Kumari (2301320100083)
- Mayank Kumar (2301320100089)
- Om Yadav (2301320100099)

**Supervisor:** Mr. Asif Khan

## License

This project is part of a B.Tech Mini Project at Greater Noida Institute of Technology.

## Acknowledgments

- Dr. A.P.J. Abdul Kalam Technical University, Lucknow
- Greater Noida Institute of Technology, Greater Noida