"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Scale } from "lucide-react";

export function ClerkHeader() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Legal Awareness
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <button className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Dashboard
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
}
