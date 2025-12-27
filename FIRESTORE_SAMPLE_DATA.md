# Sample Firestore Data for TSOK Learning Platform

## How to Add This Data to Firebase

1. Go to Firebase Console → Firestore Database
2. Click "Start Collection"
3. Collection ID: `courses`
4. Add documents with the data below

---

## Sample Course 1: Introduction to Teaching Methods

**Document ID**: `course-001` (or auto-generate)

```json
{
  "title": "Introduction to Teaching Methods",
  "description": "Master modern teaching strategies and classroom management techniques for effective education",
  "thumbnail": "https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg",
  "category": "Pedagogy",
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: Foundations of Teaching",
      "videos": [
        {
          "id": "video-1",
          "title": "Introduction to Modern Pedagogy",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "15:30",
          "description": "Learn the fundamentals of modern teaching approaches and methodologies",
          "order": 1
        },
        {
          "id": "video-2",
          "title": "Understanding Learning Styles",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "12:45",
          "description": "Explore different learning styles and how to adapt your teaching accordingly",
          "order": 2
        },
        {
          "id": "video-3",
          "title": "Effective Lesson Planning",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "18:20",
          "description": "Master the art of creating comprehensive and engaging lesson plans",
          "order": 3
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Module 2: Classroom Management",
      "videos": [
        {
          "id": "video-4",
          "title": "Creating a Positive Learning Environment",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "16:10",
          "description": "Strategies for maintaining an engaging and productive classroom atmosphere",
          "order": 4
        },
        {
          "id": "video-5",
          "title": "Behavior Management Techniques",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "14:35",
          "description": "Effective approaches to managing student behavior and maintaining discipline",
          "order": 5
        }
      ]
    },
    {
      "id": "module-3",
      "title": "Module 3: Student Engagement",
      "videos": [
        {
          "id": "video-6",
          "title": "Interactive Teaching Methods",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "17:45",
          "description": "Learn techniques to keep students actively engaged in learning",
          "order": 6
        },
        {
          "id": "video-7",
          "title": "Using Technology in the Classroom",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "13:20",
          "description": "Integrate educational technology effectively in your lessons",
          "order": 7
        }
      ]
    }
  ]
}
```

---

## Sample Course 2: Educational Technology Integration

**Document ID**: `course-002` (or auto-generate)

```json
{
  "title": "Educational Technology Integration",
  "description": "Learn to effectively integrate technology in your classroom for enhanced learning experiences",
  "thumbnail": "https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg",
  "category": "Technology",
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: Digital Tools Overview",
      "videos": [
        {
          "id": "video-1",
          "title": "Introduction to EdTech",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "14:25",
          "description": "Overview of educational technology and its benefits",
          "order": 1
        },
        {
          "id": "video-2",
          "title": "Essential Digital Tools for Teachers",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "16:50",
          "description": "Must-have digital tools for modern educators",
          "order": 2
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Module 2: Online Learning Platforms",
      "videos": [
        {
          "id": "video-3",
          "title": "Setting Up Virtual Classrooms",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "19:15",
          "description": "Step-by-step guide to creating effective virtual learning spaces",
          "order": 3
        },
        {
          "id": "video-4",
          "title": "Engaging Students Online",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "15:40",
          "description": "Strategies for maintaining engagement in online learning",
          "order": 4
        }
      ]
    }
  ]
}
```

---

## Sample Course 3: Student Assessment & Evaluation

**Document ID**: `course-003` (or auto-generate)

```json
{
  "title": "Student Assessment & Evaluation",
  "description": "Comprehensive guide to student assessment strategies and effective evaluation methods",
  "thumbnail": "https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg",
  "category": "Assessment",
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: Assessment Fundamentals",
      "videos": [
        {
          "id": "video-1",
          "title": "Types of Assessment",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "13:30",
          "description": "Understanding formative, summative, and diagnostic assessments",
          "order": 1
        },
        {
          "id": "video-2",
          "title": "Creating Effective Tests",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "17:25",
          "description": "Best practices for designing fair and comprehensive tests",
          "order": 2
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Module 2: Alternative Assessment Methods",
      "videos": [
        {
          "id": "video-3",
          "title": "Portfolio Assessment",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "14:50",
          "description": "Using student portfolios for comprehensive evaluation",
          "order": 3
        },
        {
          "id": "video-4",
          "title": "Performance-Based Assessment",
          "youtubeId": "YOUR_YOUTUBE_VIDEO_ID",
          "duration": "16:30",
          "description": "Evaluating students through real-world tasks and projects",
          "order": 4
        }
      ]
    }
  ]
}
```

---

## How to Get YouTube Video IDs

1. Upload your video to YouTube
2. Set privacy to **Unlisted** (recommended for courses)
3. Copy the video ID from the URL:
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - Video ID: `dQw4w9WgXcQ`

## Getting Video Thumbnails

YouTube automatically generates thumbnails. Use this format:
```
https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg
```

Replace `YOUR_VIDEO_ID` with your actual YouTube video ID.

---

## Firebase Console Steps

1. **Create Firestore Database**
   - Firebase Console → Firestore Database
   - Click "Create database"
   - Start in production mode
   - Select location closest to Kuwait

2. **Add Security Rules** (Important!)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /courses/{courseId} {
      allow read: if true;
      allow write: if false;  // Only allow through Firebase Console
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

3. **Enable Authentication**
   - Firebase Console → Authentication
   - Click "Get Started"
   - Enable "Email/Password"
   - Enable "Google" (optional)

4. **Add Authorized Domains**
   - Authentication → Settings → Authorized domains
   - Add your Vercel domain (e.g., `tsok-learning.vercel.app`)

---

**Note**: Replace all `YOUR_YOUTUBE_VIDEO_ID` placeholders with your actual YouTube video IDs!
