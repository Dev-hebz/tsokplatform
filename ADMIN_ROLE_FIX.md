# 🔧 QUICK FIX - Set Admin Role

## Problem: 
You're logged in with admin email but getting "Access denied" because your Firestore user document doesn't have `role: admin` yet.

## Solution (2 Options):

---

## OPTION 1: Manual Fix via Firebase Console (FASTEST - 2 minutes)

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com
2. Select your project: **tsok-learning-platform** (or your project name)

### Step 2: Navigate to Firestore
1. Click **Firestore Database** (left menu)
2. Click **Data** tab

### Step 3: Find Your User Document
1. Click **users** collection
2. Find your user document (look for your admin email)
3. Click on the document

### Step 4: Add Admin Role
1. Click **"+ Add field"** button
2. Fill in:
   ```
   Field: role
   Type: string  
   Value: admin
   ```
3. Click **Save**

### Step 5: Test
1. **Logout** from the app
2. **Login** again with admin email
3. Visit `/admin`
4. ✅ Should work now!

---

## OPTION 2: Re-register (if Option 1 doesn't work)

### Step 1: Delete Current User
**In Firebase Authentication:**
1. Firebase Console → **Authentication**
2. Click **Users** tab
3. Find your user (by email)
4. Click **three dots (⋮)** → **Delete user**
5. Confirm

**In Firestore Database:**
1. Firebase Console → **Firestore Database**
2. **users** collection
3. Find your user document
4. Click **three dots (⋮)** → **Delete document**
5. Confirm

### Step 2: Make Sure Admin Email is Set
1. Check file: `src/lib/adminAuth.ts`
2. Verify your email is in ADMIN_EMAILS:
   ```typescript
   export const ADMIN_EMAILS = [
     'youremail@gmail.com',  // ← YOUR EMAIL HERE
   ];
   ```
3. If not there, add it and deploy first!

### Step 3: Register Again
1. Go to `/register`
2. Register with your admin email
3. System will auto-set `role: admin`
4. Login
5. Visit `/admin`
6. ✅ Should work!

---

## VERIFICATION - Check if Role is Set

### Via Firebase Console:
1. Firestore Database → users collection
2. Click your user document
3. You should see:
   ```
   email: "youremail@gmail.com"
   name: "Your Name"
   role: "admin"  ← THIS MUST BE PRESENT!
   createdAt: "2025-12-27..."
   progress: {}
   ```

### Via Browser Console (when logged in):
1. Login to the app
2. Press F12 (open developer tools)
3. Go to **Console** tab
4. Type:
   ```javascript
   auth.currentUser.uid
   ```
5. Copy the user ID
6. Check Firestore using that ID

---

## TROUBLESHOOTING

### Problem: Still getting "Access denied" after adding role
**Solutions:**
1. **Clear browser cache** (Ctrl + Shift + Del)
2. **Logout and login again**
3. **Try incognito window**
4. **Check email spelling** in ADMIN_EMAILS exactly matches

### Problem: Can't find my user in Firestore
**Causes:**
1. Registration didn't complete
2. Firestore rules blocking writes
3. User only in Authentication, not Firestore

**Solution:**
1. Check Authentication → Users (user should be there)
2. If user exists but not in Firestore → Re-register

### Problem: Role field exists but still denied
**Check:**
1. Value is exactly `admin` (lowercase, no spaces)
2. Type is `string` (not number or boolean)
3. Logout/login after changing

---

## QUICK CHECKLIST

- [ ] Opened Firebase Console
- [ ] Found Firestore Database
- [ ] Located users collection  
- [ ] Found my user document
- [ ] Added field: `role` = `admin`
- [ ] Saved changes
- [ ] Logged out of app
- [ ] Logged in again
- [ ] Visited `/admin`
- [ ] ✅ Works!

---

## IMPORTANT NOTES

### Your Admin Email in Code
File: `src/lib/adminAuth.ts`
```typescript
export const ADMIN_EMAILS = [
  '1@gmail.com',  // ← REPLACE THIS!
];
```

**You MUST change this to your real email before deploying!**

Example:
```typescript
export const ADMIN_EMAILS = [
  'heber.mayormita@gmail.com',  // ← Your real email
];
```

Then deploy:
```bash
git add .
git commit -m "Updated admin email"
git push
```

---

## VISUAL GUIDE

### What it should look like in Firestore:

```
users (collection)
  └── abc123xyz (document) ← Your user ID
       ├── email: "youremail@gmail.com"
       ├── name: "Your Name"  
       ├── role: "admin" ← ADD THIS FIELD!
       ├── createdAt: "2025-12-27T10:00:00.000Z"
       └── progress: {}
```

### Admin vs Student comparison:

**Admin User:**
```javascript
{
  email: "admin@tsok.com",
  name: "Admin Name",
  role: "admin",  // ← Has this
  createdAt: "...",
  progress: {}
}
```

**Student User:**
```javascript
{
  email: "student@gmail.com", 
  name: "Student Name",
  role: "student",  // ← Different role
  createdAt: "...",
  progress: {}
}
```

---

## AFTER FIXING

### Admin Can Access:
✅ `/admin` - Dashboard
✅ `/admin/users` - View users
✅ `/admin/courses/add` - Add courses  
✅ `/courses` - Browse courses (like students)

### Students Cannot Access:
🚫 `/admin` - Blocked
🚫 `/admin/users` - Blocked
🚫 `/admin/courses/add` - Blocked
✅ `/courses` - Can browse (allowed)

---

**USE OPTION 1 - Manual Firebase Fix!**

It's the fastest (2 minutes) and safest! 💪

After adding `role: admin`, logout, login, and test `/admin` again! 🚀
