# Design Document: User Chat System

## Overview

The user chat system enables real-time communication between website visitors and the admin. It includes user registration/login, real-time messaging via WebSocket, conversation management, and an admin dashboard to handle all user chats. The system uses JWT authentication, bcrypt password hashing, Socket.IO for real-time communication, and JSON file storage.

## Architecture

### Technology Stack
- **Backend Framework**: Express.js
- **Real-Time Communication**: Socket.IO
- **Authentication**: JWT + bcrypt
- **Storage**: JSON files
- **WebSocket**: Socket.IO for bidirectional communication

### System Architecture

```
┌─────────────────────────────────────┐
│         Frontend Clients            │
│  ┌──────────────┐  ┌──────────────┐ │
│  │  User Client │  │ Admin Client │ │
│  └──────┬───────┘  └──────┬───────┘ │
└─────────┼──────────────────┼─────────┘
          │                  │
          │ HTTP/REST        │ HTTP/REST
          │ WebSocket        │ WebSocket
          ▼                  ▼
┌─────────────────────────────────────┐
│      Express.js + Socket.IO         │
│  ┌───────────────────────────────┐  │
│  │   Authentication Layer        │  │
│  │   - JWT Verification          │  │
│  │   - Password Hashing          │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   REST API Routes             │  │
│  │   - User Auth (register/login)│  │
│  │   - Messages (send/receive)   │  │
│  │   - Conversations (list/view) │  │
│  │   - Profile Management        │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   WebSocket Layer (Socket.IO) │  │
│  │   - Real-time messaging       │  │
│  │   - Typing indicators         │  │
│  │   - Online status             │  │
│  │   - Connection management     │  │
│  └───────────┬───────────────────┘  │
│              │                       │
│  ┌───────────▼───────────────────┐  │
│  │   Storage Layer               │  │
│  │   - users.json                │  │
│  │   - messages.json             │  │
│  │   - Online users tracking     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│         File System                 │
│   - data/users.json                 │
│   - data/messages.json              │
└─────────────────────────────────────┘
```

## Components and Interfaces

### 1. User Authentication Module

**Purpose**: Handle user registration and login

**Endpoints**:
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)

**Data Structures**:
```javascript
User {
  id: string (UUID),
  username: string,
  email: string,
  password: string (bcrypt hash),
  role: 'user' | 'admin',
  createdAt: string (ISO 8601),
  lastLogin: string (ISO 8601)
}
```

**Registration Flow**:
1. Validate input (email format, password length, required fields)
2. Check for duplicate email/username
3. Hash password with bcrypt
4. Generate unique user ID
5. Save user to users.json
6. Generate JWT token
7. Return token and user info (without password)

**Login Flow**:
1. Find user by email
2. Compare password with bcrypt
3. Update lastLogin timestamp
4. Generate JWT token
5. Return token and user info

### 2. Messaging Module

**Purpose**: Handle sending and receiving messages

**Endpoints**:
- `POST /api/messages/send` - Send message (authenticated)
- `GET /api/messages/:userId` - Get conversation with specific user (authenticated)
- `GET /api/messages` - Get user's messages (for regular users)
- `PUT /api/messages/:messageId/read` - Mark message as read

**Data Structures**:
```javascript
Message {
  id: string (UUID),
  senderId: string (user ID),
  receiverId: string (user ID),
  content: string,
  read: boolean,
  createdAt: string (ISO 8601)
}
```

**Send Message Flow**:
1. Authenticate user via JWT
2. Validate message content
3. Validate receiver exists
4. Create message object
5. Save to messages.json
6. Emit real-time event via Socket.IO
7. Return message object

### 3. Conversation Management Module

**Purpose**: Manage conversation lists and history

**Endpoints**:
- `GET /api/conversations` - List all conversations (admin only)
- `GET /api/conversations/:userId` - Get specific conversation (admin only)
- `DELETE /api/conversations/:userId` - Delete conversation (admin only)
- `GET /api/conversations/search` - Search conversations (admin only)

**Data Structures**:
```javascript
Conversation {
  user: User,
  lastMessage: Message,
  unreadCount: number,
  isOnline: boolean
}
```

**List Conversations Flow** (Admin):
1. Authenticate admin
2. Get all users (exclude admin)
3. For each user:
   - Get last message
   - Count unread messages from user
   - Check online status
4. Sort by last message timestamp
5. Return conversation list

### 4. Real-Time Communication Module (Socket.IO)

**Purpose**: Enable real-time messaging and status updates

**Socket Events**:

**Client → Server**:
- `authenticate` - Authenticate socket connection with JWT
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `mark_read` - Mark messages as read

**Server → Client**:
- `authenticated` - Authentication successful
- `new_message` - New message received
- `message_read` - Message marked as read
- `user_online` - User came online
- `user_offline` - User went offline
- `typing` - Other party is typing
- `stop_typing` - Other party stopped typing

**Connection Management**:
```javascript
// In-memory store for active connections
onlineUsers = {
  [userId]: socketId
}
```

**Socket Authentication Flow**:
1. Client connects to Socket.IO
2. Client emits 'authenticate' with JWT token
3. Server verifies JWT
4. Server stores userId → socketId mapping
5. Server broadcasts user online status
6. On disconnect, remove mapping and broadcast offline status

### 5. Admin Dashboard Module

**Purpose**: Provide admin interface for managing conversations

**Endpoints**:
- `GET /api/admin/stats` - Get chat statistics
- `GET /api/admin/users` - List all users
- `DELETE /api/admin/users/:userId` - Delete user and conversation

**Statistics**:
```javascript
{
  totalUsers: number,
  totalMessages: number,
  unreadMessages: number,
  onlineUsers: number,
  conversationsToday: number
}
```

## Data Models

### File Structure
```
backend/
├── server.js
├── data/
│   ├── users.json
│   └── messages.json
└── uploads/
```

### users.json
```json
[
  {
    "id": "uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "password": "$2b$10$...",
    "role": "user",
    "createdAt": "2026-02-22T10:00:00.000Z",
    "lastLogin": "2026-02-22T15:30:00.000Z"
  }
]
```

### messages.json
```json
[
  {
    "id": "uuid",
    "senderId": "user-uuid",
    "receiverId": "admin-uuid",
    "content": "Hello, I have a question",
    "read": false,
    "createdAt": "2026-02-22T15:30:00.000Z"
  }
]
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Password Security
*For any* user registration or password update, the stored password should be a bcrypt hash, never plain text.
**Validates: Requirements 1.4, 15.1**

### Property 2: Unique User Credentials
*For any* two different users, their email addresses and usernames should be unique.
**Validates: Requirements 1.2, 1.3**

### Property 3: Message Ownership
*For any* message retrieval by a regular user, only messages where the user is sender or receiver should be returned.
**Validates: Requirements 15.3**

### Property 4: Admin Access Control
*For any* conversation list request, only admin users should be able to access all conversations.
**Validates: Requirements 5.1, 15.4**

### Property 5: Message Persistence
*For any* message sent, retrieving messages immediately after should include that message.
**Validates: Requirements 10.1, 10.5**

### Property 6: Real-Time Delivery
*For any* message sent while receiver is online, the receiver should receive a real-time notification.
**Validates: Requirements 8.1, 8.4**

### Property 7: Read Status Update
*For any* message marked as read, subsequent retrievals should show read=true.
**Validates: Requirements 4.3, 7.2**

### Property 8: Online Status Accuracy
*For any* user with an active WebSocket connection, their online status should be true.
**Validates: Requirements 9.1, 9.2**

### Property 9: JWT Token Validity
*For any* valid JWT token, decoding it should return the correct user ID and role.
**Validates: Requirements 2.5, 15.2**

### Property 10: Conversation Ordering
*For any* conversation list, conversations should be ordered by most recent message timestamp.
**Validates: Requirements 5.5**

## Error Handling

### Error Response Format
```javascript
{
  error: string,
  details?: any
}
```

### HTTP Status Codes
- **200 OK**: Successful operations
- **201 Created**: User/message created
- **400 Bad Request**: Validation errors
- **401 Unauthorized**: Authentication failures
- **403 Forbidden**: Authorization failures
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate email/username
- **500 Internal Server Error**: Server errors

### Error Scenarios

1. **Registration Errors**
   - Duplicate email → 409 "Email already exists"
   - Duplicate username → 409 "Username already exists"
   - Invalid email format → 400 "Invalid email format"
   - Short password → 400 "Password must be at least 6 characters"

2. **Login Errors**
   - User not found → 401 "Invalid credentials"
   - Wrong password → 401 "Invalid credentials"
   - Missing fields → 400 "Email and password required"

3. **Message Errors**
   - Empty content → 400 "Message content required"
   - Invalid receiver → 404 "Receiver not found"
   - Unauthorized access → 403 "Access denied"

4. **WebSocket Errors**
   - Invalid token → Disconnect with error
   - Authentication timeout → Disconnect

## Testing Strategy

### Unit Testing
- Test password hashing and verification
- Test JWT token generation and validation
- Test message CRUD operations
- Test conversation aggregation logic
- Test user authentication flows
- Test input validation

### Property-Based Testing
Using fast-check for JavaScript:

1. **Password Hashing Test** (Property 1)
   - Generate random passwords
   - Hash and verify
   - Ensure hashes are different from plain text

2. **Unique Credentials Test** (Property 2)
   - Generate multiple users
   - Verify no duplicate emails/usernames

3. **Message Access Control Test** (Property 3)
   - Generate random messages
   - Verify users only access their messages

4. **Admin Authorization Test** (Property 4)
   - Attempt admin operations with user role
   - Verify rejection

5. **Message Persistence Test** (Property 5)
   - Send random messages
   - Retrieve and verify presence

6. **Read Status Test** (Property 7)
   - Mark messages as read
   - Verify status persists

7. **JWT Validation Test** (Property 9)
   - Generate tokens
   - Decode and verify payload

### Integration Testing
- Test complete registration → login → send message flow
- Test real-time message delivery via Socket.IO
- Test admin viewing all conversations
- Test typing indicators
- Test online/offline status updates
- Test conversation deletion

### WebSocket Testing
- Test socket authentication
- Test message broadcasting
- Test connection/disconnection handling
- Test typing indicator timing
- Test concurrent connections

### Test Configuration
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: user-chat-system, Property N: [property text]**
- Use separate test data files
- Clean up after each test

## Security Considerations

### Implementation
1. **Password Security**
   - Use bcrypt with salt rounds = 10
   - Never return password hashes in responses
   - Validate password strength

2. **JWT Security**
   - Use strong secret from environment
   - Set reasonable expiration (24 hours)
   - Include user ID and role in payload

3. **Input Validation**
   - Sanitize all user inputs
   - Validate email format
   - Prevent XSS attacks
   - Limit message length

4. **WebSocket Security**
   - Authenticate all socket connections
   - Validate all socket events
   - Rate limit message sending
   - Disconnect invalid connections

5. **Authorization**
   - Verify user can only access own data
   - Verify admin role for admin endpoints
   - Check message ownership

### Rate Limiting (Recommended)
- Login attempts: 5 per 15 minutes
- Registration: 3 per hour per IP
- Messages: 30 per minute per user
- Socket connections: 5 per user

## Deployment Considerations

### Environment Variables
```env
# Existing
PORT=5000
JWT_SECRET=your_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173

# New for chat system
BCRYPT_ROUNDS=10
SOCKET_CORS_ORIGIN=http://localhost:5173
MAX_MESSAGE_LENGTH=1000
```

### Socket.IO Configuration
```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN,
    credentials: true
  }
});
```

### Scaling Considerations
- For multiple server instances, use Redis adapter for Socket.IO
- Consider database instead of JSON files for production
- Implement message pagination for large conversations
- Add message search functionality
- Consider message retention policies

## API Documentation

### User Endpoints

**POST /api/users/register**
```javascript
Request: {
  username: string,
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: string,
    username: string,
    email: string,
    role: string
  }
}
```

**POST /api/users/login**
```javascript
Request: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: string,
    username: string,
    email: string,
    role: string
  }
}
```

### Message Endpoints

**POST /api/messages/send**
```javascript
Headers: { Authorization: "Bearer <token>" }
Request: {
  receiverId: string,
  content: string
}
Response: {
  id: string,
  senderId: string,
  receiverId: string,
  content: string,
  read: boolean,
  createdAt: string
}
```

**GET /api/messages**
```javascript
Headers: { Authorization: "Bearer <token>" }
Response: [Message]
```

### Admin Endpoints

**GET /api/conversations**
```javascript
Headers: { Authorization: "Bearer <admin-token>" }
Response: [
  {
    user: User,
    lastMessage: Message,
    unreadCount: number,
    isOnline: boolean
  }
]
```

**GET /api/conversations/:userId**
```javascript
Headers: { Authorization: "Bearer <admin-token>" }
Response: {
  user: User,
  messages: [Message]
}
```
