# TSOK Platform - Admin Guide

## 📸 1. HOW TO SET COURSE THUMBNAILS

### Method 1: Auto-Generate from YouTube (Easiest)
When adding a course, **leave the Thumbnail URL field BLANK**. The system will automatically use the YouTube thumbnail from your first video.

**Auto-generated URL format:**
```
https://i.ytimg.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg
```

**Example:**
- Video ID: `Ot2LEzMEaGQ`
- Auto thumbnail: `https://i.ytimg.com/vi/Ot2LEzMEaGQ/maxresdefault.jpg`

### Method 2: Upload Custom Thumbnail

**Steps:**
1. **Prepare your image:**
   - Size: 1280x720px (16:9 aspect ratio) recommended
   - Format: JPG or PNG
   - File size: Under 2MB

2. **Upload to image host:**
   
   **Option A: Imgur (Easiest)**
   - Go to https://imgur.com
   - Click "New post"
   - Upload your image
   - Right-click image → "Copy image address"
   - Paste URL in course form

   **Option B: Cloudinary**
   - Go to https://cloudinary.com
   - Sign up (free)
   - Upload image
   - Copy URL

   **Option C: ImgBB**
   - Go to https://imgbb.com
   - Upload image (no account needed)
   - Copy direct link

3. **Add to course:**
   - Go to Admin → Add New Course
   - Paste URL in "Thumbnail URL (Optional)" field
   - Save

---

## 👥 2. USER MANAGEMENT - Why Users Don't Appear

### Problem: "No users yet" even though users registered

This can happen for 2 reasons:

### **Reason 1: Firestore Security Rules**

Users might be created in Firebase Authentication but NOT in Firestore database.

**Check Firebase Rules:**
1. Go to Firebase Console
2. Click **Firestore Database**
3. Click **Rules** tab
4. Make sure you have this rule:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;  // ← IMPORTANTE!
    }
    
    // Courses
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Progress
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish**

### **Reason 2: Check Firebase Authentication**

**Verify users exist:**
1. Firebase Console → **Authentication**
2. Click **Users** tab
3. You should see registered users here

**If users are in Authentication but NOT in Firestore:**
- The registration process failed to create Firestore document
- Check browser console for errors
- Make sure Firestore rules allow `create`

### **How to Fix:**

**Option 1: Delete & Re-register**
1. Firebase Console → Authentication
2. Delete test users
3. Have them register again
4. Check if they appear in Firestore

**Option 2: Manually Create Firestore Document**
1. Firebase Console → Firestore Database
2. Click "+ Start collection"
3. Collection ID: `users`
4. Click "Next"
5. Document ID: (copy from Authentication UID)
6. Add fields:
   ```
   name: "User Name"
   email: "user@email.com"
   createdAt: "2025-12-26T10:00:00.000Z"
   progress: {}
   ```
7. Save

---

## 📊 3. USER PROGRESS TRACKING

### How It Works:
- When a user completes a video, it's saved to Firestore
- Progress stored in `users/{userId}/progress` field
- Admin can see: "X courses enrolled"

### View User Progress:
1. Admin Dashboard → Users
2. See "Progress" column
3. Shows number of courses enrolled

### If Progress Not Showing:
- User hasn't started any courses yet
- User hasn't completed any videos
- Firestore rules blocking read access

---

## 🔧 4. TROUBLESHOOTING

### Users Not Appearing in Admin Panel

**Step 1: Check Firestore Database**
```
Firebase Console → Firestore Database → users collection
```
- Should see documents with user UIDs
- Each document should have: name, email, createdAt, progress

**Step 2: Check Firestore Rules**
```
Rules tab → Verify "allow create" for users
```

**Step 3: Check Browser Console**
```
F12 → Console → Look for errors
Common errors:
- "Missing or insufficient permissions"
- "PERMISSION_DENIED"
```

**Step 4: Test New Registration**
```
1. Open incognito window
2. Register new user
3. Check Firebase Console immediately
4. User should appear in both:
   - Authentication → Users
   - Firestore → users collection
```

### Thumbnails Not Showing

**Check:**
1. YouTube video is "Unlisted" (not "Private")
2. Video ID is correct
3. Thumbnail URL is accessible
4. Try full URL in browser to verify

**Fix:**
1. Delete course
2. Re-create with correct video ID
3. Or edit course and update thumbnail URL

---

## 💡 BEST PRACTICES

### For Thumbnails:
✅ Use YouTube auto-thumbnails (easiest)
✅ If custom: Use 1280x720px images
✅ Host on reliable service (Imgur, Cloudinary)
✅ Test URL in browser first

### For User Management:
✅ Check Firestore rules allow user creation
✅ Monitor Firebase Console after registrations
✅ Test with dummy account first
✅ Keep Authentication & Firestore in sync

---

## 📞 QUICK REFERENCE

**Add Course with Auto Thumbnail:**
1. Admin → Add New Course
2. Fill course info
3. Leave "Thumbnail URL" BLANK
4. Add video with YouTube ID
5. Save → Thumbnail auto-generates

**Check User Data:**
1. Firebase Console → Firestore Database
2. Navigate to `users` collection
3. See all registered users

**Update Firestore Rules:**
1. Firebase Console → Firestore Database
2. Rules tab
3. Copy rules from above
4. Publish

---

**Developed by Heber Mayormita, LPT** 🚀
