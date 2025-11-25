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
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
        aria-label="Select language"
        suppressHydrationWarning
      >
        <Languages className="h-5 w-5 text-gray-700" />
        <span className="text-sm font-medium text-gray-700">
          {LANGUAGES[currentLanguage]}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="py-2">
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLanguageChange(code as LanguageCode)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                    currentLanguage === code
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  {name}
                  {currentLanguage === code && (
                    <span className="ml-2">✓</span>
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
