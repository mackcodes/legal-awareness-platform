"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Scale, Menu, X, Award } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useTranslate } from "../hooks/useTranslate";

interface ResponsiveNavProps {
  currentPage: "dashboard" | "preamble" | "constitution" | "acts" | "quiz" | "forum";
}

export default function ResponsiveNav({ currentPage }: ResponsiveNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Translation hooks
  const { text: dashboardText } = useTranslate("Dashboard");
  const { text: preambleText } = useTranslate("Preamble");
  const { text: constitutionText } = useTranslate("Constitution");
  const { text: actsText } = useTranslate("Acts");
  const { text: quizText } = useTranslate("Quiz");
  const { text: forumText } = useTranslate("Forum");

  const navItems = [
    { key: "quiz", href: "/quiz", text: quizText },
    { key: "dashboard", href: "/dashboard", text: dashboardText },
    { key: "preamble", href: "/preamble", text: preambleText },
    { key: "constitution", href: "/constitution", text: constitutionText },
    { key: "acts", href: "/acts", text: actsText },
    { key: "forum", href: "/forum", text: forumText },
  ];

  // Items that appear outside hamburger on mobile (always visible)
  const mobileVisibleItems = navItems.filter(item => item.key === "quiz");
  
  // Items inside hamburger menu on mobile (dashboard first, then others)
  const mobileMenuItems = [
    navItems.find(item => item.key === "dashboard"),
    ...navItems.filter(item => item.key !== "dashboard" && item.key !== "quiz")
  ].filter((item): item is typeof navItems[0] => item !== undefined);

  const currentItem = navItems.find(item => item.key === currentPage);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Scale className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:inline">Legal Awareness</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              item.key === "quiz" ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${
                    item.key === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                  } px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2`}
                >
                  <Award className="h-4 w-4" />
                  <span>{item.text}</span>
                </Link>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${
                    item.key === currentPage
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-blue-600"
                  } transition-colors`}
                >
                  {item.text}
                </Link>
              )
            ))}
            <LanguageSelector />
            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile: Quiz link + Hamburger */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Always show Quiz link on mobile - Special Feature Design */}
            <Link 
              href="/quiz" 
              className={`${
                currentPage === "quiz" 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              } px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5`}
            >
              <Award className="h-4 w-4" />
              <span>{quizText}</span>
            </Link>
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  item.key === currentPage
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.text}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-200 flex items-center justify-between px-4">
              <span className="text-sm text-gray-600">Account</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
