# Requirements Document

## Introduction

This document specifies the requirements for a complete admin panel backend system for a portfolio website. The backend provides RESTful API endpoints for managing site content, blogs, portfolio projects, contact messages, and user authentication. The system uses JSON file storage and includes image upload capabilities.

## Glossary

- **Backend_API**: The Express.js server that handles HTTP requests and manages data
- **Admin_User**: An authenticated user with permissions to modify site content
- **JWT_Token**: JSON Web Token used for authentication and authorization
- **Site_Content**: Home, About, and Skills sections data stored in siteContent.json
- **Blog_Post**: An article entry with title, content, tags, and metadata
- **Portfolio_Project**: A project showcase entry with description and images
- **Contact_Message**: A message submitted through the contact form
- **Image_Upload**: File upload functionality for images with validation
- **JSON_Storage**: File-based data persistence using JSON files

## Requirements

### Requirement 1: User Authentication

**User Story:** As an admin user, I want to securely log in to the admin panel, so that I can manage site content without unauthorized access.

#### Acceptance Criteria

1. WHEN an admin provides valid credentials, THE Backend_API SHALL generate a JWT_Token with 24-hour expiration
2. WHEN an admin provides invalid credentials, THE Backend_API SHALL return a 401 error with descriptive message
3. WHEN a JWT_Token is provided in the Authorization header, THE Backend_API SHALL verify its validity
4. WHEN a JWT_Token is expired or invalid, THE Backend_API SHALL return a 401 error
5. THE Backend_API SHALL protect all write operations (POST, PUT, DELETE) with authentication middleware

### Requirement 2: Site Content Management

**User Story:** As an admin user, I want to update home, about, and skills sections, so that I can keep the portfolio content current.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/home, THE Backend_API SHALL return the home section data
2. WHEN an authenticated PUT request is made to /api/home, THE Backend_API SHALL update the home section and persist changes
3. WHEN a GET request is made to /api/about, THE Backend_API SHALL return the about section data
4. WHEN an authenticated PUT request is made to /api/about, THE Backend_API SHALL update the about section and persist changes
5. WHEN a GET request is made to /api/skills, THE Backend_API SHALL return both mathCore and tools skill arrays
6. WHEN an authenticated PUT request is made to /api/skills, THE Backend_API SHALL update the skills section and persist changes

### Requirement 3: Blog Management

**User Story:** As an admin user, I want to create, read, update, and delete blog posts, so that I can maintain fresh content on the portfolio.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/blogs, THE Backend_API SHALL return all blog posts ordered by creation date
2. WHEN a GET request is made to /api/blogs/:id, THE Backend_API SHALL return the specific blog post or 404 if not found
3. WHEN an authenticated POST request is made to /api/blogs, THE Backend_API SHALL create a new blog with unique ID and timestamp
4. WHEN an authenticated PUT request is made to /api/blogs/:id, THE Backend_API SHALL update the blog post or return 404 if not found
5. WHEN an authenticated DELETE request is made to /api/blogs/:id, THE Backend_API SHALL delete the blog and associated uploaded image
6. WHEN a blog is deleted, THE Backend_API SHALL remove the image file from uploads directory if it exists

### Requirement 4: Portfolio Management

**User Story:** As an admin user, I want to manage portfolio projects, so that I can showcase my work effectively.

#### Acceptance Criteria

1. WHEN a GET request is made to /api/portfolio, THE Backend_API SHALL return all portfolio projects ordered by creation date
2. WHEN a GET request is made to /api/portfolio/:id, THE Backend_API SHALL return the specific project or 404 if not found
3. WHEN an authenticated POST request is made to /api/portfolio, THE Backend_API SHALL create a new project with unique ID and timestamp
4. WHEN an authenticated PUT request is made to /api/portfolio/:id, THE Backend_API SHALL update the project or return 404 if not found
5. WHEN an authenticated DELETE request is made to /api/portfolio/:id, THE Backend_API SHALL delete the project and associated uploaded image
6. WHEN a project is deleted, THE Backend_API SHALL remove the image file from uploads directory if it exists

### Requirement 5: Contact Message Management

**User Story:** As an admin user, I want to view and manage contact messages, so that I can respond to inquiries and track communications.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to /api/contacts, THE Backend_API SHALL return all contact messages ordered by creation date
2. WHEN a POST request is made to /api/contacts, THE Backend_API SHALL create a new contact message with unique ID, timestamp, and read status set to false
3. WHEN an authenticated PUT request is made to /api/contacts/:id/read, THE Backend_API SHALL mark the message as read
4. WHEN an authenticated DELETE request is made to /api/contacts/:id, THE Backend_API SHALL delete the contact message
5. THE Backend_API SHALL allow unauthenticated POST requests to /api/contacts for public contact form submissions

### Requirement 6: Image Upload Management

**User Story:** As an admin user, I want to upload images for blogs and portfolio projects, so that I can include visual content.

#### Acceptance Criteria

1. WHEN an authenticated POST request with an image file is made to /api/upload, THE Backend_API SHALL save the image with a unique filename
2. WHEN an image is uploaded, THE Backend_API SHALL validate the file type against allowed formats (jpeg, jpg, png, gif, webp, svg)
3. WHEN an image exceeds 5MB, THE Backend_API SHALL reject the upload with an error message
4. WHEN an image upload succeeds, THE Backend_API SHALL return the public URL and filename
5. THE Backend_API SHALL store uploaded images in the uploads directory
6. THE Backend_API SHALL serve uploaded images via /uploads/:filename endpoint

### Requirement 7: Dashboard Statistics

**User Story:** As an admin user, I want to see dashboard statistics, so that I can quickly understand the site's content status.

#### Acceptance Criteria

1. WHEN an authenticated GET request is made to /api/stats, THE Backend_API SHALL return total counts for blogs, projects, and messages
2. WHEN calculating statistics, THE Backend_API SHALL include the count of unread messages
3. THE Backend_API SHALL read from all relevant JSON files to compute accurate statistics

### Requirement 8: Data Persistence

**User Story:** As a system administrator, I want all data changes to persist to disk, so that content is not lost on server restart.

#### Acceptance Criteria

1. WHEN any content is created or updated, THE Backend_API SHALL write changes to the appropriate JSON file immediately
2. WHEN the server starts, THE Backend_API SHALL create data and uploads directories if they do not exist
3. WHEN reading data from a non-existent JSON file, THE Backend_API SHALL return an empty array or object
4. THE Backend_API SHALL store site content in siteContent.json with home, about, and skills sections
5. THE Backend_API SHALL store blogs in blogs.json as an array
6. THE Backend_API SHALL store portfolio projects in portfolio.json as an array
7. THE Backend_API SHALL store contact messages in contacts.json as an array

### Requirement 9: Error Handling

**User Story:** As a developer, I want comprehensive error handling, so that the API provides clear feedback when operations fail.

#### Acceptance Criteria

1. WHEN a resource is not found, THE Backend_API SHALL return a 404 status with a descriptive error message
2. WHEN authentication fails, THE Backend_API SHALL return a 401 status with a descriptive error message
3. WHEN file upload validation fails, THE Backend_API SHALL return a 400 status with a descriptive error message
4. WHEN a server error occurs, THE Backend_API SHALL return a 500 status with an error message
5. THE Backend_API SHALL validate request bodies and return 400 for invalid data

### Requirement 10: CORS and Security

**User Story:** As a system administrator, I want proper CORS configuration and security measures, so that the API is accessible to the frontend while remaining secure.

#### Acceptance Criteria

1. THE Backend_API SHALL enable CORS for the frontend origin (http://localhost:5173)
2. THE Backend_API SHALL enable credentials in CORS configuration
3. THE Backend_API SHALL use JWT tokens with a secure secret for authentication
4. THE Backend_API SHALL set appropriate HTTP status codes for all responses
5. THE Backend_API SHALL validate file uploads to prevent malicious file types
