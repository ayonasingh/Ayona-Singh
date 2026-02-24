import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const verifyToken = () => api.get('/auth/verify');

// Upload
export const uploadImage = (formData) =>
    api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Stats
export const getStats = () => api.get('/stats');

// Home
export const getHome = () => api.get('/home');
export const updateHome = (data) => api.put('/home', data);

// About
export const getAbout = () => api.get('/about');
export const updateAbout = (data) => api.put('/about', data);

// Qualification
export const getQualification = () => api.get('/qualification');
export const updateQualification = (data) => api.put('/qualification', data);

// Skills
export const getSkills = () => api.get('/skills');
export const updateSkills = (data) => api.put('/skills', data);

// Blogs
export const getBlogs = () => api.get('/blogs');
export const getBlog = (id) => api.get(`/blogs/${id}`);
export const createBlog = (data) => api.post('/blogs', data);
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// Portfolio
export const getPortfolio = () => api.get('/portfolio');
export const getProject = (id) => api.get(`/portfolio/${id}`);
export const createProject = (data) => api.post('/portfolio', data);
export const updateProject = (id, data) => api.put(`/portfolio/${id}`, data);
export const deleteProject = (id) => api.delete(`/portfolio/${id}`);

// Contacts
export const getContacts = () => api.get('/contacts');
export const markContactRead = (id) => api.put(`/contacts/${id}/read`);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
export const sendContact = (data) => api.post('/contacts', data);

// Contact Info (email, phone, social links)
export const getContactInfo = () => api.get('/contact-info');
export const updateContactInfo = (data) => api.put('/contact-info', data);

// Books
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

export default api;
