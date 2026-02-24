# Portfolio Admin Backend

A RESTful API backend for managing portfolio website content, built with Express.js.

## Features

- 🔐 JWT-based authentication
- 📝 Blog post management (CRUD)
- 💼 Portfolio project management (CRUD)
- 📧 Contact message management
- 🏠 Site content management (Home, About, Skills)
- 🖼️ Image upload with validation
- 📊 Dashboard statistics
- 💾 JSON file-based storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` file with your configuration:
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Server

### Development
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT token signing | `ayona_admin_secret_2026` |
| `ADMIN_USERNAME` | Admin username for login | `admin` |
| `ADMIN_PASSWORD` | Admin password for login | `admin123` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment (development/production) | `development` |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify JWT token

### Site Content
- `GET /api/home` - Get home section
- `PUT /api/home` - Update home section (auth required)
- `GET /api/about` - Get about section
- `PUT /api/about` - Update about section (auth required)
- `GET /api/skills` - Get skills section
- `PUT /api/skills` - Update skills section (auth required)

### Blogs
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)

### Portfolio
- `GET /api/portfolio` - List all projects
- `GET /api/portfolio/:id` - Get single project
- `POST /api/portfolio` - Create project (auth required)
- `PUT /api/portfolio/:id` - Update project (auth required)
- `DELETE /api/portfolio/:id` - Delete project (auth required)

### Contacts
- `GET /api/contacts` - List all messages (auth required)
- `POST /api/contacts` - Submit contact message (public)
- `PUT /api/contacts/:id/read` - Mark message as read (auth required)
- `DELETE /api/contacts/:id` - Delete message (auth required)

### Other
- `POST /api/upload` - Upload image (auth required)
- `GET /api/stats` - Get dashboard statistics (auth required)
- `GET /uploads/:filename` - Serve uploaded images

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To get a token, login with:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `siteContent.json` - Home, About, Skills sections
- `blogs.json` - Blog posts
- `portfolio.json` - Portfolio projects
- `contacts.json` - Contact messages

Uploaded images are stored in the `uploads/` directory.

## File Upload

Supported image formats: JPEG, JPG, PNG, GIF, WEBP, SVG
Maximum file size: 5MB

## Security Notes

⚠️ **Important for Production:**
1. Change the default admin credentials
2. Use a strong, random JWT_SECRET
3. Enable HTTPS
4. Implement rate limiting
5. Use environment variables (never commit .env to git)
6. Consider using bcrypt for password hashing
7. Update FRONTEND_URL to your production domain

## Project Structure

```
backend/
├── server.js           # Main server file
├── package.json        # Dependencies
├── .env               # Environment variables (not in git)
├── .env.example       # Environment template
├── .gitignore         # Git ignore rules
├── data/              # JSON data storage
│   ├── siteContent.json
│   ├── blogs.json
│   ├── portfolio.json
│   └── contacts.json
└── uploads/           # Uploaded images
```

## License

ISC


## Chat System

The backend now includes a real-time chat system that allows users to register, login, and chat with the admin.

### Chat Features

- 🔐 User registration and authentication
- 💬 Real-time messaging via Socket.IO
- 👥 User-to-admin conversations
- 📊 Admin dashboard to manage all conversations
- ✅ Read/unread message status
- 🟢 Online/offline status indicators
- ⌨️ Typing indicators
- 🔍 Search and filter conversations

### Chat API Endpoints

#### User Authentication
- `POST /api/users/register` - Register new user
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/users/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/users/profile` - Get user profile (auth required)
- `PUT /api/users/profile` - Update user profile (auth required)

#### Messaging
- `POST /api/messages/send` - Send message (auth required)
  ```json
  {
    "receiverId": "admin-user-id",
    "content": "Hello, I have a question"
  }
  ```

- `GET /api/messages` - Get user's messages (auth required)
- `GET /api/messages/:userId` - Get conversation with specific user (auth required)
- `PUT /api/messages/:messageId/read` - Mark message as read (auth required)

#### Admin Conversation Management
- `GET /api/conversations` - List all conversations (admin only)
- `GET /api/conversations/:userId` - Get specific conversation (admin only)
- `DELETE /api/conversations/:userId` - Delete conversation (admin only)
- `GET /api/conversations/search/query?q=search&unread=true` - Search conversations (admin only)

#### Admin Operations
- `GET /api/admin/stats` - Get chat statistics (admin only)
- `GET /api/admin/users` - List all users (admin only)
- `DELETE /api/admin/users/:userId` - Delete user (admin only)
- `POST /api/admin/messages/send` - Admin send message (admin only)

### Socket.IO Events

#### Client → Server Events

- `authenticate` - Authenticate socket connection
  ```javascript
  socket.emit('authenticate', jwtToken);
  ```

- `send_message` - Send a message
  ```javascript
  socket.emit('send_message', {
    receiverId: 'user-id',
    content: 'Hello!'
  });
  ```

- `typing_start` - User started typing
  ```javascript
  socket.emit('typing_start', { receiverId: 'user-id' });
  ```

- `typing_stop` - User stopped typing
  ```javascript
  socket.emit('typing_stop', { receiverId: 'user-id' });
  ```

- `mark_read` - Mark message as read
  ```javascript
  socket.emit('mark_read', { messageId: 'message-id' });
  ```

#### Server → Client Events

- `authenticated` - Authentication successful
- `new_message` - New message received
- `message_sent` - Message sent confirmation
- `message_read` - Message marked as read
- `user_online` - User came online
- `user_offline` - User went offline
- `typing` - Other party is typing
- `stop_typing` - Other party stopped typing
- `error` - Error occurred

### Frontend Integration Example

```javascript
import io from 'socket.io-client';

// Connect to Socket.IO
const socket = io('http://localhost:5000');

// Authenticate
socket.emit('authenticate', yourJWTToken);

// Listen for authentication
socket.on('authenticated', (data) => {
  console.log('Authenticated:', data.userId);
});

// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // Update UI with new message
});

// Send a message
socket.emit('send_message', {
  receiverId: 'admin-id',
  content: 'Hello!'
});

// Typing indicators
socket.emit('typing_start', { receiverId: 'admin-id' });
// ... user stops typing
socket.emit('typing_stop', { receiverId: 'admin-id' });

// Listen for typing
socket.on('typing', (data) => {
  console.log(`User ${data.userId} is typing...`);
});

// Listen for online status
socket.on('user_online', (data) => {
  console.log(`User ${data.userId} is online`);
});

socket.on('user_offline', (data) => {
  console.log(`User ${data.userId} is offline`);
});
```

### Creating Admin User

To create an admin user for the chat system, you can either:

1. **Manually add to users.json**:
```json
[
  {
    "id": "admin-uuid",
    "username": "admin",
    "email": "admin@example.com",
    "password": "$2b$10$hashedpassword",
    "role": "admin",
    "createdAt": "2026-02-22T00:00:00.000Z",
    "lastLogin": "2026-02-22T00:00:00.000Z"
  }
]
```

2. **Use bcrypt to hash password**:
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash); // Use this in users.json
```

### Data Storage

Chat data is stored in JSON files:
- `data/users.json` - User accounts
- `data/messages.json` - Chat messages

### Security Notes for Chat System

⚠️ **Important:**
- Passwords are hashed with bcrypt (10 rounds)
- JWT tokens expire after 24 hours
- Users can only access their own messages
- Admin role required for admin endpoints
- Socket connections must be authenticated
- Message length limited to 1000 characters (configurable)

### Testing the Chat System

1. **Register a user**:
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

2. **Login**:
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Send a message** (use token from login):
```bash
curl -X POST http://localhost:5000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"receiverId":"admin-id","content":"Hello admin!"}'
```

### Troubleshooting

**Socket.IO connection issues:**
- Ensure SOCKET_CORS_ORIGIN matches your frontend URL
- Check that JWT token is valid
- Verify socket authentication is called after connection

**Messages not delivering:**
- Check that both users exist in users.json
- Verify receiver is online for real-time delivery
- Check server logs for errors

**Admin can't see conversations:**
- Ensure admin user has role: "admin" in users.json
- Verify JWT token includes admin role
- Check that messages exist between users and admin


## Real-Time Content Management

### Overview

All content changes are now broadcast in real-time via Socket.IO! When an admin updates any content (home, about, skills, blogs, portfolio), all connected clients receive instant updates without page refresh.

### Real-Time Features

- ✅ **Instant Updates**: Changes appear immediately on all connected clients
- ✅ **Live Preview**: Admin can see changes in real-time before publishing
- ✅ **Multi-Client Sync**: All users see the same content simultaneously
- ✅ **Update Notifications**: Visual feedback when content changes
- ✅ **Content Monitoring**: Real-time update log for admins

### Socket.IO Event

**`content_updated`** - Emitted when any content changes

```javascript
socket.on('content_updated', (update) => {
  console.log('Content updated:', update);
  // update.section: 'home' | 'about' | 'skills' | 'blogs' | 'portfolio'
  // update.action: 'create' | 'update' | 'delete'
  // update.data: { /* updated content */ }
});
```

### Get All Content Endpoint

```http
GET /api/content/all
Authorization: Bearer <token>
```

Returns all content in one response:
```json
{
  "home": { "name": "...", "subtitle": "...", "description": "..." },
  "about": { "description": "...", "stats": [...] },
  "skills": { "mathCore": [...], "tools": [...] },
  "blogs": [...],
  "portfolio": [...],
  "contacts": [...]
}
```

### Frontend Integration Example

```javascript
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

function App() {
  const [content, setContent] = useState({});

  useEffect(() => {
    // Load initial content
    fetch('http://localhost:5000/api/home')
      .then(res => res.json())
      .then(data => setContent(data));

    // Connect for real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('content_updated', (update) => {
      if (update.section === 'home') {
        setContent(update.data);
      }
    });

    return () => socket.close();
  }, []);

  return <div>{content.name}</div>;
}
```

### Testing Real-Time Updates

1. **Open test page**: `test-realtime-content.html`
2. **Login as admin**: admin@portfolio.com / admin123
3. **Edit content**: Make changes in the admin panel
4. **Watch updates**: See changes appear instantly in live preview
5. **Multi-client test**: Open in multiple browsers to see sync

### What Gets Broadcast

| Action | Endpoint | Socket Event | Data |
|--------|----------|--------------|------|
| Update Home | `PUT /api/home` | `content_updated` | `{ section: 'home', data: {...} }` |
| Update About | `PUT /api/about` | `content_updated` | `{ section: 'about', data: {...} }` |
| Update Skills | `PUT /api/skills` | `content_updated` | `{ section: 'skills', data: {...} }` |
| Create Blog | `POST /api/blogs` | `content_updated` | `{ section: 'blogs', action: 'create', data: {...}, allBlogs: [...] }` |
| Update Blog | `PUT /api/blogs/:id` | `content_updated` | `{ section: 'blogs', action: 'update', data: {...}, allBlogs: [...] }` |
| Delete Blog | `DELETE /api/blogs/:id` | `content_updated` | `{ section: 'blogs', action: 'delete', data: {...}, allBlogs: [...] }` |
| Create Project | `POST /api/portfolio` | `content_updated` | `{ section: 'portfolio', action: 'create', data: {...}, allProjects: [...] }` |
| Update Project | `PUT /api/portfolio/:id` | `content_updated` | `{ section: 'portfolio', action: 'update', data: {...}, allProjects: [...] }` |
| Delete Project | `DELETE /api/portfolio/:id` | `content_updated` | `{ section: 'portfolio', action: 'delete', data: {...}, allProjects: [...] }` |

### Benefits

1. **No Page Refresh**: Users see updates without reloading
2. **Instant Feedback**: Admins see changes immediately
3. **Better UX**: Smooth, modern content management
4. **Multi-Admin**: Multiple admins can work simultaneously
5. **Live Preview**: Preview changes on separate devices

For complete documentation, see `REALTIME_CONTENT_GUIDE.md`
