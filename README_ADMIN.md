# TSOK Learning Platform - WITH ADMIN DASHBOARD

**Teachers-Specialists Organization of Kuwait - Learning Platform**

A complete learning management system with **DYNAMIC ADMIN DASHBOARD** for easy course management, YouTube video integration, Firebase backend, and PWA capabilities.

![TSOK Logo](public/tsok-logo.png)

## 🎉 NEW: DYNAMIC ADMIN DASHBOARD

### ✨ Admin Features:
- ✅ **Real-time Course Management** - Add/Edit/Delete courses instantly
- ✅ **Easy-to-use Interface** - No coding required!
- ✅ **Dynamic Module Builder** - Add modules and videos with simple forms
- ✅ **User Management** - View all registered students
- ✅ **Live Updates** - Changes appear immediately to all users
- ✅ **Statistics Dashboard** - Track courses, videos, and students
- ✅ **YouTube Integration** - Just paste video IDs, that's it!

## 🚀 Quick Start for Admins

### 1. Access Admin Panel
```
https://your-site.com/admin/login
```

### 2. Login with Admin Credentials
- Use your Firebase email/password

### 3. Start Managing Courses!
- Click "Add New Course"
- Fill in course details
- Add modules
- Add videos (just paste YouTube video IDs)
- Click "Save"
- **BOOM!** Live immediately! 🎉

## 📋 How to Add a Course (Step-by-Step)

### Step 1: Upload Video to YouTube
1. Go to YouTube Studio
2. Upload your video
3. Set to **Unlisted** (recommended)
4. Copy the video ID:
   - URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Video ID: `dQw4w9WgXcQ`

### Step 2: Add Course in Admin Dashboard
1. Login to `/admin`
2. Click "Add New Course"
3. Fill in:
   - **Course Title**: e.g., "Introduction to Teaching"
   - **Description**: What students will learn
   - **Category**: e.g., "Pedagogy"
   - **Thumbnail**: (optional, auto-generated from first video)

### Step 3: Add Modules
1. Click "Add Module"
2. Enter module title: e.g., "Module 1: Foundations"
3. Click "Add Video" inside the module
4. Fill in video details:
   - **Title**: e.g., "Introduction to Pedagogy"
   - **YouTube ID**: `dQw4w9WgXcQ` (from Step 1)
   - **Duration**: e.g., "15:30"
   - **Description**: Brief summary

### Step 4: Save!
1. Click "Create Course"
2. Course appears **INSTANTLY** to all users! ⚡

## 🎓 Features

### For Students:
- ✅ **YouTube Video Integration** - Watch unlimited educational videos
- ✅ **Progressive Web App (PWA)** - Install on mobile and desktop
- ✅ **Course Management** - Organized modules and lessons
- ✅ **Progress Tracking** - Track completed videos
- ✅ **Responsive Design** - Works on all devices
- ✅ **User Authentication** - Secure login with Firebase Auth

### For Admins:
- ✅ **Admin Dashboard** - Complete control panel
- ✅ **Course Builder** - Easy drag-and-drop interface
- ✅ **Real-time Updates** - Changes sync instantly
- ✅ **User Analytics** - See who's learning what
- ✅ **Video Management** - Add/edit/delete videos easily
- ✅ **No Technical Skills Needed** - User-friendly interface

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Video Hosting**: YouTube (Unlisted/Private)
- **Admin Panel**: Custom-built with real-time sync
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone repository
git clone <your-repo-url>
cd tsok-learning-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Fill in your Firebase credentials

# Run development server
npm run dev
```

## 🔐 Creating First Admin Account

### Method 1: Via Firebase Console (Recommended)
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter admin email and password
4. Use these credentials to login at `/admin/login`

### Method 2: Register First User
1. Register at `/register`
2. This becomes your admin account
3. Login at `/admin/login`

## 🎯 Admin Dashboard Routes

```
/admin              - Dashboard home
/admin/login        - Admin login
/admin/courses/add  - Add new course
/admin/courses/edit/[id] - Edit course
/admin/users        - View all users
```

## 📊 Firebase Collections Structure

### `courses` Collection
```javascript
{
  id: "auto-generated",
  title: "Course Title",
  description: "Course description",
  category: "Category name",
  thumbnail: "URL to thumbnail",
  modules: [
    {
      id: "module-1",
      title: "Module Title",
      videos: [
        {
          id: "video-1",
          title: "Video Title",
          youtubeId: "YouTube Video ID",
          duration: "15:30",
          description: "Video description",
          order: 1
        }
      ]
    }
  ],
  createdAt: "ISO date",
  updatedAt: "ISO date"
}
```

### `users` Collection
```javascript
{
  uid: "user-id",
  name: "User Name",
  email: "user@email.com",
  createdAt: "ISO date",
  progress: {
    "course-id": {
      completed: ["video-1", "video-2"]
    }
  }
}
```

## 🔒 Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Courses - public read, admin write
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users - own data only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Progress - own data only
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🌐 Deployment to Vercel

```bash
# Push to GitHub
git add .
git commit -m "TSOK Learning Platform with Admin Dashboard"
git push

# Deploy to Vercel
# 1. Go to vercel.com
# 2. Import repository
# 3. Add environment variables
# 4. Deploy!
```

## 💰 Costs (ALL FREE!)

- **Videos**: YouTube = FREE unlimited storage
- **Backend**: Firebase = FREE (50K reads/day, 20K writes/day)
- **Hosting**: Vercel = FREE unlimited bandwidth
- **Admin Dashboard**: FREE (built-in)

**Total Monthly Cost: $0** 💵

## 📱 PWA Installation

### Mobile:
1. Open site in browser
2. Tap "Add to Home Screen"
3. App installs with TSOK logo

### Desktop:
1. Open site in Chrome/Edge
2. Click install icon in address bar
3. Click "Install"

## 🎨 Customization

### Update Logo
Replace in `/public`:
- `tsok-logo.png`
- `icon-192.png`
- `icon-512.png`
- `favicon-*.png`

### Update Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  tsok: {
    blue: '#1e3a8a',
    red: '#dc2626',
    yellow: '#fbbf24',
    green: '#16a34a',
  },
}
```

## 🆘 Common Admin Tasks

### Add a New Course
1. Login → Admin Dashboard
2. Click "Add New Course"
3. Fill form → Add modules → Add videos
4. Click "Create Course"

### Edit Existing Course
1. Admin Dashboard → Find course
2. Click edit icon (pencil)
3. Make changes
4. Click "Update Course"

### Delete a Course
1. Admin Dashboard → Find course
2. Click delete icon (trash)
3. Confirm deletion

### View Students
1. Admin Dashboard → Click "Users"
2. See all registered students
3. Search by name or email

## 🔧 Troubleshooting

### Can't Login to Admin?
- Verify email/password in Firebase Console
- Check if authentication is enabled
- Try password reset

### Changes Not Appearing?
- Check browser console for errors
- Verify Firebase rules allow writes
- Refresh the page

### Videos Not Playing?
- Verify YouTube video IDs are correct
- Check videos are Unlisted (not Private)
- Test video URL directly on YouTube

## 📖 Documentation Files

- `README.md` - This file
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- `FIRESTORE_SAMPLE_DATA.md` - Sample course data
- `.env.local.example` - Environment variables template

## 🎉 Success Stories

> "Super dali ra kaayo mag-add ug courses! No need coding!" - Admin User

> "Changes appear instantly, perfect for our teachers!" - TSOK Manager

## 📞 Support

For technical support:
- Check Firebase Console logs
- Check Vercel deployment logs
- Review browser console errors

## 🙏 Credits

© 2024 TSOK - Teachers Specialists Organization of Kuwait  
**Developed by Godmisoft** 🚀

---

**Made with ❤️ for Filipino Teachers in Kuwait**
