"use client";

import { useState } from 'react';
import { Languages, ChevronDown } from 'lucide-react';
import { useTranslation, LANGUAGES, LanguageCode } from '../contexts/TranslationContext';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Select language"
        suppressHydrationWarning
      >
        <Languages className="h-5 w-5 text-blue-600" />
        <span className="text-sm font-semibold text-blue-700">
          {LANGUAGES[currentLanguage]}
        </span>
        <ChevronDown className={`h-4 w-4 text-blue-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-blue-100 z-20 max-h-96 overflow-y-auto">
            <div className="py-2">
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLanguageChange(code as LanguageCode)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 ${
                    currentLanguage === code
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 font-semibold'
                      : 'text-gray-700 font-medium'
                  }`}
                >
                  {name}
                  {currentLanguage === code && (
                    <span className="ml-2 text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
