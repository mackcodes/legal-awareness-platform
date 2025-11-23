"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

/**
 * Custom hook to translate text content
 * Automatically translates when language changes
 */
export function useTranslate(originalText: string, sourceLang: 'en' | 'hi' = 'en') {
  const { currentLanguage, translate, isTranslating } = useTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);

  useEffect(() => {
    // If the current language is the same as source, use original text
    if (currentLanguage === sourceLang) {
      setTranslatedText(originalText);
      return;
    }

    // Translate the text
    let isCancelled = false;

    async function performTranslation() {
      try {
        const result = await translate(originalText, sourceLang);
        if (!isCancelled) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error('Translation failed:', error);
        if (!isCancelled) {
          setTranslatedText(originalText);
        }
      }
    }

    performTranslation();

    return () => {
      isCancelled = true;
    };
  }, [currentLanguage, originalText, sourceLang, translate]);

  return { text: translatedText, isTranslating };
}

/**
 * Hook to translate multiple texts at once
 */
export function useTranslateMultiple(texts: string[], sourceLang: 'en' | 'hi' = 'en') {
  const { currentLanguage, translate, isTranslating } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState(texts);

  useEffect(() => {
    if (currentLanguage === sourceLang) {
      setTranslatedTexts(texts);
      return;
    }

    let isCancelled = false;

    async function performTranslations() {
      try {
        const results = await Promise.all(
          texts.map(text => translate(text, sourceLang))
        );
        if (!isCancelled) {
          setTranslatedTexts(results);
        }
      } catch (error) {
        console.error('Translation failed:', error);
        if (!isCancelled) {
          setTranslatedTexts(texts);
        }
      }
    }

    performTranslations();

    return () => {
      isCancelled = true;
    };
  }, [currentLanguage, JSON.stringify(texts), sourceLang, translate]);

  return { texts: translatedTexts, isTranslating };
}
