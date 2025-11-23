# Google Translate API - Quick Setup Guide

## ✅ Updated to Google Cloud Translation API

Your translation feature now uses **Google Cloud Translation API** instead of Bhashini.

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Google Cloud Account
1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Accept terms if first time

### Step 2: Create a Project
1. Click **"Select a project"** at the top
2. Click **"New Project"**
3. Name: `Legal Awareness Platform`
4. Click **"Create"**
5. Wait for project to be created

### Step 3: Enable Translation API
1. Go to: https://console.cloud.google.com/apis/library/translate.googleapis.com
2. Make sure your project is selected (top left)
3. Click **"Enable"** button
4. Wait for it to enable (~30 seconds)

### Step 4: Create API Key
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ Create Credentials"** at the top
3. Select **"API Key"**
4. Your API key will appear! Copy it (looks like `AIzaSy...`)
5. Click **"Restrict Key"** (recommended for security)

### Step 5: Restrict API Key (Optional but Recommended)
1. Give it a name: `Legal Awareness Translation Key`
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"Cloud Translation API"**
3. Click **"Save"**

### Step 6: Add to Your Project
1. Open your `.env.local` file
2. Add this line:
```env
GOOGLE_TRANSLATE_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
```
3. Replace with your actual API key

### Step 7: Restart Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 8: Test!
1. Open http://localhost:3000
2. Login to your account
3. Click the **globe icon** (🌐) in navigation
4. Select **"हिंदी"** (Hindi)
5. Watch the magic! ✨

---

## 💰 Pricing

| Usage | Cost |
|-------|------|
| First 500,000 characters/month | **FREE** |
| After 500,000 characters | $20 per million |

**Example:** 
- Average page has ~2,000 characters
- Free tier = 250 page translations/month
- More than enough for development!

---

## 🔒 Security Tips

1. **Never commit `.env.local` to Git**
   - Already in `.gitignore` ✅
   
2. **Restrict your API key**
   - Limit to Translation API only
   - Set application restrictions if deploying

3. **Monitor usage**
   - Check Google Cloud Console regularly
   - Set up billing alerts

---

## 🎯 What Changed?

### Before (Bhashini)
```env
BHASHINI_API_KEY=...
BHASHINI_USER_ID=...
BHASHINI_PIPELINE_ID=...
```

### After (Google Translate)
```env
GOOGLE_TRANSLATE_API_KEY=AIzaSy...
```

Much simpler! Just one API key needed.

---

## ✅ Benefits of Google Translate

1. **Easier Setup** - Just one API key
2. **Better Accuracy** - Industry-leading translations
3. **More Languages** - 100+ languages supported
4. **Generous Free Tier** - 500K chars/month free
5. **Reliable** - 99.9% uptime SLA
6. **No Approval Needed** - Instant access

---

## 🆘 Troubleshooting

### API Key Not Working?
- Make sure you enabled Translation API
- Check if key is restricted correctly
- Verify project is selected in console

### Billing Error?
- Enable billing in Google Cloud Console
- Add payment method (won't be charged in free tier)
- Billing must be enabled even for free tier

### Still in English?
- Restart the development server
- Check browser console for errors
- Verify API key is in `.env.local`

---

## 📚 Resources

- [Google Cloud Console](https://console.cloud.google.com/)
- [Translation API Docs](https://cloud.google.com/translate/docs)
- [Pricing Calculator](https://cloud.google.com/products/calculator)

---

## 🎉 You're All Set!

Once you add the API key and restart, your translation feature will work perfectly with all 11 Indian languages!
