# TSOK Learning Platform - Complete Deployment Guide

## 📋 Pre-Deployment Checklist

- [ ] All videos uploaded to YouTube as Unlisted
- [ ] Firebase project created
- [ ] GitHub repository created
- [ ] Environment variables ready

---

## 🔥 Step 1: Firebase Setup (15 minutes)

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `tsok-learning-platform`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. **Start in production mode**
4. Choose location: **asia-south1** (closest to Kuwait)
5. Click "Enable"

### 1.3 Add Security Rules

Click "Rules" tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Courses - public read, no public write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Users - can only access own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progress - can only access own progress
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

### 1.4 Enable Authentication

1. Click "Authentication" in sidebar
2. Click "Get started"
3. Click "Email/Password"
   - Enable "Email/Password"
   - Enable "Email link (passwordless sign-in)" (optional)
4. Click "Google" (optional for Google login)
   - Enable
   - Enter your email as project support email
5. Click "Save"

### 1.5 Get Firebase Config

1. Click gear icon (⚙️) → Project settings
2. Scroll down to "Your apps"
3. Click web icon (</>) to add web app
4. Enter app nickname: `TSOK Learning Web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **COPY the firebaseConfig object** - you'll need this!

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tsok-learning-platform.firebaseapp.com",
  projectId: "tsok-learning-platform",
  storageBucket: "tsok-learning-platform.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🎬 Step 2: Prepare YouTube Videos (30 minutes)

### 2.1 Upload Videos

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Upload your educational videos
4. For each video:
   - Add clear title
   - Add description with your website URL
   - Set visibility to **Unlisted**
   - Add to a playlist (e.g., "TSOK Courses")
   - Add tags: education, teaching, TSOK

### 2.2 Get Video IDs

From each video URL:
- URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

Create a list of all your video IDs.

---

## 📊 Step 3: Add Courses to Firestore (20 minutes)

1. Go to Firebase Console → Firestore Database
2. Click "Start collection"
3. Collection ID: `courses`
4. Click "Next"

### For Each Course:

1. Click "Add document"
2. Document ID: Auto-ID or `course-001`, `course-002`, etc.
3. Add fields (refer to `FIRESTORE_SAMPLE_DATA.md` for structure)
4. Click "Save"

**Quick Template:**
```
Field: title
Type: string
Value: Your Course Title

Field: description
Type: string
Value: Your course description

Field: thumbnail
Type: string
Value: https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg

Field: category
Type: string
Value: Pedagogy

Field: modules
Type: array
Value: [Click "Add item" to create module objects]
```

---

## 💻 Step 4: GitHub Setup (10 minutes)

### 4.1 Create Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `tsok-learning-platform`
4. Privacy: Public or Private (your choice)
5. Click "Create repository"

### 4.2 Push Code

```bash
cd tsok-learning-platform

# Initialize git
git init
git add .
git commit -m "Initial commit: TSOK Learning Platform"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/tsok-learning-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Step 5: Vercel Deployment (10 minutes)

### 5.1 Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Click "Import"

### 5.2 Configure Project

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave default)

**Build Settings**: (leave defaults)
- Build Command: `next build`
- Output Directory: `.next`
- Install Command: `npm install`

### 5.3 Add Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from Firebase config (Step 1.5)

Click "Deploy"

### 5.4 Wait for Deployment

- Vercel will build your project (2-3 minutes)
- You'll get a URL like: `https://tsok-learning-platform.vercel.app`

---

## ✅ Step 6: Post-Deployment Configuration (5 minutes)

### 6.1 Add Vercel Domain to Firebase

1. Go to Firebase Console → Authentication → Settings
2. Scroll to "Authorized domains"
3. Click "Add domain"
4. Enter your Vercel domain: `tsok-learning-platform.vercel.app`
5. Click "Add"

### 6.2 Test the Application

1. Visit your Vercel URL
2. Test features:
   - [ ] Homepage loads
   - [ ] Can navigate to courses
   - [ ] Can register new account
   - [ ] Can login
   - [ ] Videos play correctly
   - [ ] Progress tracking works
   - [ ] Responsive on mobile

---

## 📱 Step 7: PWA Installation (Optional)

### On Mobile:
1. Open site in Chrome/Safari
2. Tap menu → "Add to Home Screen"
3. Icon appears on home screen

### On Desktop:
1. Open site in Chrome/Edge
2. Click install icon in address bar
3. Click "Install"

---

## 🎨 Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain in Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Enter your domain (e.g., `learn.tsok.org`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-60 minutes)

### 8.2 Update Firebase

Add your custom domain to Firebase authorized domains (same as Step 6.1)

---

## 🔧 Troubleshooting

### Videos not loading?
- Check YouTube video IDs are correct
- Ensure videos are Unlisted (not Private)
- Check browser console for errors

### Firebase authentication errors?
- Verify domain is in authorized domains
- Check environment variables are correct
- Ensure Authentication is enabled in Firebase

### Build fails on Vercel?
- Check all environment variables are set
- View build logs for specific errors
- Ensure all dependencies are in package.json

### PWA not installing?
- Check manifest.json is accessible
- Verify icons exist in /public
- Use HTTPS (Vercel provides this automatically)

---

## 📊 Monitoring & Maintenance

### Check Firebase Usage (Monthly)
1. Firebase Console → Usage and billing
2. Monitor:
   - Firestore reads/writes
   - Authentication sign-ins
   - Storage usage

### Update Courses
1. Firebase Console → Firestore
2. Edit course documents
3. Changes reflect immediately

### Add New Videos
1. Upload to YouTube
2. Get video ID
3. Update course document in Firestore
4. Add video object to modules array

---

## 🎉 Success!

Your TSOK Learning Platform is now live!

**Share the URL:**
- https://your-app.vercel.app
- Or your custom domain

**Next Steps:**
1. Add your course content
2. Invite teachers to register
3. Monitor usage in Firebase
4. Gather feedback and improve

---

## 📞 Support

For technical issues:
- Check Firebase Console logs
- Check Vercel deployment logs
- Review browser console for errors

**Developed by Godmisoft** 🚀
