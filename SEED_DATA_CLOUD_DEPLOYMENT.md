# Seed Data & Cloud Deployment Guide

> Best practices for deploying seed data to Strapi Cloud

## 📋 Overview

This guide covers how to handle seed data when deploying to Strapi Cloud, including what to commit, what to ignore, and how the bootstrap process works.

---

## 🎯 Current Seed Data Structure

```
pelagic-strapi-cloud/
├── data/
│   ├── data.json              # ✅ COMMIT - Seed data structure
│   └── uploads/               # ✅ COMMIT - Bootstrap media files
│       ├── hero/              # 5 images (~1MB)
│       ├── milan-design-week/ # 1 video (~2.7MB)
│       └── applications/      # 8 images (~912KB)
└── src/
    └── bootstrap.js           # ✅ COMMIT - Bootstrap script
```

**Total Seed Data Size:** ~4.6MB (acceptable for git)

---

## ✅ What to Commit to Git

### 1. **`data/data.json`** ✅ MUST COMMIT
- **Why:** Contains all seed content structure
- **Size:** Small (~7KB)
- **Required for:** Bootstrap script to know what to seed
- **Strapi Cloud:** Will be deployed with your code

### 2. **`data/uploads/`** ✅ COMMIT (Recommended)
- **Why:** Bootstrap script needs these files to upload to Strapi media library
- **Size:** ~4.6MB total (acceptable)
- **Files:**
  - Hero images: 5 files (~1MB)
  - Milan Design Week video: 1 file (~2.7MB)
  - Application images: 8 files (~912KB)
- **Alternative:** Use CDN/external storage (see alternatives below)

### 3. **`src/bootstrap.js`** ✅ MUST COMMIT
- **Why:** Bootstrap script that runs on first startup
- **Required for:** Automatic seeding on Strapi Cloud deployment

### 4. **`scripts/seed.js`** ✅ COMMIT (Optional)
- **Why:** Manual seed script for local development
- **Strapi Cloud:** Not required, but good to keep

---

## ❌ What NOT to Commit

### 1. **`public/uploads/`** ❌ DO NOT COMMIT
- **Why:** User-uploaded media (generated at runtime)
- **Already ignored:** `.gitignore` has `public/uploads/*`
- **Strapi Cloud:** Uses cloud storage for uploads

### 2. **`.env`** ❌ DO NOT COMMIT
- **Why:** Environment variables with secrets
- **Already ignored:** `.gitignore` has `.env`
- **Strapi Cloud:** Configure via dashboard

### 3. **Database files** ❌ DO NOT COMMIT
- **Why:** Generated at runtime
- **Already ignored:** `.gitignore` has `*.sqlite*`

---

## ☁️ Strapi Cloud Deployment Behavior

### Bootstrap Process on Cloud:

1. **First Deployment:**
   ```
   Deploy → Build → Start Strapi → Bootstrap runs → Seed data imported
   ```

2. **Subsequent Deployments:**
   ```
   Deploy → Build → Start Strapi → Bootstrap skips (already seeded)
   ```

3. **Fresh Database (Reset):**
   ```
   Reset DB → Start Strapi → Bootstrap runs → Seed data imported
   ```

### How `isFirstRun()` Works:

- Uses Strapi's plugin store to track if bootstrap has run
- Key: `setup.initHasRun`
- Persists across deployments unless database is reset
- Prevents duplicate seeding

---

## 📦 Recommended Git Configuration

### Update `.gitignore` (if needed):

```gitignore
# Seed data - KEEP IN GIT (needed for bootstrap)
# data/data.json          # ✅ Commit this
# data/uploads/           # ✅ Commit this (or use alternative)

# Runtime uploads - DON'T COMMIT
public/uploads/*          # Already ignored ✅
!public/uploads/.gitkeep

# Environment
.env                     # Already ignored ✅
```

### Current Status:

✅ **Already configured correctly:**
- `data/` directory is **NOT** in `.gitignore`
- `public/uploads/` is **ignored** (correct)
- Bootstrap script will work on Strapi Cloud

---

## 🔄 Alternatives for Large Media Files

If media files grow too large (>50MB), consider:

### Option 1: External CDN (Recommended for Production)
```javascript
// In bootstrap.js, fetch from CDN instead of local files
async function downloadFromCDN(url, localPath) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(localPath, Buffer.from(buffer));
}

// Use in checkFileExistsBeforeUpload:
const cdnUrl = process.env.SEED_MEDIA_CDN_URL || 'https://cdn.example.com/seed-media';
const localPath = await downloadFromCDN(`${cdnUrl}/${filePath}`, tempPath);
```

### Option 2: Git LFS (Large File Storage)
```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "data/uploads/**/*.mp4"
git lfs track "data/uploads/**/*.jpg"

# Commit .gitattributes
git add .gitattributes
```

### Option 3: Cloud Storage Bucket
- Store seed media in S3/CloudFront
- Bootstrap script downloads on first run
- Environment variable: `SEED_MEDIA_BUCKET_URL`

---

## ✅ Current Setup: Keep as-is

**For now, commit `data/uploads/` because:**
1. ✅ Total size is acceptable (~4.6MB)
2. ✅ Simplifies bootstrap (no external dependencies)
3. ✅ Works out-of-the-box on Strapi Cloud
4. ✅ No additional configuration needed

**Revisit if:**
- Media files exceed 50MB total
- Need to reduce repository size
- Want to optimize deployment speed

---

## 🧪 Testing Bootstrap on Strapi Cloud

### Deployment Checklist:

1. ✅ Verify `data/data.json` is committed
2. ✅ Verify `data/uploads/` media files are committed
3. ✅ Verify `src/bootstrap.js` is committed
4. ✅ Verify `.gitignore` doesn't exclude seed data
5. ✅ Deploy to Strapi Cloud
6. ✅ Check logs for bootstrap messages:
   ```
   🌊 Setting up Pelagic Earth CMS...
   📦 Starting seed data import...
   ✓ Uploaded: hero-01.jpg
   ...
   ✅ Pelagic CMS bootstrap complete!
   ```

### Verifying Seed Data:

After deployment, check Strapi Cloud Admin:
- ✅ Home Page content exists
- ✅ Media library has uploaded files
- ✅ Sections appear in correct order
- ✅ API returns data: `GET /api/home-page`

---

## 🚀 Deployment Commands

### Local Test (Before Cloud):
```bash
# Build Strapi
npm run build

# Test bootstrap (will reset and re-run)
npm run seed:homepage
```

### Strapi Cloud Deployment:
```bash
# Push to connected repository
git push origin main

# Strapi Cloud automatically:
# 1. Builds the app
# 2. Runs bootstrap on first startup
# 3. Seeds the data
```

---

## 📝 Notes

- **Bootstrap runs once:** `isFirstRun()` prevents re-seeding
- **Media files:** Committed to git (small size, acceptable)
- **Environment:** Bootstrap works in any environment (dev/staging/prod)
- **Database reset:** Re-running bootstrap requires clearing plugin store key

---

## 🔗 Related Files

- `src/bootstrap.js` - Bootstrap script
- `data/data.json` - Seed data structure
- `scripts/seed.js` - Manual seed script
- `HOMEPAGE_BOOTSTRAP_PLAN.md` - Detailed implementation plan

---

**Last Updated:** 2025-01-10
**Status:** ✅ Ready for Strapi Cloud deployment
