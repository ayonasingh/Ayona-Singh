# Vercel Deployment Guide - React Portfolio

## 🚀 Quick Setup for Vercel

### Option 1: Deploy react-portfolio as Root (Recommended)

#### Step 1: Prepare Your Repository

**If using the current structure (portfolio/react-portfolio):**

You have two choices:

**A. Move react-portfolio to repository root:**
```bash
# From your workspace root
cd portfolio
mv react-portfolio ../react-portfolio-root
cd ../react-portfolio-root
git init
git add .
git commit -m "Initial commit for Vercel deployment"
```

**B. Keep current structure and configure Vercel:**
- Keep files where they are
- Configure Root Directory in Vercel (see Step 3)

#### Step 2: Push to GitHub/GitLab

```bash
# Create a new repository on GitHub
# Then push your code
git remote add origin https://github.com/YOUR_USERNAME/react-portfolio.git
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import your Git repository**

4. **Configure Build Settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** 
     - If moved to root: leave as `./`
     - If kept in portfolio folder: set to `portfolio/react-portfolio`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend-api-url.com/api
   ```
   (Replace with your actual backend URL)

6. **Click "Deploy"**

#### Step 4: Update Backend URL

After deployment, you need to update your backend URL:

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com/api`

2. **Redeploy** (Vercel will auto-redeploy when you save env variables)

---

## 🔧 Configuration Files Explained

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

This configuration:
- Sets up Vite build process
- Configures SPA routing (all routes go to index.html)
- Handles React Router properly

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
```

This ensures:
- Correct base path for assets
- Proper build output directory
- Clean builds

---

## 🐛 Troubleshooting 404 Errors

### Issue: Getting 404 NOT_FOUND error

**Solution 1: Check Root Directory**
- Go to Vercel Dashboard → Settings → General
- Verify "Root Directory" is set correctly:
  - If react-portfolio is at repo root: `./`
  - If inside portfolio folder: `portfolio/react-portfolio`

**Solution 2: Check Build Logs**
- Go to Deployments tab
- Click on latest deployment
- Check build logs for errors
- Ensure `dist` folder is created

**Solution 3: Verify Routes Configuration**
- Ensure `vercel.json` has the rewrites configuration
- This makes React Router work properly

**Solution 4: Clear Cache and Redeploy**
- Go to Deployments
- Click "..." menu → Redeploy
- Check "Use existing Build Cache" is OFF

---

## 📝 Environment Variables Setup

### Local Development (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production (Vercel Dashboard)
```env
VITE_API_BASE_URL=https://your-production-backend.com/api
```

### How to Use in Code
```javascript
// src/config/api.js
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
```

Then import in your components:
```javascript
import BASE_URL from '../config/api';
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub/GitLab
- [ ] Vercel project created and connected to repo
- [ ] Root directory configured correctly
- [ ] Environment variables added (VITE_API_BASE_URL)
- [ ] Build successful (check deployment logs)
- [ ] Site loads without 404 errors
- [ ] React Router navigation works
- [ ] API calls work (check browser console)
- [ ] Backend CORS configured for your Vercel domain

---

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

## 🆘 Still Having Issues?

1. **Check Vercel Build Logs** - Most issues show up here
2. **Verify dist folder exists** - Should be created during build
3. **Test locally** - Run `npm run build && npm run preview`
4. **Check browser console** - Look for API or routing errors
5. **Verify backend CORS** - Must allow your Vercel domain

---

## 📧 Backend CORS Configuration

Don't forget to update your backend to allow requests from your Vercel domain:

```javascript
// In your backend (e.g., Express)
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```
