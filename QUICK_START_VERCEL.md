# 🚀 Quick Start: Deploy to Vercel in 10 Minutes

## What You'll Deploy
- ✅ React Frontend (Vite)
- ✅ Node.js Backend API (Serverless)
- ✅ MongoDB Database
- ✅ Cloudinary Image Storage

---

## Step 1: Get Your Credentials (5 minutes)

### MongoDB Atlas
1. Go to https://mongodb.com/atlas
2. Sign up → Create FREE cluster
3. Create database user (username + password)
4. Network Access → Add IP: `0.0.0.0/0`
5. Connect → Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio
   ```

### Cloudinary
1. Go to https://cloudinary.com
2. Sign up for FREE account
3. Dashboard → Copy these 3 values:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 2: Deploy to Vercel (3 minutes)

1. Go to https://vercel.com/new
2. Import: `https://github.com/ayonasingh/Ayona-Singh.git`
3. Configure:
   - Root Directory: `portfolio`
   - Framework: Other
4. Click **Deploy** (will fail - that's expected!)

---

## Step 3: Add Environment Variables (2 minutes)

In Vercel Dashboard → Your Project → Settings → Environment Variables

Add these (copy-paste ready):

```
MONGO_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/portfolio
JWT_SECRET=my_super_secret_jwt_key_2026_change_this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://your-project.vercel.app
SOCKET_CORS_ORIGIN=https://your-project.vercel.app
VITE_API_BASE_URL=https://your-project.vercel.app/api
```

**Replace**:
- `your-user:your-pass@cluster` with your MongoDB credentials
- `your_cloud_name`, `your_api_key`, `your_api_secret` with Cloudinary values
- `your-project` with your actual Vercel project name

---

## Step 4: Redeploy

1. Deployments tab
2. Click (...) on latest deployment
3. **Redeploy** (uncheck cache)

---

## Step 5: Test Your Site

Visit: `https://your-project.vercel.app`

Test these:
- ✅ Homepage loads
- ✅ API works: `/api/home`
- ✅ Admin login: `/admin`

---

## 🎉 Done!

Your portfolio is live with full backend functionality!

---

## 🐛 Issues?

### "Module not found"
→ Redeploy without cache

### "API calls failing"
→ Check `VITE_API_BASE_URL` matches your Vercel URL

### "Database connection error"
→ Verify MongoDB connection string and IP whitelist

### "Image upload fails"
→ Double-check all 3 Cloudinary variables

---

## 📚 Need More Help?

See `VERCEL_DEPLOYMENT_COMPLETE.md` for detailed guide.

---

**Your Project**: https://your-project.vercel.app
**Admin Panel**: https://your-project.vercel.app/admin
