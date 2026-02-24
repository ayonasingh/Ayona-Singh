# Requirements Document: User Chat System

## Introduction

This document specifies the requirements for a real-time chat system that allows website visitors to register, login, and chat directly with the admin (portfolio owner). The system includes user authentication, real-time messaging, conversation management, and an admin interface to manage all user conversations.

## Glossary

- **User**: A registered visitor who can chat with the admin
- **Admin**: The portfolio owner who can view and respond to all user chats
- **Chat_Message**: A single message in a conversation
- **Conversation**: A chat thread between a user and the admin
- **Real_Time_Messaging**: Instant message delivery using WebSocket or polling
- **User_Authentication**: Registration and login system for users
- **Message_Status**: Read/unread status of messages
- **Online_Status**: Indicator showing if user/admin is currently online

## Requirements

### Requirement 1: User Registration

**User Story:** As a website visitor, I want to register an account, so that I can chat with the portfolio owner.

#### Acceptance Criteria

1. WHEN a visitor provides username, email, and password, THE Backend_API SHALL create a new user account
2. WHEN a visitor attempts to register with an existing email, THE Backend_API SHALL return an error message
3. WHEN a visitor attempts to register with an existing username, THE Backend_API SHALL return an error message
4. WHEN a user is created, THE Backend_API SHALL hash the password before storing
5. THE Backend_API SHALL validate email format before registration
6. THE Backend_API SHALL enforce minimum password length of 6 characters
7. WHEN registration succeeds, THE Backend_API SHALL return a JWT token and user information

### Requirement 2: User Login

**User Story:** As a registered user, I want to log in to my account, so that I can access my chat conversations.

#### Acceptance Criteria

1. WHEN a user provides valid email and password, THE Backend_API SHALL return a JWT token
2. WHEN a user provides invalid credentials, THE Backend_API SHALL return a 401 error
3. WHEN a user logs in, THE Backend_API SHALL update their last login timestamp
4. THE Backend_API SHALL verify password against hashed password in storage
5. THE Backend_API SHALL generate JWT token with user ID and role

### Requirement 3: Send Messages

**User Story:** As a logged-in user, I want to send messages to the admin, so that I can communicate with the portfolio owner.

#### Acceptance Criteria

1. WHEN a user sends a message, THE Backend_API SHALL create a message with unique ID and timestamp
2. WHEN a user sends a message, THE Backend_API SHALL associate it with their user ID
3. WHEN a message is created, THE Backend_API SHALL set the sender as the user
4. WHEN a message is created, THE Backend_API SHALL set the receiver as admin
5. THE Backend_API SHALL validate message content is not empty
6. THE Backend_API SHALL store message with read status set to false

### Requirement 4: Receive Messages

**User Story:** As a logged-in user, I want to receive messages from the admin, so that I can see their responses.

#### Acceptance Criteria

1. WHEN a user requests their messages, THE Backend_API SHALL return all messages in their conversation
2. WHEN messages are retrieved, THE Backend_API SHALL order them by timestamp (oldest first)
3. WHEN a user views messages, THE Backend_API SHALL mark admin messages as read
4. THE Backend_API SHALL return both sent and received messages for the conversation

### Requirement 5: Admin View All Conversations

**User Story:** As an admin, I want to see all user conversations, so that I can manage and respond to user messages.

#### Acceptance Criteria

1. WHEN an admin requests conversations, THE Backend_API SHALL return all unique user conversations
2. WHEN listing conversations, THE Backend_API SHALL include the last message in each conversation
3. WHEN listing conversations, THE Backend_API SHALL include unread message count for each conversation
4. WHEN listing conversations, THE Backend_API SHALL include user information (username, email)
5. THE Backend_API SHALL order conversations by most recent message first

### Requirement 6: Admin Send Messages

**User Story:** As an admin, I want to send messages to users, so that I can respond to their inquiries.

#### Acceptance Criteria

1. WHEN an admin sends a message to a user, THE Backend_API SHALL create a message with admin as sender
2. WHEN an admin message is created, THE Backend_API SHALL set the receiver as the specified user
3. WHEN an admin sends a message, THE Backend_API SHALL set read status to false
4. THE Backend_API SHALL validate the target user exists before sending

### Requirement 7: Admin View Conversation

**User Story:** As an admin, I want to view a specific user's conversation, so that I can see the full chat history.

#### Acceptance Criteria

1. WHEN an admin requests a specific conversation, THE Backend_API SHALL return all messages between admin and that user
2. WHEN admin views a conversation, THE Backend_API SHALL mark user messages as read
3. THE Backend_API SHALL order messages by timestamp (oldest first)
4. THE Backend_API SHALL include user information with the conversation

### Requirement 8: Real-Time Message Updates

**User Story:** As a user or admin, I want to receive new messages in real-time, so that I can have a live conversation.

#### Acceptance Criteria

1. WHEN a new message is sent, THE Backend_API SHALL notify the receiver in real-time
2. THE Backend_API SHALL support WebSocket connections for real-time updates
3. WHEN a user connects, THE Backend_API SHALL authenticate their WebSocket connection
4. WHEN a message is sent, THE Backend_API SHALL broadcast it to the receiver's active connection
5. WHEN a user disconnects, THE Backend_API SHALL clean up their WebSocket connection

### Requirement 9: Online Status

**User Story:** As a user or admin, I want to see if the other party is online, so that I know if they can respond immediately.

#### Acceptance Criteria

1. WHEN a user connects via WebSocket, THE Backend_API SHALL mark them as online
2. WHEN a user disconnects, THE Backend_API SHALL mark them as offline
3. WHEN requesting conversation list, THE Backend_API SHALL include online status for each user
4. THE Backend_API SHALL track admin online status separately

### Requirement 10: Message History Persistence

**User Story:** As a user or admin, I want all messages to be saved, so that I can review past conversations.

#### Acceptance Criteria

1. WHEN any message is sent, THE Backend_API SHALL persist it to storage immediately
2. THE Backend_API SHALL store messages in messages.json file
3. THE Backend_API SHALL store user accounts in users.json file
4. WHEN the server restarts, THE Backend_API SHALL load all existing messages and users
5. THE Backend_API SHALL maintain message order by timestamp

### Requirement 11: User Profile Management

**User Story:** As a logged-in user, I want to view and update my profile, so that I can keep my information current.

#### Acceptance Criteria

1. WHEN a user requests their profile, THE Backend_API SHALL return their user information (excluding password)
2. WHEN a user updates their profile, THE Backend_API SHALL validate and save the changes
3. THE Backend_API SHALL allow updating username and email
4. THE Backend_API SHALL prevent duplicate usernames and emails when updating
5. THE Backend_API SHALL not return password hash in any response

### Requirement 12: Search and Filter

**User Story:** As an admin, I want to search conversations, so that I can quickly find specific users or messages.

#### Acceptance Criteria

1. WHEN an admin searches by username, THE Backend_API SHALL return matching conversations
2. WHEN an admin searches by email, THE Backend_API SHALL return matching conversations
3. WHEN an admin filters by unread, THE Backend_API SHALL return only conversations with unread messages
4. THE Backend_API SHALL support case-insensitive search

### Requirement 13: Delete Conversation

**User Story:** As an admin, I want to delete conversations, so that I can remove spam or inappropriate content.

#### Acceptance Criteria

1. WHEN an admin deletes a conversation, THE Backend_API SHALL remove all messages between admin and that user
2. WHEN a conversation is deleted, THE Backend_API SHALL optionally delete the user account
3. THE Backend_API SHALL return confirmation after successful deletion

### Requirement 14: Typing Indicator

**User Story:** As a user or admin, I want to see when the other party is typing, so that I know they are composing a response.

#### Acceptance Criteria

1. WHEN a user starts typing, THE Backend_API SHALL broadcast typing status to the receiver
2. WHEN a user stops typing, THE Backend_API SHALL broadcast stopped typing status
3. THE Backend_API SHALL use WebSocket for typing indicators
4. THE Backend_API SHALL clear typing status after 3 seconds of inactivity

### Requirement 15: Security and Authorization

**User Story:** As a system administrator, I want proper security measures, so that user data and conversations are protected.

#### Acceptance Criteria

1. THE Backend_API SHALL hash all passwords using bcrypt before storage
2. THE Backend_API SHALL validate JWT tokens for all protected endpoints
3. THE Backend_API SHALL ensure users can only access their own conversations
4. THE Backend_API SHALL ensure only admin can access all conversations
5. THE Backend_API SHALL validate all input to prevent injection attacks
