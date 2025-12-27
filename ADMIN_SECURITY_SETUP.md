# 🔒 ADMIN SECURITY SETUP GUIDE

## ⚠️ IMPORTANT - SECURITY FIX APPLIED

The platform now has **ROLE-BASED ACCESS CONTROL**. Regular students can NO LONGER access admin dashboard.

---

## 🛡️ How Admin Security Works Now:

### **1. Role Assignment**
When users register, they are assigned a role based on their email:

```javascript
// Admin emails (defined in src/lib/adminAuth.ts)
ADMIN_EMAILS = [
  '1@gmail.com',  // Your admin email
  // Add more admins here
]

// User role assignment:
role: 'admin'   ← If email is in ADMIN_EMAILS
role: 'student' ← All other emails
```

### **2. Admin Pages Protected**
All admin pages now check user role:
- ✅ `/admin` - Dashboard
- ✅ `/admin/users` - User management
- ✅ `/admin/courses/add` - Add course
- ✅ `/admin/courses/edit/[id]` - Edit course

**Access denied for students:**
- 🚫 Alert: "Access denied. Admin privileges required."
- 🚫 Redirect to: `/courses` (student area)

---

## 📝 SETUP INSTRUCTIONS:

### **Step 1: Add Your Admin Email**

1. Open: `src/lib/adminAuth.ts`
2. Find the `ADMIN_EMAILS` array:

```typescript
export const ADMIN_EMAILS = [
  '1@gmail.com', // Replace with your admin email
  // Add more admin emails:
  // 'admin2@tsok.com',
  // 'admin3@tsok.com',
];
```

3. **Replace** `'1@gmail.com'` with your actual admin email
4. **Add** more admin emails if needed (one per line)
5. **Save** the file

### **Step 2: Update Existing Admin User in Firebase**

If you already registered with your admin email:

**Option A: Via Firebase Console**
1. Firebase Console → Firestore Database
2. Navigate to: `users` collection
3. Find your user document (by email)
4. Click document
5. Add/Edit field:
   ```
   Field: role
   Type: string
   Value: admin
   ```
6. Save

**Option B: Re-register**
1. Firebase Console → Authentication
2. Delete your current user
3. Register again with admin email
4. Role will be set automatically

### **Step 3: Update Existing Students**

For all existing students (if any):

1. Firebase Console → Firestore Database
2. Users collection
3. For each student document:
   - Add field: `role` = `student`
   - Or delete and have them re-register

---

## 🔐 ADMIN EMAIL EXAMPLES:

```typescript
// Single admin
export const ADMIN_EMAILS = [
  'yourname@gmail.com',
];

// Multiple admins
export const ADMIN_EMAILS = [
  'admin@tsok.com',
  'director@tsok.com',
  'coordinator@tsok.com',
];

// Important: Use lowercase emails!
```

---

## ✅ HOW TO TEST:

### **Test 1: Admin Access (Should Work)**
1. Register/Login with admin email (from ADMIN_EMAILS list)
2. Visit `/admin`
3. ✅ Should see admin dashboard
4. ✅ Can add/edit courses
5. ✅ Can view users

### **Test 2: Student Access (Should Block)**
1. Register/Login with non-admin email
2. Try to visit `/admin`
3. 🚫 Should see "Access denied" alert
4. 🚫 Redirected to `/courses`
5. ✅ Can browse courses normally

### **Test 3: Direct URL Access**
1. Login as student
2. Type in browser: `https://your-app.vercel.app/admin/users`
3. 🚫 Should be blocked
4. 🚫 Redirected to `/courses`

---

## 🔧 FIREBASE SECURITY RULES (Optional but Recommended):

Add server-side protection in Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Courses - Admin can write, everyone can read
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && isAdmin();
    }
    
    // Users - Own data + admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || isAdmin());
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null;
    }
    
    // Progress
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**To apply:**
1. Firebase Console → Firestore Database
2. Rules tab
3. Copy rules above
4. Publish

---

## 📊 USER ROLES:

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| **admin** | ✅ Admin dashboard<br>✅ Add/edit courses<br>✅ View all users<br>✅ Student courses | ❌ Nothing restricted |
| **student** | ✅ Browse courses<br>✅ Watch videos<br>✅ Track progress | ❌ Admin dashboard<br>❌ Add/edit courses<br>❌ View other users |

---

## 🚨 TROUBLESHOOTING:

### **Problem: Admin can't access dashboard**
**Solution:**
1. Check `src/lib/adminAuth.ts` - is your email in ADMIN_EMAILS?
2. Check email is **exact match** (including lowercase)
3. Check Firestore - does your user document have `role: 'admin'`?

### **Problem: Student can access admin**
**Solution:**
1. Clear browser cache
2. Logout and login again
3. Check if code was deployed to Vercel
4. Verify student doesn't have `role: 'admin'` in Firestore

### **Problem: "Access denied" but I am admin**
**Solution:**
1. Check browser console for errors (F12)
2. Verify Firebase connection
3. Check Firestore rules allow reading users collection
4. Re-deploy to Vercel

---

## 🎯 QUICK CHECKLIST:

- [ ] Updated `ADMIN_EMAILS` in `src/lib/adminAuth.ts`
- [ ] Added your admin email
- [ ] Deployed to Vercel
- [ ] Updated existing admin user in Firestore (`role: 'admin'`)
- [ ] Tested admin login → Can access `/admin` ✅
- [ ] Tested student login → Cannot access `/admin` 🚫
- [ ] Optional: Updated Firestore security rules

---

## 📞 ADDING MORE ADMINS LATER:

**Simple 3-step process:**

1. **Add email to list:**
   ```typescript
   // src/lib/adminAuth.ts
   export const ADMIN_EMAILS = [
     'existing@admin.com',
     'new@admin.com',  // ← Add here
   ];
   ```

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Added new admin"
   git push
   ```

3. **Have them register:**
   - New admin registers with their email
   - Role automatically set to 'admin'
   - Can access dashboard immediately

---

## 🎉 SECURITY SUMMARY:

**Before (Insecure):**
```
❌ Any logged-in user → Can access /admin
❌ Students → Can add/delete courses
❌ No role checking
```

**After (Secure):**
```
✅ Only admins → Can access /admin
✅ Students → Blocked with alert
✅ Role-based access control
✅ Easy to add/remove admins
```

---

**Developed by Heber Mayormita, LPT** 🔒
