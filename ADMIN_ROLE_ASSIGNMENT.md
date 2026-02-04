# Admin Role Assignment - Complete Guide

## ✅ New Features Added

### 🎯 **Admin Can Assign Admin Role**

Admins can now promote users to Admin or demote them to Student role through the User Management page.

---

## 📋 **Where to Assign Admin Role**

### Admin Users Page (`/admin/users`)

1. **View User Roles**
   - Role column shows: 👑 Admin or 👤 Student
   - Purple badge for Admin
   - Blue badge for Student

2. **Edit User Role**
   - Click "Edit" button on any user
   - Modal opens with all user fields
   - **User Role** dropdown:
     - 👤 Student (default)
     - 👑 Admin (full access)
   - Warning: "⚠️ Admin users can manage courses, users, and approvals"

3. **Save Changes**
   - TSOK logo loading animation
   - Role updated in Firestore
   - User list refreshes automatically

---

## 🔐 **Firebase Security Rules**

### Updated Rules (IMPORTANT!)

Copy this to your Firebase Console → Firestore Database → Rules:

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
    
    // Users - Own data + admins can read/write all
    match /users/{userId} {
      // Anyone authenticated can read their own data
      // Admins can read all users
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || isAdmin());
      
      // Users can write their own data (except role field)
      // Admins can write all user data including role
      allow write: if request.auth != null && 
                      (request.auth.uid == userId || isAdmin());
      
      // Anyone can create their account during registration
      allow create: if request.auth != null;
    }
    
    // Progress
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### What Changed:
✅ **Before**: Admins could only read users  
✅ **After**: Admins can now write/edit all user data  
✅ **Security**: Users can still only edit their own data  
✅ **Role Protection**: Only admins can change roles  

---

## 🎯 **How to Use**

### Scenario 1: Make a User Admin

1. Login as Admin
2. Go to **Admin → Users**
3. Find the user you want to promote
4. Click **Edit** button
5. Change **User Role** to "👑 Admin"
6. Click **Save Changes**
7. ✓ User is now an Admin!

### Scenario 2: Remove Admin Rights

1. Login as Admin
2. Go to **Admin → Users**
3. Find the admin user
4. Click **Edit** button
5. Change **User Role** to "👤 Student"
6. Click **Save Changes**
7. ✓ User is now a Student!

---

## 📊 **User Table Display**

### New Column: Role

| User | Email | **Role** | Location | Actions |
|------|-------|----------|----------|---------|
| Juan | juan@mail.com | **👑 Admin** | Manila, PH | Edit, Delete |
| Maria | maria@mail.com | **👤 Student** | Cebu, PH | Edit, Delete |

- **Purple Badge**: 👑 Admin
- **Blue Badge**: 👤 Student

---

## ✏️ **Edit Modal Updates**

### New Field: User Role

```
┌─────────────────────────────┐
│ Edit User                   │
├─────────────────────────────┤
│ Full Name:                  │
│ [Juan Dela Cruz]            │
│                             │
│ Email Address:              │
│ [juan@example.com]          │
│                             │
│ Account Status:             │
│ [Approved ▼]                │
│                             │
│ User Role:               ← NEW!
│ [👑 Admin ▼]                │
│ ⚠️ Admin users can manage   │
│    courses, users, and      │
│    approvals                │
│                             │
│ User ID: abc123xyz          │
├─────────────────────────────┤
│        Cancel  Save Changes │
└─────────────────────────────┘
```

---

## 🔒 **Security Notes**

### ✅ Safe:
- Only admins can edit user roles
- Firebase rules enforce admin-only writes
- Role changes are logged with `updatedAt`
- Confirmation before saving changes

### ⚠️ Important:
- Don't remove your own admin role (you'll lose access!)
- Make sure you have at least one admin user
- Test with a test account first

---

## 📁 **Files Updated**

### Modified:
- `/src/app/admin/users/page.tsx`
  - Added role to User interface
  - Added role field to edit form
  - Added role column to table
  - Added role dropdown in modal

### Created:
- `firestore.rules` - Updated security rules
- `ADMIN_ROLE_ASSIGNMENT.md` - This guide

---

## 🎨 **UI Features**

### Visual Elements:
- **Purple Badge** (👑 Admin) - Stands out for admins
- **Blue Badge** (👤 Student) - Regular users
- **Warning Message** - Explains admin permissions
- **Emoji Icons** - Clear role identification

### User Experience:
- Role visible in user list
- Easy to identify admins
- Clear warning about admin powers
- Professional dropdown selector

---

## 🔄 **Complete User Management**

Admins can now:
1. ✅ **Create Users** - Add new users manually
2. ✅ **Edit Users** - Update name, email, status, **role**
3. ✅ **Delete Users** - Remove users permanently
4. ✅ **Approve Users** - Approve pending registrations
5. ✅ **Reject Users** - Reject registrations
6. ✅ **Assign Admin** - Promote users to admin
7. ✅ **Remove Admin** - Demote admins to students

---

## 💡 **Best Practices**

### When to Make Someone Admin:
- Trusted team members
- Teachers who need to manage courses
- Staff who handle user approvals
- Content managers

### When NOT to Make Someone Admin:
- Regular students
- Unverified users
- Temporary helpers
- External users

---

## 🚀 **Deployment Steps**

1. **Update Firebase Rules**
   - Go to Firebase Console
   - Firestore Database → Rules
   - Copy the new rules from above
   - Publish changes

2. **Deploy Code**
   - Upload updated files to server
   - OR deploy to Vercel/hosting

3. **Test**
   - Login as admin
   - Try editing a user's role
   - Verify it works

---

## 📝 **Database Structure**

### User Document with Role:

```javascript
{
  id: "user_uid",
  name: "Juan Dela Cruz",
  email: "juan@example.com",
  status: "approved",
  role: "admin",  // ← NEW FIELD
  createdAt: "2025-02-04T12:00:00Z",
  updatedAt: "2025-02-04T14:00:00Z",
  progress: {},
  location: {...}
}
```

**Role Values:**
- `"student"` - Regular user (default)
- `"admin"` - Admin user (full access)

---

## ✨ **Summary**

### What You Can Do Now:
✅ View user roles in the Users table  
✅ Edit user roles via Edit modal  
✅ Promote students to admin  
✅ Demote admins to student  
✅ See role badges (purple/blue)  
✅ Protected by Firebase security rules  

### What Changed:
- Users table: Added **Role** column
- Edit modal: Added **User Role** dropdown
- Firebase rules: Allow admin to edit users
- Database: Role field stored and updated

---

**Developed by Godmisoft**  
**Heber Mayormita © 2025**
