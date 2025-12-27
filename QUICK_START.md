# TSOK Learning Platform - QUICK START GUIDE

## 🚨 IMPORTANTE: Firebase Setup FIRST!

**Bawal mag-deploy without Firebase config!**

---

## ✅ Step 1: Setup Firebase (10 minutes)

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `tsok-learning-platform`
4. Click "Continue"
5. Disable Google Analytics (optional)
6. Click "Create project"

### 1.2 Enable Firestore Database
1. Click "Firestore Database" sa sidebar
2. Click "Create database"
3. **Start in production mode**
4. Location: Choose closest to Kuwait (europe-west or asia-south)
5. Click "Enable"

### 1.3 Add Security Rules
Click "Rules" tab:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Click "Publish"

### 1.4 Enable Authentication
1. Click "Authentication" sa sidebar
2. Click "Get started"
3. Click "Email/Password"
4. Toggle "Enable"
5. Click "Save"

### 1.5 Get Firebase Config (IMPORTANTE!)
1. Click gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click "</>" (Web icon)
4. App nickname: `TSOK Web App`
5. Click "Register app"
6. **COPY ang firebaseConfig!** Tigom-a ni:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // COPY THIS
  authDomain: "your-project.firebaseapp.com",  // COPY THIS
  projectId: "your-project-id",   // COPY THIS
  storageBucket: "your-project.appspot.com",   // COPY THIS
  messagingSenderId: "123456789", // COPY THIS
  appId: "1:123:web:abc123"       // COPY THIS
};
```

**Tigom-a ni sa notepad! Need ni later!**

---

## ✅ Step 2: Push to GitHub

```bash
cd tsok-learning-platform

# Initialize git
git init
git add .
git commit -m "Initial commit - TSOK Learning Platform"
git branch -M main

# Add your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

---

## ✅ Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Click "Import"

### 3.2 Configure Project
- **Framework Preset:** Next.js (auto-detected) ✅
- **Root Directory:** `./` ✅
- **Build Command:** Leave default ✅
- **Output Directory:** Leave default ✅
- **Install Command:** Leave default ✅

### 3.3 Add Environment Variables ⚠️ MOST IMPORTANTE!

Click "Environment Variables" then add these **EXACTLY**:

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIza... (from step 1.5)

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: your-project.firebaseapp.com (from step 1.5)

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: your-project-id (from step 1.5)

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: your-project.appspot.com (from step 1.5)

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789 (from step 1.5)

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:123:web:abc123 (from step 1.5)
```

**⚠️ CRITICAL:**
- All variable names MUST start with `NEXT_PUBLIC_`
- Copy values from Firebase config (Step 1.5)
- No quotes, no spaces
- Exact spelling

### 3.4 Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. ✅ Success!

---

## ✅ Step 4: Add Vercel Domain to Firebase

1. Copy your Vercel URL: `https://your-app.vercel.app`
2. Go to Firebase Console
3. Authentication → Settings → Authorized domains
4. Click "Add domain"
5. Paste: `your-app.vercel.app`
6. Click "Add"

---

## ✅ Step 5: Create Admin Account

### Option 1: Via Firebase Console
1. Firebase Console → Authentication
2. Click "Add user"
3. Email: `admin@tsok.org` (or your email)
4. Password: (your password)
5. Click "Add user"

### Option 2: Register First User
1. Visit `https://your-app.vercel.app/register`
2. Register with your email
3. This becomes admin account

---

## 🎉 Step 6: Test Everything

Visit your site and test:

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Can register: `/register`
- [ ] Can login: `/login`
- [ ] Courses page: `/courses`
- [ ] Admin login: `/admin/login`
- [ ] Admin dashboard: `/admin`

If ALL work = SUCCESS! 🎉

---

## 🆘 Troubleshooting

### Build Error: "Firebase: Error (auth/invalid-api-key)"
**Problem:** Environment variables not set or wrong
**Solution:**
1. Vercel Dashboard → Your Project → Settings
2. Environment Variables
3. Check ALL 6 variables are there
4. Check values match Firebase config
5. Redeploy

### Build Error: "Module not found"
**Problem:** This version already fixed!
**Solution:** Make sure you deployed the latest code

### Build Error: "Metadata themeColor"
**Problem:** This version already fixed!
**Solution:** Make sure you deployed the latest code

### Homepage loads but can't login
**Problem:** Vercel domain not authorized in Firebase
**Solution:** Follow Step 4 again

### Can't access admin dashboard
**Problem:** No admin account created
**Solution:** Follow Step 5 to create admin

---

## 📋 Environment Variables Quick Reference

Copy-paste template (replace values):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def
```

---

## 💡 Common Mistakes

❌ Forgot to add environment variables  
❌ Typo in variable names (missing NEXT_PUBLIC_)  
❌ Copied wrong values from Firebase  
❌ Didn't authorize Vercel domain in Firebase  
❌ Didn't enable Firestore Database  
❌ Didn't enable Authentication  

---

## 🎯 After Successful Deployment

### Add Your First Course:
1. Login to `/admin/login`
2. Click "Add New Course"
3. Upload videos to YouTube (Unlisted)
4. Fill course form
5. Add modules and videos
6. Save
7. Course appears live instantly!

### Read Full Documentation:
- `README_ADMIN.md` - Admin features
- `ADMIN_GUIDE_BISAYA.md` - Bisaya admin guide
- `DEPLOYMENT_GUIDE.md` - Detailed deployment

---

## 📞 Need Help?

**Checklist:**
- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Authentication enabled
- [ ] Got Firebase config
- [ ] Added ALL 6 environment variables to Vercel
- [ ] Authorized Vercel domain in Firebase
- [ ] Created admin account

If all checked = Should work!

---

## 💰 Costs

- Firebase: FREE (50K reads/day)
- Vercel: FREE (unlimited bandwidth)
- YouTube: FREE (unlimited videos)
- **Total: $0/month** 💵

---

**FOLLOW THESE STEPS EXACTLY AND IT WILL WORK!** 🚀

The most common error is missing environment variables. Make sure you add ALL 6!
