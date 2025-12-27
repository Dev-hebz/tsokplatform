# TSOK Learning Platform - Giya para sa Admin User

**Para sa mga Administrator sa TSOK**

## 🎯 Unsaon Pag-Gamit ang Admin Dashboard

### 1. Pag-Login sa Admin Panel

```
https://your-site.com/admin/login
```

**Ang Imong Credentials:**
- Email: admin@tsok.org (or imong email)
- Password: (ang password na imong gi-set sa Firebase)

### 2. Unsaon Pag-Add ug Course (SUPER SAYON!)

#### Step 1: Upload ang Video sa YouTube
1. Adto sa [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Upload imong video
4. **IMPORTANTE**: Set ang privacy to **Unlisted** (dili Private!)
5. Copy ang video ID:
   - Tan-awa ang URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - Ang video ID: `dQw4w9WgXcQ` (ang part human sa `?v=`)

#### Step 2: Login sa Admin Dashboard
1. Adto sa `/admin/login`
2. Enter imong email ug password
3. Click "Access Admin Dashboard"

#### Step 3: Create New Course
1. Sa dashboard, click **"Add New Course"**
2. Fill-in ang mga fields:

**Course Information:**
- **Course Title**: Example: "Introduction to Teaching Methods"
- **Description**: Unsay ma-learn sa students
- **Category**: Example: "Pedagogy" or "Technology"
- **Thumbnail URL**: (Optional - automatic man ni if walay gibutang)

#### Step 4: Add Modules
1. Click **"Add Module"** button
2. Type ang module title: Example: "Module 1: Foundations of Teaching"

#### Step 5: Add Videos sa Module
1. Click **"Add Video"** button inside the module
2. Fill-in ang video details:
   - **Video Title**: Example: "Introduction to Pedagogy"
   - **YouTube Video ID**: Paste ang video ID na imong gi-copy (Example: `dQw4w9WgXcQ`)
   - **Duration**: Example: "15:30" (minutes:seconds)
   - **Description**: Brief summary sa video

3. Pwede ka mag-add ug daghang videos sa usa ka module!

#### Step 6: Add More Modules (if needed)
- Click "Add Module" again para sa Module 2, 3, etc.
- Repeat ang Step 5 para sa each module

#### Step 7: SAVE!
1. Scroll down
2. Click **"Create Course"** button
3. **TAPOS NA!** Instant makita sa students! ⚡

## 🔄 Unsaon Pag-Edit ug Course

1. Sa admin dashboard, tan-awa ang course list
2. Click ang **pencil icon (Edit)** sa course na gusto nimo i-edit
3. I-change ang details na gusto nimo
4. Click **"Update Course"**
5. **Instant update!** Makita dayon sa users!

## 🗑️ Unsaon Pag-Delete ug Course

1. Sa admin dashboard, tan-awa ang course list
2. Click ang **trash icon (Delete)** sa course
3. Confirm ang deletion
4. **Deleted na!**

⚠️ **Warning**: Dili na ma-recover ang course if na-delete na!

## 👥 Unsaon Pag-View sa Students

1. Sa admin dashboard, click **"Users"** sa sidebar
2. Makita nimo:
   - Tanan registered users
   - Email addresses
   - Registration dates
   - Progress per student

## 💡 Mga Tips ug Tricks

### Tip 1: YouTube Video Settings
```
✅ SAKTO: Unlisted privacy
❌ SAYOP: Private privacy (dili ma-embed)
```

### Tip 2: Pag-Organize ug Modules
```
Module 1: Basics
  - Video 1.1: Introduction
  - Video 1.2: Getting Started
  - Video 1.3: Practice

Module 2: Intermediate
  - Video 2.1: Advanced Topics
  - Video 2.2: Case Studies
```

### Tip 3: Video Titles
```
✅ SAKTO: Clear and descriptive
   "Lesson 1.1: Introduction to Classroom Management"

❌ SAYOP: Generic
   "Video 1"
```

### Tip 4: Duration Format
```
✅ SAKTO: "15:30" (15 minutes, 30 seconds)
✅ SAKTO: "1:05:20" (1 hour, 5 minutes, 20 seconds)
❌ SAYOP: "15 minutes" (need proper format)
```

## 🎬 Sample Course Structure

```
Course: "Introduction to Teaching Methods"
├── Module 1: Foundations
│   ├── Video 1.1: What is Modern Pedagogy? (12:30)
│   ├── Video 1.2: Learning Styles (15:45)
│   └── Video 1.3: Lesson Planning Basics (18:20)
│
├── Module 2: Classroom Management
│   ├── Video 2.1: Creating Positive Environment (14:10)
│   ├── Video 2.2: Behavior Management (16:55)
│   └── Video 2.3: Time Management (13:30)
│
└── Module 3: Assessment
    ├── Video 3.1: Types of Assessment (17:25)
    └── Video 3.2: Creating Effective Tests (19:40)
```

## ⚡ Quick Reference

### Admin Dashboard URLs
```
Main Dashboard:    /admin
Login Page:        /admin/login
Add Course:        /admin/courses/add
Edit Course:       /admin/courses/edit/[course-id]
View Users:        /admin/users
```

### Keyboard Shortcuts (para paspas)
```
Ctrl + S = Save (sa edit forms)
Esc = Cancel/Close modals
```

## 🆘 Common Problems ug Solutions

### Problem 1: "Video not loading"
**Solution:**
- Check if video ID is correct
- Verify video is set to "Unlisted" (not Private)
- Try opening the YouTube URL directly

### Problem 2: "Can't save course"
**Solution:**
- Make sure all required fields (*) are filled
- Check internet connection
- Refresh page and try again

### Problem 3: "Changes not appearing"
**Solution:**
- Wait 2-3 seconds (real-time sync)
- Refresh the page
- Clear browser cache (Ctrl + F5)

### Problem 4: "Can't login to admin"
**Solution:**
- Double-check email and password
- Try "Forgot Password" link
- Contact technical support

## 📊 Understanding Statistics

### Dashboard Stats:
- **Total Courses**: Pila ka courses ang naa
- **Total Videos**: Total number of videos across all courses
- **Total Students**: Pila ka users ang registered

### Per Course Stats:
- **Modules**: Number of modules in the course
- **Videos**: Total videos in all modules

## 🎨 Customization Tips

### Para Professional ang Tingnan:
1. Use high-quality video thumbnails
2. Write clear, concise descriptions
3. Organize courses logically
4. Use consistent naming conventions

### Sample Categories:
- Pedagogy
- Technology
- Assessment
- Classroom Management
- Professional Development
- Subject-Specific (Math, English, Science, etc.)

## 📱 Mobile Admin Access

**Yes! Pwede ka mag-admin gamit ang phone!**

1. Open browser sa phone
2. Login sa `/admin/login`
3. Responsive ang interface - perfect sa mobile!

## 🔐 Security Best Practices

1. **Never share admin credentials**
2. **Use strong password** (at least 10 characters)
3. **Logout after using** (especially sa public computers)
4. **Regular password changes** (every 3 months)

## 🎓 Training New Admins

### Checklist for New Admin:
- [ ] Gi-send na ang login credentials
- [ ] Gi-demonstrate ang pag-add ug course
- [ ] Gi-demonstrate ang pag-edit
- [ ] Gi-demonstrate ang YouTube upload
- [ ] Gi-demonstrate ang video ID copy
- [ ] Practice session (add sample course)
- [ ] Answer questions

## 📞 Need Help?

### Technical Support:
- Email: support@godmisoft.com
- Check browser console for errors (F12)
- Send screenshot if naa'y error

### Questions about Platform:
- Review this guide
- Check README_ADMIN.md
- Ask fellow admins

## 🎉 Success Tips

1. **Upload quality videos** - Clear audio, good lighting
2. **Organize well** - Logical module structure
3. **Test before publishing** - View the course as student
4. **Get feedback** - Ask students about usability
5. **Update regularly** - Keep content fresh

## 📝 Sample Workflow

**Weekly Admin Tasks:**
```
Monday: 
- Upload new videos to YouTube
- Prepare video descriptions

Tuesday-Thursday:
- Add videos to courses
- Update course descriptions
- Test new content

Friday:
- Review student progress
- Check user registrations
- Plan next week's content
```

---

**Remember**: Ang admin dashboard kay LIVE! Any changes na imong buhaton, instant makita sa users. So double-check before saving! ✅

**Developed by Godmisoft** 🚀

Para sa dugang questions, contact lang! Dali ra kaayo ni sya gamiton promise! 💪
