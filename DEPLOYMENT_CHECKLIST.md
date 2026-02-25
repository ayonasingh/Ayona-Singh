# 🚀 Vercel Deployment Checklist

## Before Deployment

- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string ready
- [ ] Cloudinary account created
- [ ] Cloudinary credentials ready (Cloud Name, API Key, API Secret)
- [ ] Code pushed to GitHub repository
- [ ] Vercel account created

---

## Deployment Steps

### 1. Deploy to Vercel
- [ ] Go to [vercel.com/new](https://vercel.com/new)
- [ ] Import GitHub repository: `https://github.com/ayonasingh/Ayona-Singh.git`
- [ ] Set Root Directory: `portfolio`
- [ ] Click Deploy

### 2. Configure Environment Variables
Go to Project Settings → Environment Variables and add:

#### Backend Variables (Required)
- [ ] `MONGO_URI` = `mongodb+srv://...`
- [ ] `JWT_SECRET` = `your_secret_key`
- [ ] `ADMIN_USERNAME` = `admin`
- [ ] `ADMIN_PASSWORD` = `your_password`
- [ ] `CLOUDINARY_CLOUD_NAME` = `your_cloud_name`
- [ ] `CLOUDINARY_API_KEY` = `your_api_key`
- [ ] `CLOUDINARY_API_SECRET` = `your_api_secret`
- [ ] `FRONTEND_URL` = `https://your-project.vercel.app`
- [ ] `SOCKET_CORS_ORIGIN` = `https://your-project.vercel.app`

#### Frontend Variables (Required)
- [ ] `VITE_API_BASE_URL` = `https://your-project.vercel.app/api`

### 3. Redeploy
- [ ] Go to Deployments tab
- [ ] Click (...) on latest deployment
- [ ] Click Redeploy
- [ ] Uncheck "Use existing Build Cache"
- [ ] Click Redeploy

### 4. Test Deployment
- [ ] Visit homepage: `https://your-project.vercel.app`
- [ ] Test API: `https://your-project.vercel.app/api/home`
- [ ] Test admin login: `https://your-project.vercel.app/admin`
- [ ] Test contact form
- [ ] Test image upload
- [ ] Test blog creation

---

## MongoDB Atlas Setup

- [ ] Create free cluster
- [ ] Create database user
- [ ] Set Network Access to `0.0.0.0/0` (allow all)
- [ ] Get connection string
- [ ] Replace `<password>` in connection string

---

## Cloudinary Setup

- [ ] Sign up for free account
- [ ] Copy Cloud Name from dashboard
- [ ] Copy API Key from dashboard
- [ ] Copy API Secret from dashboard

---

## Post-Deployment

- [ ] Update `FRONTEND_URL` with actual Vercel URL
- [ ] Update `SOCKET_CORS_ORIGIN` with actual Vercel URL
- [ ] Update `VITE_API_BASE_URL` with actual Vercel URL
- [ ] Test all features again
- [ ] Set up custom domain (optional)

---

## Quick Commands

```bash
# Push to GitHub
git add .
git commit -m "Deploy to Vercel"
git push origin main

# Install Vercel CLI (optional)
npm install -g vercel

# Deploy via CLI
cd portfolio
vercel
```

---

## Important URLs

- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Cloudinary**: https://cloudinary.com/console
- **GitHub Repo**: https://github.com/ayonasingh/Ayona-Singh

---

## Need Help?

See `VERCEL_DEPLOYMENT_COMPLETE.md` for detailed instructions.
