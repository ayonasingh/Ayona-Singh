# Implementation Plan: Admin Panel Backend

## Overview

This implementation plan documents the admin panel backend that has been fully implemented in `responsive-portfolio-website-Alexa/backend/server.js`. All tasks listed below are marked as complete since the code already exists and is functional.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Express.js server with CORS and JSON middleware
  - JWT authentication library
  - Multer for file uploads
  - UUID for ID generation
  - _Requirements: 8.2, 10.1_

- [x] 2. Implement authentication system
  - [x] 2.1 Create login endpoint with JWT token generation
    - POST /api/auth/login endpoint
    - Validate credentials against hardcoded admin user
    - Generate JWT token with 24-hour expiration
    - _Requirements: 1.1, 1.2_

  - [x] 2.2 Create token verification endpoint
    - GET /api/auth/verify endpoint
    - Verify JWT token validity
    - Return user information
    - _Requirements: 1.3, 1.4_

  - [x] 2.3 Implement authentication middleware
    - Extract token from Authorization header
    - Verify token using JWT secret
    - Return 401 for invalid/missing tokens
    - _Requirements: 1.4, 1.5_

- [x] 3. Implement storage layer
  - [x] 3.1 Create JSON file read/write helpers
    - readJSON function with file existence check
    - writeJSON function with formatted output
    - _Requirements: 8.1, 8.3_

  - [x] 3.2 Create directory initialization
    - Ensure data/ directory exists on startup
    - Ensure uploads/ directory exists on startup
    - _Requirements: 8.2_

- [x] 4. Implement site content management endpoints
  - [x] 4.1 Create home section endpoints
    - GET /api/home for retrieving home data
    - PUT /api/home for updating home data (authenticated)
    - _Requirements: 2.1, 2.2_

  - [x] 4.2 Create about section endpoints
    - GET /api/about for retrieving about data
    - PUT /api/about for updating about data (authenticated)
    - _Requirements: 2.3, 2.4_

  - [x] 4.3 Create skills section endpoints
    - GET /api/skills for retrieving skills data
    - PUT /api/skills for updating skills data (authenticated)
    - _Requirements: 2.5, 2.6_

- [x] 5. Implement blog management endpoints
  - [x] 5.1 Create blog listing and detail endpoints
    - GET /api/blogs for listing all blogs
    - GET /api/blogs/:id for single blog retrieval
    - Return 404 for non-existent blogs
    - _Requirements: 3.1, 3.2_

  - [x] 5.2 Create blog creation endpoint
    - POST /api/blogs (authenticated)
    - Generate unique UUID for new blog
    - Add ISO 8601 timestamp
    - Prepend to blogs array
    - _Requirements: 3.3_

  - [x] 5.3 Create blog update endpoint
    - PUT /api/blogs/:id (authenticated)
    - Merge updates with existing blog data
    - Return 404 if blog not found
    - _Requirements: 3.4_

  - [x] 5.4 Create blog deletion endpoint
    - DELETE /api/blogs/:id (authenticated)
    - Remove associated image from uploads directory
    - Return 404 if blog not found
    - _Requirements: 3.5, 3.6_

- [x] 6. Implement portfolio management endpoints
  - [x] 6.1 Create portfolio listing and detail endpoints
    - GET /api/portfolio for listing all projects
    - GET /api/portfolio/:id for single project retrieval
    - Return 404 for non-existent projects
    - _Requirements: 4.1, 4.2_

  - [x] 6.2 Create portfolio creation endpoint
    - POST /api/portfolio (authenticated)
    - Generate unique UUID for new project
    - Add ISO 8601 timestamp
    - Prepend to projects array
    - _Requirements: 4.3_

  - [x] 6.3 Create portfolio update endpoint
    - PUT /api/portfolio/:id (authenticated)
    - Merge updates with existing project data
    - Return 404 if project not found
    - _Requirements: 4.4_

  - [x] 6.4 Create portfolio deletion endpoint
    - DELETE /api/portfolio/:id (authenticated)
    - Remove associated image from uploads directory
    - Return 404 if project not found
    - _Requirements: 4.5, 4.6_

- [x] 7. Implement contact message management
  - [x] 7.1 Create contact listing endpoint
    - GET /api/contacts (authenticated)
    - Return all contact messages
    - _Requirements: 5.1_

  - [x] 7.2 Create contact submission endpoint
    - POST /api/contacts (public, no authentication)
    - Generate unique UUID
    - Set read status to false
    - Add ISO 8601 timestamp
    - _Requirements: 5.2, 5.5_

  - [x] 7.3 Create mark-as-read endpoint
    - PUT /api/contacts/:id/read (authenticated)
    - Update read status to true
    - Return 404 if contact not found
    - _Requirements: 5.3_

  - [x] 7.4 Create contact deletion endpoint
    - DELETE /api/contacts/:id (authenticated)
    - Remove contact from array
    - _Requirements: 5.4_

- [x] 8. Implement image upload functionality
  - [x] 8.1 Configure Multer storage
    - Set destination to uploads/ directory
    - Generate unique filename using UUID
    - Preserve original file extension
    - _Requirements: 6.1, 6.5_

  - [x] 8.2 Implement file validation
    - Validate file type (jpeg, jpg, png, gif, webp, svg)
    - Enforce 5MB file size limit
    - Return descriptive errors for invalid uploads
    - _Requirements: 6.2, 6.3_

  - [x] 8.3 Create upload endpoint
    - POST /api/upload (authenticated)
    - Accept single image file
    - Return public URL and filename
    - _Requirements: 6.1, 6.4_

  - [x] 8.4 Serve uploaded images
    - Static file serving for /uploads path
    - _Requirements: 6.6_

- [x] 9. Implement statistics endpoint
  - [x] 9.1 Create stats endpoint
    - GET /api/stats (authenticated)
    - Count blogs from blogs.json
    - Count projects from portfolio.json
    - Count messages from contacts.json
    - Count unread messages
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 10. Configure CORS and security
  - [x] 10.1 Configure CORS middleware
    - Allow frontend origin (http://localhost:5173)
    - Enable credentials
    - _Requirements: 10.1, 10.2_

  - [x] 10.2 Set up security measures
    - Use JWT secret for token signing
    - Validate file uploads
    - Set appropriate HTTP status codes
    - _Requirements: 10.3, 10.4, 10.5_

- [x] 11. Server initialization and startup
  - [x] 11.1 Configure Express app
    - Set up middleware (CORS, JSON parsing, static files)
    - Register all routes
    - _Requirements: 10.1_

  - [x] 11.2 Start server
    - Listen on port 5000
    - Log startup information
    - Display admin credentials
    - _Requirements: 8.2_

## Notes

- All tasks are complete - the backend is fully implemented in `responsive-portfolio-website-Alexa/backend/server.js`
- The server uses file-based JSON storage suitable for a single-admin portfolio site
- Authentication uses hardcoded credentials (admin/admin123) which is acceptable for this use case
- All endpoints follow RESTful conventions
- Error handling is implemented with appropriate HTTP status codes
- Image uploads are validated and stored with unique filenames
- CORS is configured for the React frontend running on port 5173

## Running the Backend

```bash
cd responsive-portfolio-website-Alexa/backend
npm install
npm start
```

The server will start on http://localhost:5000 with the following endpoints available:

**Authentication:**
- POST /api/auth/login
- GET /api/auth/verify

**Site Content:**
- GET/PUT /api/home
- GET/PUT /api/about
- GET/PUT /api/skills

**Blogs:**
- GET /api/blogs
- GET /api/blogs/:id
- POST /api/blogs
- PUT /api/blogs/:id
- DELETE /api/blogs/:id

**Portfolio:**
- GET /api/portfolio
- GET /api/portfolio/:id
- POST /api/portfolio
- PUT /api/portfolio/:id
- DELETE /api/portfolio/:id

**Contacts:**
- GET /api/contacts
- POST /api/contacts
- PUT /api/contacts/:id/read
- DELETE /api/contacts/:id

**Other:**
- POST /api/upload
- GET /api/stats
- GET /uploads/:filename
