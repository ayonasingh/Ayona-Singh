# 🏗️ Portfolio Architecture

## Deployment Architecture on Vercel

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │           React Frontend (Static Site)              │    │
│  │                                                      │    │
│  │  • Built with Vite                                  │    │
│  │  • Served from /react-portfolio/dist                │    │
│  │  • Routes: /, /about, /blog, /admin, etc.          │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          │ API Calls                         │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Backend API (Serverless Functions)            │    │
│  │                                                      │    │
│  │  • Entry: /api/index.js                            │    │
│  │  • Express.js server                                │    │
│  │  • Routes: /api/*, /uploads/*                       │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │  Cloudinary  │  │   Socket.IO  │
│    Atlas     │  │   (Images)   │  │  (Real-time) │
│              │  │              │  │              │
│  • Database  │  │  • Uploads   │  │  • Chat      │
│  • Content   │  │  • Storage   │  │  • Updates   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## File Structure

```
portfolio/
├── api/
│   └── index.js                    # Vercel serverless entry point
│
├── backend/
│   ├── server.js                   # Express app (exported for Vercel)
│   ├── package.json                # Backend dependencies
│   ├── .env.example                # Environment variables template
│   ├── config/
│   │   └── cloudinary.js           # Cloudinary configuration
│   ├── models/                     # MongoDB models
│   │   ├── Blog.js
│   │   ├── Book.js
│   │   ├── Contact.js
│   │   └── SiteContent.js
│   ├── routes/                     # API routes
│   │   ├── userRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── adminRoutes.js
│   ├── socket/                     # Socket.IO handlers
│   │   └── chatSocket.js
│   ├── middleware/                 # Auth middleware
│   └── data/                       # JSON fallback storage
│
├── react-portfolio/
│   ├── src/                        # React source code
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── dist/                       # Build output (generated)
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── .env.example                # Frontend env template
│
├── vercel.json                     # Vercel deployment config
├── .vercelignore                   # Files to exclude
├── package.json                    # Root build scripts
│
└── Documentation/
    ├── VERCEL_DEPLOYMENT_COMPLETE.md
    ├── DEPLOYMENT_CHECKLIST.md
    ├── QUICK_START_VERCEL.md
    └── ARCHITECTURE.md (this file)
```

---

## Request Flow

### Frontend Request
```
User Browser
    │
    ▼
https://your-project.vercel.app/
    │
    ▼
Vercel CDN
    │
    ▼
Static Files (react-portfolio/dist/)
    │
    ▼
React App Loads
```

### API Request
```
React App
    │
    ▼
fetch('https://your-project.vercel.app/api/blogs')
    │
    ▼
Vercel Routes to /api/index.js
    │
    ▼
Express Server (backend/server.js)
    │
    ├─▶ MongoDB Atlas (data)
    ├─▶ Cloudinary (images)
    └─▶ Socket.IO (real-time)
    │
    ▼
JSON Response
    │
    ▼
React App Updates UI
```

---

## Environment Variables Flow

### Development (.env files)
```
backend/.env          → Backend server
react-portfolio/.env  → Vite build
```

### Production (Vercel Dashboard)
```
Vercel Environment Variables
    │
    ├─▶ Backend variables → Serverless functions
    └─▶ VITE_* variables → Build time (embedded in static files)
```

---

## Data Storage

### MongoDB Atlas (Primary)
- Site content (home, about, skills, etc.)
- Blogs
- Books
- Contact messages
- Chat users and conversations

### Cloudinary (Media)
- Profile images
- Blog cover images
- Book cover images
- Portfolio project images

### JSON Files (Fallback)
- Used when MONGO_URI not set
- Stored in backend/data/
- Not recommended for production

---

## API Endpoints

### Public Endpoints
```
GET  /api/home              # Homepage content
GET  /api/about             # About section
GET  /api/skills            # Skills data
GET  /api/qualification     # Education & experience
GET  /api/contact-info      # Contact information
GET  /api/blogs             # All blogs
GET  /api/blogs/:id         # Single blog
GET  /api/books             # All books
GET  /api/books/featured    # Featured books
POST /api/contacts          # Submit contact form
```

### Protected Endpoints (Require JWT)
```
POST   /api/auth/login      # Admin login
GET    /api/auth/verify     # Verify token
POST   /api/upload          # Upload image
PUT    /api/home            # Update homepage
PUT    /api/about           # Update about
POST   /api/blogs           # Create blog
PUT    /api/blogs/:id       # Update blog
DELETE /api/blogs/:id       # Delete blog
GET    /api/contacts        # View messages
GET    /api/stats           # Dashboard stats
```

---

## Security

### Authentication
- JWT tokens for admin access
- Tokens stored in localStorage
- 24-hour expiration

### CORS
- Configured via FRONTEND_URL
- Credentials enabled
- Socket.IO CORS via SOCKET_CORS_ORIGIN

### Environment Variables
- Sensitive data in Vercel dashboard
- Never committed to Git
- Separate for each environment

---

## Scaling Considerations

### Current Setup (Serverless)
- ✅ Auto-scales with traffic
- ✅ Pay per request
- ✅ Global CDN
- ⚠️ Cold starts possible
- ⚠️ Socket.IO limitations

### For Heavy Traffic
Consider:
- Vercel Edge Functions
- Separate backend (Railway, Render)
- Redis for caching
- CDN for static assets

---

## Monitoring

### Vercel Dashboard
- Deployment logs
- Function logs
- Analytics
- Performance metrics

### MongoDB Atlas
- Database metrics
- Query performance
- Connection monitoring

### Cloudinary
- Upload statistics
- Storage usage
- Bandwidth tracking

---

## Backup Strategy

### Database
- MongoDB Atlas automatic backups
- Export data via mongodump

### Images
- Cloudinary automatic storage
- Download via API if needed

### Code
- GitHub repository
- Vercel deployment history

---

## Cost Breakdown (Free Tier)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| Vercel | ✅ Free | 100GB bandwidth/month |
| MongoDB Atlas | ✅ Free | 512MB storage |
| Cloudinary | ✅ Free | 25GB storage, 25GB bandwidth |
| GitHub | ✅ Free | Unlimited public repos |

**Total Cost**: $0/month for small-medium traffic

---

## Performance Optimization

### Frontend
- Vite build optimization
- Code splitting
- Lazy loading
- Image optimization

### Backend
- MongoDB indexes
- Cloudinary transformations
- Response caching
- Compression middleware

### Vercel
- Edge caching
- Automatic compression
- Global CDN
- HTTP/2 support

---

*Last updated: 2026*
