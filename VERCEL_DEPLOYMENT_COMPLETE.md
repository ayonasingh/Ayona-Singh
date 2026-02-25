# Complete Vercel Deployment Guide
## Frontend + Backend Deployment

This guide will help you deploy both your React frontend and Node.js backend to Vercel.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **MongoDB Atlas**: Free database at [mongodb.com/atlas](https://mongodb.com/atlas)
4. **Cloudinary Account**: For image uploads at [cloudinary.com](https://cloudinary.com)

---

## 🚀 Step 1: Prepare Your Repository

Your repository is now configured with:
- ✅ `portfolio/api/index.js` - Serverless function entry point
- ✅ `portfolio/vercel.json` - Deployment configuration
- ✅ `portfolio/.vercelignore` - Files to exclude
- ✅ `portfolio/package.json` - Build scripts

---

## 🔧 Step 2: Set Up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Save this for later

---

## 🖼️ Step 3: Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Save these for later

---

## 📦 Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `https://github.com/ayonasingh/Ayona-Singh.git`
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `portfolio`
   - **Build Command**: `npm run build`
   - **Output Directory**: `react-portfolio/dist`

4. Click "Deploy" (it will fail first time - that's okay!)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to portfolio directory
cd portfolio

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: ayona-portfolio
# - Directory: ./
# - Override settings? No
```

---

## 🔐 Step 5: Configure Environment Variables

After deployment, go to your Vercel project dashboard:

1. Click on your project
2. Go to **Settings** → **Environment Variables**
3. Add the following variables:

### Backend Variables

| Variable Name | Value | Example |
|--------------|-------|---------|
| `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `JWT_SECRET` | Random secure string | `your_super_secret_jwt_key_2026` |
| `ADMIN_USERNAME` | Your admin username | `admin` |
| `ADMIN_PASSWORD` | Your admin password | `SecurePassword123!` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary dashboard | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | From Cloudinary dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | From Cloudinary dashboard | `abcdefghijklmnopqrstuvwxyz` |
| `FRONTEND_URL` | Your Vercel frontend URL | `https://your-project.vercel.app` |
| `SOCKET_CORS_ORIGIN` | Same as FRONTEND_URL | `https://your-project.vercel.app` |
| `PORT` | Leave empty (Vercel handles this) | - |

### Frontend Variables

| Variable Name | Value | Example |
|--------------|-------|---------|
| `VITE_API_BASE_URL` | Your Vercel deployment URL + /api | `https://your-project.vercel.app/api` |

**Important**: Make sure to add these to **all environments** (Production, Preview, Development)

---

## 🔄 Step 6: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Check "Use existing Build Cache" is OFF
5. Click **Redeploy**

---

## ✅ Step 7: Verify Deployment

Once deployed, test these endpoints:

### Frontend
- Visit: `https://your-project.vercel.app`
- Should see your portfolio homepage

### Backend API
- Visit: `https://your-project.vercel.app/api/home`
- Should return JSON data

### Admin Login
- Visit: `https://your-project.vercel.app/admin`
- Login with your ADMIN_USERNAME and ADMIN_PASSWORD

---

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution**: Make sure all dependencies are in `backend/package.json`:
```bash
cd backend
npm install
```

### Issue: API calls failing

**Solution**: Check that `VITE_API_BASE_URL` is set correctly:
- Should be: `https://your-project.vercel.app/api`
- NOT: `http://localhost:5000/api`

### Issue: Database connection errors

**Solution**: 
1. Verify MongoDB connection string is correct
2. Check MongoDB Atlas network access (allow all IPs: `0.0.0.0/0`)
3. Verify database user has read/write permissions

### Issue: Image uploads not working

**Solution**:
1. Verify all Cloudinary environment variables are set
2. Check Cloudinary dashboard for upload errors
3. Ensure CLOUDINARY_API_SECRET has no extra spaces

### Issue: Socket.IO not working

**Note**: Socket.IO real-time features may have limitations on Vercel serverless functions. For full Socket.IO support, consider:
- Using Vercel's Edge Functions
- Deploying backend separately to Railway, Render, or Heroku
- Using Vercel's real-time features (Vercel KV, Pusher, etc.)

---

## 📱 Step 8: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` and `SOCKET_CORS_ORIGIN` environment variables

---

## 🔄 Continuous Deployment

Every time you push to GitHub:
1. Vercel automatically detects changes
2. Builds and deploys your project
3. Creates a preview URL for each branch

---

## 📊 Monitoring

- **Logs**: Go to your project → **Deployments** → Click deployment → **Function Logs**
- **Analytics**: Available in **Analytics** tab
- **Performance**: Check **Speed Insights** tab

---

## 🎯 Next Steps

1. ✅ Push all changes to GitHub
2. ✅ Deploy to Vercel
3. ✅ Configure environment variables
4. ✅ Test all features
5. ✅ Set up custom domain (optional)
6. ✅ Monitor logs and analytics

---

## 📞 Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Cloudinary Docs: [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

## 🎉 Success!

Your portfolio is now live with:
- ✅ React frontend
- ✅ Node.js backend API
- ✅ MongoDB database
- ✅ Image uploads via Cloudinary
- ✅ Admin dashboard
- ✅ Contact form
- ✅ Blog system
- ✅ Books showcase

**Your live URL**: `https://your-project.vercel.app`

---

*Last updated: 2026*
