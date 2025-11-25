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
    <nav className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
              <Scale className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Legal Help</span>
              <p className="text-xs text-gray-500 -mt-1">Know Your Rights</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              item.key === "quiz" ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`${
                    item.key === currentPage
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md"
                  } px-6 py-2.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center space-x-2 transform hover:scale-105`}
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
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                      : "text-gray-700 hover:text-blue-600 font-medium"
                  } transition-all duration-200 pb-1`}
                >
                  {item.text}
                </Link>
              )
            ))}
            <LanguageSelector />
            <div className="pl-2 border-l border-gray-200">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* Mobile: Quiz link + Hamburger */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* Always show Quiz link on mobile - Special Feature Design */}
            <Link 
              href="/quiz" 
              className={`${
                currentPage === "quiz" 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-md"
              } px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-1.5 transform hover:scale-105`}
            >
              <Award className="h-4 w-4" />
              <span>{quizText}</span>
            </Link>
            <LanguageSelector />
            <button
              type="button"
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
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-blue-100 shadow-xl">
          <div className="px-4 py-3 space-y-2">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.key === currentPage
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 font-medium"
                }`}
              >
                {item.text}
              </Link>
            ))}
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between px-4">
              <span className="text-sm font-medium text-gray-600">Account</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
