# Design Document: Admin Panel Backend

## Overview

The admin panel backend is a RESTful API built with Express.js that provides complete content management capabilities for a portfolio website. It uses JWT-based authentication, file-based JSON storage, and includes image upload functionality with Multer. The system is designed to be simple, maintainable, and suitable for a single-admin portfolio site.

## Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Authentication**: JSON Web Tokens (jsonwebtoken 9.0.3)
- **File Upload**: Multer 2.0.2
- **Storage**: File-based JSON storage
- **CORS**: cors 2.8.6
- **ID Generation**: uuid 13.0.0

### System Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/REST
         │ (CORS enabled)
         ▼
┌─────────────────────────────────┐
│   Express.js Backend (Port 5000)│
│  ┌──────────────────────────┐   │
│  │  Authentication Layer    │   │
│  │  (JWT Middleware)        │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   REST API Routes        │   │
│  │  - Auth                  │   │
│  │  - Site Content          │   │
│  │  - Blogs                 │   │
│  │  - Portfolio             │   │
│  │  - Contacts              │   │
│  │  - Upload                │   │
│  │  - Stats                 │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │  Storage Layer           │   │
│  │  - JSON File I/O         │   │
│  │  - Image File Storage    │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  File System                    │
│  - data/siteContent.json        │
│  - data/blogs.json              │
│  - data/portfolio.json          │
│  - data/contacts.json           │
│  - uploads/*.{jpg,png,gif,...}  │
└─────────────────────────────────┘
```

## Components and Interfaces

### 1. Authentication Module

**Purpose**: Handles user authentication and JWT token management

**Components**:
- Login endpoint
- Token verification endpoint
- Authentication middleware

**Interface**:
```javascript
// POST /api/auth/login
Request: { username: string, password: string }
Response: { token: string, username: string }

// GET /api/auth/verify
Headers: { Authorization: "Bearer <token>" }
Response: { valid: boolean, user: { username: string } }
```

**Implementation Details**:
- Hardcoded credentials: username="admin", password="admin123"
- JWT secret: "ayona_admin_secret_2026"
- Token expiration: 24 hours
- Middleware extracts token from Authorization header (Bearer scheme)

### 2. Site Content Module

**Purpose**: Manages home, about, and skills sections

**Endpoints**:
- `GET /api/home` - Retrieve home section
- `PUT /api/home` - Update home section (authenticated)
- `GET /api/about` - Retrieve about section
- `PUT /api/about` - Update about section (authenticated)
- `GET /api/skills` - Retrieve skills section
- `PUT /api/skills` - Update skills section (authenticated)

**Data Structure**:
```javascript
{
  home: {
    name: string,
    subtitle: string,
    description: string
  },
  about: {
    description: string,
    image: string,
    stats: Array<{
      id: string,
      icon: string,
      title: string,
      subtitle: string
    }>
  },
  skills: {
    mathCore: Array<{ id: string, name: string, level: string }>,
    tools: Array<{ id: string, name: string, level: string }>
  }
}
```

### 3. Blog Module

**Purpose**: Full CRUD operations for blog posts

**Endpoints**:
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (authenticated)
- `PUT /api/blogs/:id` - Update blog (authenticated)
- `DELETE /api/blogs/:id` - Delete blog (authenticated)

**Data Structure**:
```javascript
{
  id: string (UUID),
  tag: string,
  date: string,
  readTime: string,
  title: string,
  excerpt: string,
  image: string (URL),
  link: string,
  createdAt: string (ISO 8601)
}
```

**Special Behavior**:
- New blogs are prepended to array (newest first)
- Deletion removes associated image from uploads directory
- Auto-generates UUID and timestamp on creation

### 4. Portfolio Module

**Purpose**: Full CRUD operations for portfolio projects

**Endpoints**:
- `GET /api/portfolio` - List all projects
- `GET /api/portfolio/:id` - Get single project
- `POST /api/portfolio` - Create project (authenticated)
- `PUT /api/portfolio/:id` - Update project (authenticated)
- `DELETE /api/portfolio/:id` - Delete project (authenticated)

**Data Structure**:
```javascript
{
  id: string (UUID),
  title: string,
  description: string,
  image: string (URL),
  link: string,
  createdAt: string (ISO 8601)
}
```

**Special Behavior**:
- New projects are prepended to array (newest first)
- Deletion removes associated image from uploads directory
- Auto-generates UUID and timestamp on creation

### 5. Contact Module

**Purpose**: Manages contact form submissions

**Endpoints**:
- `GET /api/contacts` - List all messages (authenticated)
- `POST /api/contacts` - Submit message (public)
- `PUT /api/contacts/:id/read` - Mark as read (authenticated)
- `DELETE /api/contacts/:id` - Delete message (authenticated)

**Data Structure**:
```javascript
{
  id: string (UUID),
  name: string,
  email: string,
  message: string,
  read: boolean,
  createdAt: string (ISO 8601)
}
```

**Special Behavior**:
- POST endpoint is public (no authentication required)
- New messages default to read=false
- Messages prepended to array (newest first)

### 6. Image Upload Module

**Purpose**: Handles image uploads with validation

**Endpoint**:
- `POST /api/upload` - Upload image (authenticated)

**Configuration**:
- Allowed formats: jpeg, jpg, png, gif, webp, svg
- Max file size: 5MB
- Storage: uploads/ directory
- Filename: UUID + original extension

**Response**:
```javascript
{
  url: string (full URL),
  filename: string
}
```

### 7. Statistics Module

**Purpose**: Provides dashboard statistics

**Endpoint**:
- `GET /api/stats` - Get statistics (authenticated)

**Response**:
```javascript
{
  blogsCount: number,
  projectsCount: number,
  messagesCount: number,
  unreadMessages: number
}
```

### 8. Storage Layer

**Purpose**: Abstracts JSON file operations

**Functions**:
```javascript
readJSON(filename: string): any
writeJSON(filename: string, data: any): void
```

**Behavior**:
- Returns empty array if file doesn't exist
- Writes formatted JSON with 2-space indentation
- Synchronous operations for simplicity

## Data Models

### File Structure
```
backend/
├── server.js
├── package.json
├── data/
│   ├── siteContent.json
│   ├── blogs.json
│   ├── portfolio.json
│   └── contacts.json
└── uploads/
    └── <uuid>.<ext>
```

### JSON Storage Files

**siteContent.json**: Single object with home, about, skills sections
**blogs.json**: Array of blog objects
**portfolio.json**: Array of project objects
**contacts.json**: Array of contact message objects

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Authentication Token Validity
*For any* valid username and password combination, generating a token and then verifying it should return a valid user object.
**Validates: Requirements 1.1, 1.3**

### Property 2: Data Persistence Round-Trip
*For any* valid data object (blog, project, site content), writing it to storage and then reading it back should produce an equivalent object.
**Validates: Requirements 8.1, 8.4, 8.5, 8.6, 8.7**

### Property 3: Image Upload File Type Validation
*For any* file upload attempt, only files with allowed extensions (jpeg, jpg, png, gif, webp, svg) should be accepted, all others should be rejected.
**Validates: Requirements 6.2**

### Property 4: Image Deletion on Resource Removal
*For any* blog or portfolio item with an uploaded image, deleting the item should also remove the associated image file from the uploads directory.
**Validates: Requirements 3.5, 3.6, 4.5, 4.6**

### Property 5: Authentication Protection
*For any* write operation (POST, PUT, DELETE) except public contact submission, requests without valid JWT tokens should be rejected with 401 status.
**Validates: Requirements 1.5, 5.5**

### Property 6: Resource Not Found Handling
*For any* GET, PUT, or DELETE request with a non-existent ID, the API should return 404 status with descriptive error.
**Validates: Requirements 9.1**

### Property 7: Statistics Accuracy
*For any* state of the data files, the statistics endpoint should return counts that match the actual number of items in each JSON file.
**Validates: Requirements 7.1, 7.2, 7.3**

### Property 8: Unique ID Generation
*For any* newly created resource (blog, project, contact), the generated ID should be unique and not conflict with existing IDs.
**Validates: Requirements 3.3, 4.3, 5.2**

### Property 9: Timestamp Consistency
*For any* newly created resource, the createdAt timestamp should be in valid ISO 8601 format and represent the creation time.
**Validates: Requirements 3.3, 4.3, 5.2**

### Property 10: CORS Configuration
*For any* request from the frontend origin (http://localhost:5173), the API should allow the request with proper CORS headers.
**Validates: Requirements 10.1, 10.2**

## Error Handling

### Error Response Format
All errors follow a consistent format:
```javascript
{
  error: string (descriptive message)
}
```

### HTTP Status Codes
- **200 OK**: Successful GET/PUT operations
- **201 Created**: Successful POST operations
- **400 Bad Request**: Invalid input or file upload errors
- **401 Unauthorized**: Authentication failures
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

### Error Scenarios

1. **Authentication Errors**
   - Missing token → 401 "No token provided"
   - Invalid token → 401 "Invalid token"
   - Wrong credentials → 401 "Invalid credentials"

2. **Resource Errors**
   - Blog not found → 404 "Blog not found"
   - Project not found → 404 "Project not found"
   - Contact not found → 404 "Contact not found"

3. **Upload Errors**
   - No file provided → 400 "No file uploaded"
   - Invalid file type → 400 "Only images are allowed"
   - File too large → 400 (handled by Multer)

4. **Server Errors**
   - File system errors → 500 (uncaught)
   - JSON parse errors → 500 (uncaught)

## Testing Strategy

### Unit Testing
- Test authentication middleware with valid/invalid tokens
- Test JSON read/write operations
- Test image upload validation logic
- Test error response formatting
- Test CRUD operations for each module

### Property-Based Testing
Using a property-based testing library (e.g., fast-check for JavaScript), implement tests for each correctness property:

1. **Authentication Round-Trip Test** (Property 1)
   - Generate random valid credentials
   - Login and verify token
   - Ensure verification succeeds

2. **Data Persistence Test** (Property 2)
   - Generate random blog/project/content objects
   - Write to storage and read back
   - Verify equivalence

3. **File Type Validation Test** (Property 3)
   - Generate files with various extensions
   - Attempt upload
   - Verify only allowed types succeed

4. **Image Cleanup Test** (Property 4)
   - Create blog/project with image
   - Delete the resource
   - Verify image file is removed

5. **Authentication Protection Test** (Property 5)
   - Attempt write operations without token
   - Verify all return 401

6. **404 Handling Test** (Property 6)
   - Request non-existent resources
   - Verify 404 responses

7. **Statistics Accuracy Test** (Property 7)
   - Generate random data sets
   - Verify stats match actual counts

8. **ID Uniqueness Test** (Property 8)
   - Create multiple resources
   - Verify all IDs are unique

9. **Timestamp Format Test** (Property 9)
   - Create resources
   - Verify ISO 8601 format

10. **CORS Test** (Property 10)
    - Make requests from frontend origin
    - Verify CORS headers present

### Integration Testing
- Test complete workflows (login → create blog → upload image → delete blog)
- Test error scenarios end-to-end
- Test concurrent requests
- Test server restart and data persistence

### Test Configuration
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: admin-panel-backend, Property N: [property text]**
- Use test database/directory separate from production data
- Clean up test files after each test run

## Security Considerations

### Current Implementation
- JWT-based authentication
- Hardcoded admin credentials (suitable for single-admin portfolio)
- File type validation for uploads
- File size limits (5MB)
- CORS restricted to specific origin

### Recommendations for Production
1. Move credentials to environment variables
2. Use bcrypt for password hashing
3. Implement rate limiting
4. Add request validation middleware
5. Use HTTPS in production
6. Implement refresh tokens
7. Add logging and monitoring
8. Consider database instead of JSON files for scalability

## Deployment Considerations

### Environment Variables (Recommended)
```
PORT=5000
JWT_SECRET=<secure-random-string>
ADMIN_USERNAME=<username>
ADMIN_PASSWORD=<hashed-password>
FRONTEND_URL=<production-frontend-url>
```

### Directory Structure
Ensure data/ and uploads/ directories exist and have proper permissions

### Process Management
Use PM2 or similar for process management in production

### Backup Strategy
Regular backups of data/ directory recommended
