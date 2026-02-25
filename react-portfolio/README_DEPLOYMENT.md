# React Portfolio - Vercel Deployment Setup ✅

## 🎯 Your Issue: 404 NOT_FOUND Error

**Root Cause:** Vercel is looking for your app in the wrong directory.

**Your Structure:**
```
workspace/
└── portfolio/
    └── react-portfolio/  ← Your React app is here
```

**Vercel expects:** App at repository root OR configured root directory.

---

## ✅ Files Already Configured

I've set up everything you need:

1. ✅ **vercel.json** - Routing & build configuration
2. ✅ **vite.config.js** - Build settings with proper base path
3. ✅ **.env.example** - Environment variable template
4. ✅ **src/config/api.js** - Centralized API configuration
5. ✅ **.env** - Local development environment

---

## 🚀 Deploy Now (2 Options)

### Option 1: Quick Fix (Recommended - 2 minutes)

1. **Open Vercel Dashboard** → Your Project

2. **Settings** → **General** → **Root Directory**

3. **Enter:** `portfolio/react-portfolio`

4. **Save** and **Redeploy**

✅ **Done!** Your 404 error is fixed.

---

### Option 2: Restructure (Cleaner Setup)

Move `react-portfolio` to your repository root:

```cmd
cd portfolio
move react-portfolio ..\react-portfolio
cd ..\react-portfolio
```

Then deploy with Root Directory as `./`

---

## 🔧 Environment Variables

After deployment, add this in Vercel Dashboard:

**Settings → Environment Variables:**

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://your-backend-url.com/api` |

Replace with your actual backend URL.

---

## 📋 Deployment Checklist

- [ ] Set Root Directory in Vercel to `portfolio/react-portfolio`
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Redeploy project
- [ ] Verify site loads (no 404)
- [ ] Test navigation between pages
- [ ] Check API calls work
- [ ] Update backend CORS for Vercel domain

---

## 🐛 Still Having Issues?

### Check Build Logs
1. Vercel Dashboard → Deployments
2. Click latest deployment
3. Look for errors in build logs

### Common Issues

**Issue:** Build fails
- **Fix:** Check `package.json` dependencies
- Run `npm install` locally to verify

**Issue:** Site loads but API fails
- **Fix:** Add `VITE_API_BASE_URL` environment variable
- Check backend CORS settings

**Issue:** Routes don't work (404 on refresh)
- **Fix:** Already handled by `vercel.json` rewrites
- Verify `vercel.json` exists in your project

---

## 📚 Documentation Files

- **QUICK_FIX.md** - Fastest solution (start here!)
- **VERCEL_DEPLOYMENT.md** - Complete deployment guide
- **RESTRUCTURE.md** - How to move to root directory
- **README_DEPLOYMENT.md** - This file (overview)

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Site loads without 404 error
✅ All pages accessible via navigation
✅ Direct URL access works (e.g., `/about`)
✅ API calls succeed (check browser console)
✅ No CORS errors in console

---

## 💡 Pro Tips

1. **Test locally first:**
   ```cmd
   npm run build
   npm run preview
   ```

2. **Check what Vercel sees:**
   - Build logs show exact commands run
   - Output shows files in `dist` folder

3. **Backend CORS:**
   ```javascript
   // Add your Vercel domain
   origin: ['https://your-app.vercel.app']
   ```

---

## 🆘 Need Help?

1. Read **QUICK_FIX.md** for immediate solution
2. Check Vercel build logs for specific errors
3. Verify all files are committed to git
4. Test build locally: `npm run build`

---

**Next Step:** Open `QUICK_FIX.md` and follow the fastest solution! 🚀
