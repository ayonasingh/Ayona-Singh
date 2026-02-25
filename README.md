# Ayona Singh - Portfolio Website

A full-stack portfolio website with React frontend and Node.js backend, featuring a blog system, admin dashboard, and real-time chat functionality.

## 🌟 Features

- **Dynamic Portfolio**: Showcase projects, skills, and qualifications
- **Blog System**: Create, edit, and manage blog posts
- **Books Showcase**: Display and manage book recommendations
- **Admin Dashboard**: Secure admin panel for content management
- **Contact Form**: Receive messages from visitors
- **Real-time Updates**: Socket.IO powered live content updates
- **Image Management**: Cloudinary integration for media storage
- **Responsive Design**: Mobile-friendly interface
- **Database**: MongoDB Atlas for data persistence

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)
- MongoDB Atlas account (free)
- Cloudinary account (free)

### Deploy in 3 Steps

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/ayonasingh/Ayona-Singh.git
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set Root Directory: `portfolio`
   - Click Deploy

3. **Configure Environment Variables**
   - See `QUICK_START_VERCEL.md` for detailed instructions
   - Add MongoDB, Cloudinary, and admin credentials

📖 **Full Documentation**: See `VERCEL_DEPLOYMENT_COMPLETE.md`

## 📁 Project Structure

```
portfolio/
├── api/                    # Vercel serverless functions
├── backend/                # Express.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── socket/            # Socket.IO handlers
│   └── server.js          # Main server file
├── react-portfolio/        # React frontend
│   ├── src/               # Source code
│   └── dist/              # Build output
└── Documentation/
    ├── QUICK_START_VERCEL.md
    ├── VERCEL_DEPLOYMENT_COMPLETE.md
    ├── DEPLOYMENT_CHECKLIST.md
    └── ARCHITECTURE.md
```

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- React Icons
- Swiper

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- Multer

### Deployment
- Vercel (Frontend + Backend)
- MongoDB Atlas (Database)
- Cloudinary (Media Storage)

## 💻 Local Development

### Backend Setup

```bash
cd portfolio/backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd portfolio/react-portfolio
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

Frontend runs on `http://localhost:5173`

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📚 Documentation

- **Quick Start**: `QUICK_START_VERCEL.md` - Deploy in 10 minutes
- **Complete Guide**: `VERCEL_DEPLOYMENT_COMPLETE.md` - Detailed deployment instructions
- **Checklist**: `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- **Architecture**: `ARCHITECTURE.md` - System architecture and design

## 🔗 API Endpoints

### Public Endpoints
- `GET /api/home` - Homepage content
- `GET /api/about` - About section
- `GET /api/blogs` - All blogs
- `GET /api/books` - All books
- `POST /api/contacts` - Submit contact form

### Protected Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/upload` - Upload images
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

## 🎨 Features in Detail

### Admin Dashboard
- Secure JWT-based authentication
- Content management for all sections
- Blog and book management
- View contact messages
- Real-time statistics

### Blog System
- Create, edit, and delete blog posts
- Rich text content
- Cover image uploads
- Category and tag support
- Real-time updates

### Contact System
- Contact form with validation
- Message storage in MongoDB
- Admin notification system
- Mark messages as read

### Real-time Features
- Socket.IO integration
- Live content updates
- Chat system
- Real-time notifications

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Secure file uploads
- Input validation

## 📊 Performance

- Vite for fast builds
- Code splitting
- Lazy loading
- Image optimization via Cloudinary
- CDN delivery via Vercel
- MongoDB indexing

## 🐛 Troubleshooting

See `VERCEL_DEPLOYMENT_COMPLETE.md` for common issues and solutions.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Ayona Singh**
- GitHub: [@ayonasingh](https://github.com/ayonasingh)
- LinkedIn: [Ayona Singh](https://www.linkedin.com/in/ayona-singh-10b5561b8/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if you like this project!

---

**Live Demo**: [Your Vercel URL]

**Documentation**: See the `Documentation/` folder for detailed guides.
