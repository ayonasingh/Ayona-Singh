# Chat System Implementation Guide

## Overview

A complete real-time chat system has been implemented that allows website visitors to register, login, and chat with you (the admin) through your portfolio website.

## ✅ What's Been Implemented

### Backend Features
- ✅ User registration with email validation
- ✅ User login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Real-time messaging via Socket.IO
- ✅ User-to-admin conversations
- ✅ Admin dashboard to view all conversations
- ✅ Read/unread message status
- ✅ Online/offline status tracking
- ✅ Typing indicators
- ✅ Message history persistence
- ✅ Search and filter conversations
- ✅ Delete conversations and users

### File Structure
```
backend/
├── helpers/
│   ├── userHelpers.js          # User CRUD operations
│   ├── messageHelpers.js       # Message operations
│   └── authHelpers.js          # JWT token management
├── middleware/
│   └── auth.js                 # Authentication middleware
├── routes/
│   ├── userRoutes.js           # User registration/login
│   ├── messageRoutes.js        # Messaging endpoints
│   ├── conversationRoutes.js   # Admin conversation management
│   └── adminRoutes.js          # Admin operations
├── socket/
│   └── chatSocket.js           # Socket.IO real-time handlers
├── scripts/
│   └── createAdmin.js          # Create admin user script
├── data/
│   ├── users.json              # User accounts
│   └── messages.json           # Chat messages
├── server.js                   # Main server with Socket.IO
└── test-chat.html              # Test interface
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd responsive-portfolio-website-Alexa/backend
npm install
```

### 2. Create Admin User
```bash
npm run create-admin
```

This creates an admin user with:
- Username: admin
- Email: admin@portfolio.com
- Password: admin123
- Role: admin

**⚠️ Important:** Save the admin ID that's displayed - you'll need it!

### 3. Start the Server
```bash
npm start
```

The server will start on http://localhost:5000 with:
- REST API endpoints
- Socket.IO for real-time communication
- Chat system enabled

### 4. Test the Chat System

Open `test-chat.html` in your browser to test:
1. Register a new user
2. Login with the user
3. Send messages to admin
4. See real-time delivery

## 📡 API Endpoints

### User Authentication

**Register User**
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login User**
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Get Profile**
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### Messaging

**Send Message**
```http
POST /api/messages/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "admin-user-id",
  "content": "Hello admin!"
}
```

**Get Messages**
```http
GET /api/messages
Authorization: Bearer <token>
```

**Get Conversation**
```http
GET /api/messages/:userId
Authorization: Bearer <token>
```

**Mark as Read**
```http
PUT /api/messages/:messageId/read
Authorization: Bearer <token>
```

### Admin Endpoints

**List All Conversations**
```http
GET /api/conversations
Authorization: Bearer <admin-token>
```

**Get Specific Conversation**
```http
GET /api/conversations/:userId
Authorization: Bearer <admin-token>
```

**Delete Conversation**
```http
DELETE /api/conversations/:userId?deleteUser=true
Authorization: Bearer <admin-token>
```

**Search Conversations**
```http
GET /api/conversations/search/query?q=john&unread=true
Authorization: Bearer <admin-token>
```

**Get Statistics**
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

**Admin Send Message**
```http
POST /api/admin/messages/send
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "receiverId": "user-id",
  "content": "Hello! How can I help you?"
}
```

## 🔌 Socket.IO Events

### Client → Server

```javascript
// Authenticate socket
socket.emit('authenticate', jwtToken);

// Send message
socket.emit('send_message', {
  receiverId: 'user-id',
  content: 'Hello!'
});

// Typing indicators
socket.emit('typing_start', { receiverId: 'user-id' });
socket.emit('typing_stop', { receiverId: 'user-id' });

// Mark as read
socket.emit('mark_read', { messageId: 'message-id' });
```

### Server → Client

```javascript
// Authentication
socket.on('authenticated', (data) => {
  console.log('User ID:', data.userId);
});

// New message
socket.on('new_message', (message) => {
  // Display message in UI
});

// Message sent confirmation
socket.on('message_sent', (message) => {
  // Update UI
});

// Online status
socket.on('user_online', (data) => {
  console.log(`User ${data.userId} is online`);
});

socket.on('user_offline', (data) => {
  console.log(`User ${data.userId} is offline`);
});

// Typing indicators
socket.on('typing', (data) => {
  console.log(`User ${data.userId} is typing...`);
});

socket.on('stop_typing', (data) => {
  // Hide typing indicator
});

// Message read
socket.on('message_read', (data) => {
  console.log(`Message ${data.messageId} was read`);
});

// Errors
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

## 🎨 Frontend Integration

### React Example

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io('http://localhost:5000');
    
    // Authenticate
    const token = localStorage.getItem('token');
    newSocket.emit('authenticate', token);

    // Listen for events
    newSocket.on('authenticated', (data) => {
      console.log('Authenticated:', data.userId);
    });

    newSocket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('typing', () => {
      setIsTyping(true);
    });

    newSocket.on('stop_typing', () => {
      setIsTyping(false);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    socket.emit('send_message', {
      receiverId: 'admin-id',
      content: message
    });
    
    setMessage('');
  };

  const handleTyping = () => {
    socket.emit('typing_start', { receiverId: 'admin-id' });
    
    // Auto-stop after 1 second
    setTimeout(() => {
      socket.emit('typing_stop', { receiverId: 'admin-id' });
    }, 1000);
  };

  return (
    <div>
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
        {isTyping && <div>Admin is typing...</div>}
      </div>
      
      <input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping();
        }}
        placeholder="Type a message..."
      />
      
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
```

## 🔐 Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Message length limit (1000 characters)
- ✅ Socket authentication required
- ✅ Role-based access control (admin vs user)
- ✅ Users can only access their own messages
- ✅ Admin-only endpoints protected

## 📊 Admin Dashboard Features

As an admin, you can:
- View all user conversations
- See unread message counts
- Check online/offline status
- Send messages to any user
- Search conversations by username/email
- Filter by unread messages
- Delete conversations
- Delete user accounts
- View chat statistics

## 🧪 Testing

### Manual Testing with cURL

**1. Register a user:**
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**3. Send message (use token from login):**
```bash
curl -X POST http://localhost:5000/api/messages/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"receiverId":"ADMIN_ID","content":"Hello!"}'
```

### Using test-chat.html

1. Open `test-chat.html` in your browser
2. Register a new user
3. Login with the user
4. Send messages to admin
5. Open another browser/tab as admin to see real-time chat

## 🔧 Configuration

### Environment Variables

Add to `.env`:
```env
# Chat System
BCRYPT_ROUNDS=10
SOCKET_CORS_ORIGIN=http://localhost:5173
MAX_MESSAGE_LENGTH=1000
ADMIN_EMAIL=admin@portfolio.com
```

## 📝 Next Steps

### For Production:
1. Change default admin password
2. Use strong JWT_SECRET
3. Enable HTTPS
4. Implement rate limiting
5. Add message pagination
6. Consider using a database instead of JSON files
7. Add file/image sharing in chat
8. Add email notifications for new messages
9. Add chat history export
10. Add user blocking functionality

### Frontend Development:
1. Create user registration/login pages
2. Build chat interface component
3. Implement Socket.IO connection
4. Add typing indicators UI
5. Show online/offline status
6. Display unread message counts
7. Add message timestamps
8. Implement message search
9. Add emoji support
10. Create admin dashboard

## 🐛 Troubleshooting

**Socket not connecting:**
- Check SOCKET_CORS_ORIGIN matches frontend URL
- Verify server is running
- Check browser console for errors

**Authentication failing:**
- Verify JWT token is valid
- Check token expiration
- Ensure Authorization header format: "Bearer <token>"

**Messages not delivering:**
- Check both users exist
- Verify receiver ID is correct
- Check server logs for errors

**Admin can't see conversations:**
- Ensure admin user has role: "admin"
- Verify admin is logged in
- Check JWT token includes admin role

## 📚 Additional Resources

- Socket.IO Documentation: https://socket.io/docs/
- JWT Documentation: https://jwt.io/
- bcrypt Documentation: https://www.npmjs.com/package/bcryptjs

## 🎉 Success!

Your chat system is now fully functional! Users can register, login, and chat with you in real-time. The admin panel gives you complete control over all conversations.

For questions or issues, check the server logs or refer to the API documentation above.
