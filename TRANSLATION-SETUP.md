# Translation Feature Setup

This project now includes a translation feature powered by **Google Cloud Translation API**.

## Features Implemented

✅ **Translation API Route** (`/app/api/translate/route.ts`)
- Handles translation requests via Google Translate API
- Supports 100+ languages including all Indian languages
- Graceful fallback if API is not configured

✅ **Translation Context** (`/app/contexts/TranslationContext.tsx`)
- Global state management for current language
- Persistent language preference (localStorage)
- Translation methods available app-wide

✅ **Language Selector Component** (`/app/components/LanguageSelector.tsx`)
- Beautiful dropdown UI for language selection
- Shows current language with checkmark
- Supports 11 Indian languages

✅ **Translation Hooks** (`/app/hooks/useTranslate.ts`)
- `useTranslate()` - For single text translation
- `useTranslateMultiple()` - For batch translations
- Automatic re-translation on language change

## Supported Languages

- 🇬🇧 English (en)
- 🇮🇳 हिंदी - Hindi (hi)
- 🇮🇳 বাংলা - Bengali (bn)
- 🇮🇳 తెలుగు - Telugu (te)
- 🇮🇳 मराठी - Marathi (mr)
- 🇮🇳 தமிழ் - Tamil (ta)
- 🇮🇳 ગુજરાતી - Gujarati (gu)
- 🇮🇳 ಕನ್ನಡ - Kannada (kn)
- 🇮🇳 മലയാളം - Malayalam (ml)
- 🇮🇳 ਪੰਜਾਬੀ - Punjabi (pa)
- 🇮🇳 ଓଡ଼ିଆ - Odia (or)

## Setup Instructions

### 1. Get Google Cloud Translation API Key

#### Option A: Quick Setup (Free Tier)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (if you don't have one)
   - Click "Select a project" → "New Project"
   - Name it "Legal Awareness Platform"
   - Click "Create"

3. **Enable Translation API**
   - Go to: https://console.cloud.google.com/apis/library/translate.googleapis.com
   - Click "Enable"

4. **Create API Key**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "Create Credentials" → "API Key"
   - Copy your API key (looks like: `AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX`)
   - **Restrict the key** (recommended):
     - Click "Edit API key"
     - Under "API restrictions" → "Restrict key"
     - Select "Cloud Translation API"
     - Click "Save"

5. **Free Tier Info**
   - First 500,000 characters/month: **FREE**
   - After that: $20 per million characters
   - Perfect for development and small projects!

### 2. Configure Environment Variables

Create/update `.env.local` file in the root directory:

```env
# Google Cloud Translation API
GOOGLE_TRANSLATE_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
```

Replace with your actual API key from step 1.

### 3. Restart Development Server

```bash
npm run dev
```

## How to Use

### In Components

```tsx
import { useTranslate } from '@/app/hooks/useTranslate';

function MyComponent() {
  const { text } = useTranslate("Hello, World!");
  
  return <p>{text}</p>;
}
```

### For Multiple Texts

```tsx
import { useTranslateMultiple } from '@/app/hooks/useTranslate';

function MyComponent() {
  const { texts } = useTranslateMultiple([
    "First sentence",
    "Second sentence",
    "Third sentence"
  ]);
  
  return (
    <div>
      {texts.map((text, i) => <p key={i}>{text}</p>)}
    </div>
  );
}
```

## Testing Without API

The translation feature will work without API credentials! It will:
- Display original English text
- Show a warning in console
- Allow language selection (but won't translate)

This is perfect for development and testing the UI before getting API access.

## Next Steps

To enable translation on other pages:

1. Import `LanguageSelector` component in navigation
2. Use `useTranslate()` hook for text content
3. Text will automatically translate when language changes

## Cost

**Google Cloud Translation API Pricing:**
- First 500,000 characters/month: **FREE** 🎉
- After that: $20 per 1 million characters

For most development and small production apps, the free tier is sufficient!

---

**Note**: The Preamble page now has the language selector in the navigation bar. Click it to test different languages!
