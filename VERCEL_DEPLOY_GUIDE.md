# Vercel Deployment Guide

## Project Structure
This is a monorepo containing both frontend (React) and backend (Express) that deploys together on Vercel.

```
portfolio/
├── api/                    # Vercel serverless functions
│   └── index.js           # API entry point
├── backend/               # Express backend
│   ├── server.js         # Main server file
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   └── config/           # Configuration files
├── react-portfolio/       # React frontend
│   ├── src/              # Source files
│   └── dist/             # Build output (generated)
└── vercel.json           # Vercel configuration
```

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- MongoDB Atlas account (optional, falls back to JSON files)
- Cloudinary account (for image uploads)

## Step 1: Prepare Environment Variables

### Backend Environment Variables
Create these in Vercel dashboard under Settings > Environment Variables:

```
# Required
JWT_SECRET=your_secure_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here

# Optional - MongoDB (if not set, uses JSON files)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Optional - Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Auto-set by Vercel
VERCEL=1
NODE_ENV=production
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave default or use `npm run build`
   - **Output Directory**: Leave default
5. Add environment variables (from Step 1)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd portfolio
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? portfolio (or your choice)
# - Directory? ./ (root)
# - Override settings? No

# For production deployment
vercel --prod
```

## Step 3: Configure Environment Variables in Vercel

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add all variables from Step 1
4. Make sure to set them for "Production", "Preview", and "Development"
5. Redeploy if needed

## Step 4: Verify Deployment

After deployment, verify:

1. **Frontend**: Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. **Backend API**: Test `https://your-project.vercel.app/api/home`
3. **Admin Login**: Go to `/admin` and login with your credentials
4. **Image Uploads**: Test uploading images in admin panel

## How It Works

### Build Process
1. Vercel builds the React frontend (`react-portfolio/`)
2. Vite compiles and outputs to `react-portfolio/dist/`
3. Backend runs as serverless function via `api/index.js`

### Routing
- `/api/*` → Backend API (serverless function)
- `/uploads/*` → Backend static files
- `/*` → React frontend (SPA)

### Data Storage
- **With MongoDB**: All data stored in MongoDB Atlas
- **Without MongoDB**: Falls back to JSON files in `/backend/data/`
- **Images**: Stored in Cloudinary (or local `/backend/uploads/` for dev)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### API Not Working
- Check environment variables are set correctly
- Verify `VERCEL=1` is set (auto-set by Vercel)
- Check function logs in Vercel dashboard

### Frontend Can't Connect to Backend
- Ensure `.env.production` has `VITE_API_BASE_URL=/api`
- Check CORS settings in `backend/server.js`
- Verify API routes in `vercel.json`

### Database Connection Issues
- Verify MongoDB connection string
- Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- App will fallback to JSON files if MongoDB fails

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper CORS configuration

## Local Development

```bash
# Install dependencies
cd portfolio
npm install
cd backend && npm install
cd ../react-portfolio && npm install

# Run backend (terminal 1)
cd portfolio
npm run dev:backend

# Run frontend (terminal 2)
cd portfolio
npm run dev:frontend

# Access:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## Updating Deployment

### Via Git Push (Automatic)
```bash
git add .
git commit -m "Your changes"
git push origin main
```
Vercel will automatically redeploy on push to main branch.

### Via Vercel CLI
```bash
vercel --prod
```

## Custom Domain (Optional)

1. Go to project Settings > Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

## Performance Tips

1. **Enable Caching**: Vercel automatically caches static assets
2. **Optimize Images**: Use Cloudinary transformations
3. **MongoDB Indexes**: Add indexes for frequently queried fields
4. **Bundle Size**: Monitor and optimize React bundle size

## Security Checklist

- ✅ Strong JWT_SECRET set
- ✅ Secure ADMIN_PASSWORD
- ✅ MongoDB connection string secured
- ✅ Cloudinary credentials secured
- ✅ CORS properly configured
- ✅ Environment variables not in code
- ✅ .env files in .gitignore

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Cloudinary: https://cloudinary.com/documentation

## Notes

- Vercel serverless functions have 10-second timeout on Hobby plan
- Free tier includes 100GB bandwidth/month
- MongoDB Atlas free tier: 512MB storage
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
