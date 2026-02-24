# Implementation Plan: User Chat System

## Overview

This implementation plan outlines the tasks to build a real-time chat system where users can register, login, and chat with the admin. The system uses Socket.IO for real-time communication, bcrypt for password security, and JWT for authentication.

## Tasks

- [ ] 1. Install required dependencies
  - Install socket.io for real-time communication
  - Install bcryptjs for password hashing
  - Update package.json
  - _Requirements: 1.4, 15.1_

- [ ] 2. Create data storage files
  - [ ] 2.1 Initialize users.json file
    - Create empty array structure
    - _Requirements: 10.3_

  - [ ] 2.2 Initialize messages.json file
    - Create empty array structure
    - _Requirements: 10.2_

- [ ] 3. Implement user authentication system
  - [ ] 3.1 Create user registration endpoint
    - POST /api/users/register
    - Validate email format and password length
    - Check for duplicate email/username
    - Hash password with bcrypt
    - Generate unique user ID
    - Save user to users.json
    - Generate JWT token
    - Return token and user info
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

  - [ ] 3.2 Create user login endpoint
    - POST /api/users/login
    - Find user by email
    - Verify password with bcrypt
    - Update lastLogin timestamp
    - Generate JWT token
    - Return token and user info
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 3.3 Create user profile endpoints
    - GET /api/users/profile - Get current user profile
    - PUT /api/users/profile - Update user profile
    - Validate authentication
    - Exclude password from responses
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 4. Implement messaging endpoints
  - [ ] 4.1 Create send message endpoint
    - POST /api/messages/send
    - Authenticate user
    - Validate message content
    - Validate receiver exists
    - Create message with unique ID
    - Save to messages.json
    - Return message object
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ] 4.2 Create get messages endpoint for users
    - GET /api/messages
    - Authenticate user
    - Get all messages where user is sender or receiver
    - Order by timestamp
    - Return messages
    - _Requirements: 4.1, 4.2, 4.4_

  - [ ] 4.3 Create mark as read endpoint
    - PUT /api/messages/:messageId/read
    - Authenticate user
    - Find message
    - Update read status
    - Save changes
    - _Requirements: 4.3_

- [ ] 5. Implement admin conversation management
  - [ ] 5.1 Create list all conversations endpoint
    - GET /api/conversations
    - Verify admin role
    - Get all users (exclude admin)
    - For each user, get last message and unread count
    - Include online status
    - Sort by most recent message
    - Return conversation list
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 5.2 Create view specific conversation endpoint
    - GET /api/conversations/:userId
    - Verify admin role
    - Get user information
    - Get all messages between admin and user
    - Mark user messages as read
    - Order messages by timestamp
    - Return conversation
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 5.3 Create admin send message endpoint
    - POST /api/admin/messages/send
    - Verify admin role
    - Validate receiver exists
    - Create message with admin as sender
    - Save to messages.json
    - Return message
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 5.4 Create delete conversation endpoint
    - DELETE /api/conversations/:userId
    - Verify admin role
    - Delete all messages between admin and user
    - Optionally delete user account
    - Return confirmation
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ] 5.5 Create search conversations endpoint
    - GET /api/conversations/search
    - Verify admin role
    - Support search by username and email
    - Support filter by unread messages
    - Case-insensitive search
    - Return matching conversations
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [ ] 6. Implement Socket.IO real-time communication
  - [ ] 6.1 Set up Socket.IO server
    - Initialize Socket.IO with Express server
    - Configure CORS for frontend
    - Set up connection handler
    - _Requirements: 8.2_

  - [ ] 6.2 Implement socket authentication
    - Listen for 'authenticate' event
    - Verify JWT token
    - Store userId → socketId mapping
    - Emit 'authenticated' event
    - Handle authentication errors
    - _Requirements: 8.3_

  - [ ] 6.3 Implement real-time message delivery
    - Listen for 'send_message' event
    - Validate and save message
    - Find receiver's socket connection
    - Emit 'new_message' to receiver
    - Emit confirmation to sender
    - _Requirements: 8.1, 8.4_

  - [ ] 6.4 Implement online status tracking
    - Mark user online on connection
    - Store in onlineUsers map
    - Broadcast 'user_online' event
    - Mark user offline on disconnect
    - Broadcast 'user_offline' event
    - Clean up socket mapping
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ] 6.5 Implement typing indicators
    - Listen for 'typing_start' event
    - Broadcast to receiver
    - Listen for 'typing_stop' event
    - Broadcast to receiver
    - Auto-clear after 3 seconds
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [ ] 6.6 Implement message read status via socket
    - Listen for 'mark_read' event
    - Update message read status
    - Emit 'message_read' to sender
    - _Requirements: 4.3, 7.2_

- [ ] 7. Implement admin statistics endpoint
  - [ ] 7.1 Create admin stats endpoint
    - GET /api/admin/stats
    - Verify admin role
    - Count total users
    - Count total messages
    - Count unread messages
    - Count online users
    - Count conversations today
    - Return statistics
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Add helper functions and utilities
  - [ ] 8.1 Create user storage helpers
    - readUsers() - Read users from JSON
    - writeUsers() - Write users to JSON
    - findUserByEmail()
    - findUserById()
    - findUserByUsername()

  - [ ] 8.2 Create message storage helpers
    - readMessages() - Read messages from JSON
    - writeMessages() - Write messages to JSON
    - getConversation(userId1, userId2)
    - getLastMessage(userId)
    - getUnreadCount(userId)

  - [ ] 8.3 Create authentication helpers
    - hashPassword(password)
    - comparePassword(password, hash)
    - generateToken(user)
    - verifyToken(token)
    - authenticateSocket(token)

- [ ] 9. Update environment variables
  - [ ] 9.1 Add new environment variables to .env
    - BCRYPT_ROUNDS
    - SOCKET_CORS_ORIGIN
    - MAX_MESSAGE_LENGTH
    - _Requirements: 15.1_

  - [ ] 9.2 Update .env.example with new variables

- [ ] 10. Add input validation and security
  - [ ] 10.1 Implement input validation middleware
    - Validate email format
    - Validate password length
    - Validate message content length
    - Sanitize inputs
    - _Requirements: 1.5, 1.6, 3.5, 15.5_

  - [ ] 10.2 Implement authorization middleware
    - Verify admin role for admin endpoints
    - Verify user can only access own data
    - Check message ownership
    - _Requirements: 15.3, 15.4_

- [ ] 11. Error handling and logging
  - [ ] 11.1 Add comprehensive error handling
    - Handle duplicate email/username (409)
    - Handle invalid credentials (401)
    - Handle unauthorized access (403)
    - Handle not found (404)
    - Handle validation errors (400)
    - _Requirements: 1.2, 1.3, 2.2_

  - [ ] 11.2 Add logging for debugging
    - Log user registrations
    - Log login attempts
    - Log message sends
    - Log socket connections/disconnections

- [ ] 12. Testing and validation
  - [ ] 12.1 Test user registration flow
    - Test successful registration
    - Test duplicate email/username
    - Test invalid email format
    - Test short password

  - [ ] 12.2 Test user login flow
    - Test successful login
    - Test invalid credentials
    - Test token generation

  - [ ] 12.3 Test messaging flow
    - Test sending messages
    - Test receiving messages
    - Test marking as read

  - [ ] 12.4 Test real-time communication
    - Test socket authentication
    - Test real-time message delivery
    - Test typing indicators
    - Test online status

  - [ ] 12.5 Test admin features
    - Test viewing all conversations
    - Test viewing specific conversation
    - Test sending admin messages
    - Test deleting conversations

- [ ] 13. Documentation
  - [ ] 13.1 Update backend README
    - Document new endpoints
    - Document Socket.IO events
    - Document environment variables
    - Add usage examples

  - [ ] 13.2 Create API documentation
    - Document all endpoints
    - Include request/response examples
    - Document error codes
    - Document Socket.IO events

## Notes

- Socket.IO requires HTTP server instance (not just Express app)
- bcrypt hashing is CPU-intensive, use appropriate salt rounds (10)
- Store online users in memory (will reset on server restart)
- Consider rate limiting for production
- JWT tokens should have reasonable expiration
- Admin user should be created separately or use existing admin credentials
- Messages are stored in chronological order
- Conversations are computed dynamically from messages
- WebSocket connections require authentication before use

## Running the Chat System

After implementation:

1. Install dependencies:
```bash
cd responsive-portfolio-website-Alexa/backend
npm install
```

2. Start the server:
```bash
npm start
```

3. The server will support:
   - REST API endpoints for auth and messaging
   - WebSocket connections on the same port
   - Real-time message delivery
   - Online status tracking
   - Typing indicators

## Frontend Integration Notes

Frontend will need to:
1. Connect to Socket.IO server
2. Authenticate socket connection with JWT
3. Listen for real-time events
4. Emit events for sending messages and typing
5. Handle online/offline status updates
6. Display typing indicators
7. Update UI when new messages arrive
