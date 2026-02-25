# 🚨 Quick Fix for Vercel 404 Error

## The Problem
You're getting: `404: NOT_FOUND` after deploying to Vercel

## The Solution (Choose One)

### ⚡ FASTEST FIX - Configure Vercel Dashboard

1. **Go to Vercel Dashboard** → Your Project → Settings → General

2. **Find "Root Directory"** section

3. **Set Root Directory to:** `portfolio/react-portfolio`

4. **Click Save**

5. **Go to Deployments** → Click "..." → **Redeploy**

✅ **Done!** Your site should work now.

---

### 🔄 ALTERNATIVE - Restructure Project

If you want cleaner setup:

```cmd
:: Move react-portfolio to workspace root
cd portfolio
move react-portfolio ..\react-portfolio

:: Now deploy from react-portfolio as root
```

Then deploy with Root Directory set to `./`

---

## 🔍 Verify It's Working

1. **Check Build Logs** in Vercel
   - Should see "Build Completed"
   - Should create `dist` folder

2. **Visit Your Site**
   - Should load without 404
   - Check browser console for errors

3. **Test Navigation**
   - Click different pages
   - Should work with React Router

---

## 🌐 Don't Forget Backend

Add environment variable in Vercel:

**Name:** `VITE_API_BASE_URL`  
**Value:** `https://your-backend-url.com/api`

Then update backend CORS to allow your Vercel domain.

---

## 📚 More Details

See `VERCEL_DEPLOYMENT.md` for complete guide.
