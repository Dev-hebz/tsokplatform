# TSOK Learning Platform

**Teachers Specialists Organization of Kuwait - Learning Platform**

A modern, mobile-friendly learning management system with YouTube video integration, Firebase backend, and PWA capabilities.

![TSOK Logo](public/tsok-logo.png)

## 🎓 Features

- ✅ **YouTube Video Integration** - Host unlimited educational videos for free
- ✅ **Progressive Web App (PWA)** - Install on mobile and desktop
- ✅ **Course Management** - Organized modules and lessons
- ✅ **Progress Tracking** - Track student completion and learning journey
- ✅ **Firebase Backend** - Real-time database and authentication
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **TSOK Branding** - Custom logo and color scheme
- ✅ **User Authentication** - Secure login with Firebase Auth
- ✅ **Google Login** - Quick sign-in with Google account

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **Video Hosting**: YouTube (Unlisted/Private)
- **Icons**: Lucide React
- **Video Player**: react-youtube
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd tsok-learning-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password and Google)
   - Copy your Firebase config

4. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎬 Adding Courses and Videos

### 1. Upload Videos to YouTube

1. Upload your educational videos to YouTube
2. Set privacy to **Unlisted** (recommended) or Private
3. Copy the video ID from the URL
   - Example: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Video ID: `dQw4w9WgXcQ`

### 2. Add Course to Firestore

Create a document in the `courses` collection:

```javascript
{
  "title": "Introduction to Teaching Methods",
  "description": "Master modern teaching strategies",
  "thumbnail": "https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg",
  "category": "Pedagogy",
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: Foundations",
      "videos": [
        {
          "id": "video-1",
          "title": "Introduction to Pedagogy",
          "youtubeId": "dQw4w9WgXcQ", // Your YouTube video ID
          "duration": "15:30",
          "description": "Learn the fundamentals",
          "order": 1
        }
      ]
    }
  ]
}
```

## 🌐 Deployment to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables (same as .env.local)
   - Click "Deploy"

3. **Configure Firebase for Production**
   - Add your Vercel domain to Firebase authorized domains
   - Firebase Console → Authentication → Settings → Authorized domains

## 📱 Installing as PWA

### On Mobile (Android/iOS):
1. Open the website in Chrome/Safari
2. Tap the menu (three dots)
3. Select "Add to Home Screen"
4. The app will install with the TSOK logo

### On Desktop (Chrome/Edge):
1. Open the website
2. Click the install icon in the address bar
3. Click "Install"

## 🎨 Customization

### Update Logo
Replace files in `/public`:
- `tsok-logo.png` - Main logo
- `icon-192.png` - PWA icon (192x192)
- `icon-512.png` - PWA icon (512x512)
- `favicon-*.png` - Browser favicons

### Update Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  tsok: {
    blue: '#1e3a8a',    // Primary blue
    red: '#dc2626',      // Accent red
    yellow: '#fbbf24',   // Accent yellow
    green: '#16a34a',    // Accent green
  },
}
```

## 📊 Firebase Collections Structure

### `courses`
```javascript
{
  id: string,
  title: string,
  description: string,
  thumbnail: string,
  category: string,
  modules: Array<Module>
}
```

### `users`
```javascript
{
  uid: string,
  name: string,
  email: string,
  createdAt: string,
  progress: object
}
```

### `progress`
```javascript
{
  userId: string,
  courses: {
    [courseId]: {
      completed: string[], // Array of completed video IDs
      lastAccessed: string
    }
  }
}
```

## 🔒 Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
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

## 💡 Tips

1. **Free Hosting Limits**:
   - YouTube: Unlimited video storage
   - Firebase Free Tier: 50K reads/day, 20K writes/day
   - Vercel: Unlimited bandwidth for personal projects

2. **Video Quality**:
   - Upload highest quality to YouTube
   - YouTube automatically creates different quality versions
   - Students can choose quality based on internet speed

3. **SEO Benefits**:
   - Unlisted videos can still be indexed
   - Use descriptive titles and descriptions
   - Add your website URL in video descriptions

## 🛠️ Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 License

© 2024 TSOK - Teachers Specialists Organization of Kuwait  
Developed by **Godmisoft**

## 🤝 Support

For issues or questions, please contact the TSOK admin team.

---

**Developed with ❤️ by Godmisoft**
