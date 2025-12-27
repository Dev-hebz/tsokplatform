# TSOK Learning Platform - Vercel Deployment Fix

## Error Fixed: ✅

**Error Messages:**
```
Module parse failed: Unexpected token (682:63)
undici/lib/web/fetch/util.js

Module not found: Can't resolve '@/lib/firebase'
```

**Root Causes:** 
1. Version incompatibility between Next.js 14, Firebase 10, and undici package
2. TypeScript path alias misconfiguration

## ✅ What Was Fixed:

### 1. Updated package.json
- ✅ Next.js: `14.0.4` → `14.2.5` (stable version)
- ✅ React: `18.2.0` → `18.3.1`
- ✅ Firebase: `10.7.1` → `10.13.0`
- ✅ Added `overrides` for undici version
- ✅ Updated Tailwind: `3.3.0` → `3.4.0`

### 2. Updated next.config.js
- ✅ Added `transpilePackages` for Firebase
- ✅ Added webpack fallback config
- ✅ Fixed polyfill issues

### 3. Fixed TypeScript Path Resolution
- ✅ Updated `tsconfig.json` with proper baseUrl and paths
- ✅ Created `jsconfig.json` for JavaScript resolution
- ✅ Added src/** to include paths
- ✅ Ensured `@/lib/firebase` resolves to `src/lib/firebase`

### 4. Created .npmrc
- ✅ Added `legacy-peer-deps=true`
- ✅ Prevents peer dependency conflicts

### 5. Created vercel.json
- ✅ Custom install command
- ✅ Ensures correct build process
- ✅ Set Node.js version to 20.x

---

## 🚀 How to Deploy (Fresh Deploy)

### Method 1: Via Vercel Dashboard (Recommended)

1. **Delete Old Deployment** (if exists)
   - Go to Vercel Dashboard
   - Click your project
   - Settings → Delete Project
   - Confirm deletion

2. **Push Updated Code to GitHub**
   ```bash
   cd tsok-learning-platform
   
   # If first time:
   git init
   git add .
   git commit -m "Fixed Vercel build error - updated dependencies"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   
   # If updating existing:
   git add .
   git commit -m "Fixed Vercel build error"
   git push
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **IMPORTANT:** Add Environment Variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     ```
   - Click "Deploy"
   - Wait 2-3 minutes
   - ✅ Success!

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd tsok-learning-platform
vercel --prod

# Follow prompts
```

---

## 🔧 If Build Still Fails:

### Step 1: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Step 2: Verify versions
```bash
node --version  # Should be v18 or v20
npm --version   # Should be v9 or v10
```

### Step 3: Test locally first
```bash
npm run build
npm run start
```
If it works locally, it will work on Vercel!

### Step 4: Check Vercel Settings
Go to Vercel Dashboard → Project Settings:
- **Node.js Version:** 20.x (recommended)
- **Install Command:** `npm install --legacy-peer-deps`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

---

## 🆘 Common Build Errors & Solutions

### Error 1: "undici" related errors
**Solution:** Already fixed in package.json overrides

### Error 2: "Firebase auth" module errors
**Solution:** Already fixed with transpilePackages

### Error 3: "ENOENT: no such file"
**Solution:**
```bash
# Make sure all required folders exist
mkdir -p public src/app src/lib
```

### Error 4: Environment variables not working
**Solution:**
- Make sure all variables start with `NEXT_PUBLIC_`
- Add them in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables

### Error 5: "Module not found: Can't resolve 'fs'"
**Solution:** Already fixed in next.config.js webpack config

---

## ✅ Verification Steps

After successful deployment:

1. **Homepage loads** ✅
   - Visit: `https://your-app.vercel.app`
   - Should see TSOK logo and homepage

2. **Firebase works** ✅
   - Try registering a user at `/register`
   - Try logging in at `/login`

3. **Admin dashboard works** ✅
   - Visit `/admin/login`
   - Login with admin credentials
   - Should see dashboard

4. **Courses display** ✅
   - Visit `/courses`
   - Should see course list (or "no courses" if empty)

5. **Videos play** ✅
   - Open a course
   - Video should load and play

---

## 📊 Build Success Indicators

```
✓ Collecting page data
✓ Generating static pages (7/7)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   5.2 kB          100 kB
├ ○ /admin                              8.5 kB          103 kB
├ ○ /courses                            6.8 kB          102 kB
└ ○ /login                              4.9 kB           99 kB

○  (Static)  prerendered as static content

✨ Build completed successfully!
```

---

## 🎯 Package Versions (Working Configuration)

```json
{
  "next": "14.2.5",
  "react": "18.3.1",
  "react-dom": "18.3.1",
  "firebase": "10.13.0",
  "typescript": "5.x",
  "tailwindcss": "3.4.0"
}
```

---

## 💡 Prevention Tips

1. **Always test build locally before deploying**
   ```bash
   npm run build
   ```

2. **Use exact versions in package.json**
   - Don't use `^` or `~` for critical packages

3. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Monitor Vercel build logs**
   - Check for warnings
   - Fix deprecation notices

---

## 🔗 Useful Links

- **Vercel Status:** https://www.vercel-status.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Firebase Docs:** https://firebase.google.com/docs
- **Vercel Support:** https://vercel.com/support

---

## 📞 Still Having Issues?

### Checklist:
- [ ] Used the updated package.json
- [ ] Created .npmrc file
- [ ] Created vercel.json file
- [ ] Updated next.config.js
- [ ] Added all environment variables
- [ ] Tested build locally
- [ ] Pushed all files to GitHub
- [ ] Deployed to Vercel

### Get Help:
1. Check Vercel build logs (full output)
2. Copy exact error message
3. Send screenshot of error
4. Include your Node.js version

---

**Updated by Godmisoft** 🚀  
**Build Error = FIXED!** ✅

Deploy with confidence! 💪
