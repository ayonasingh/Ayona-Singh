// API Configuration
// Set VITE_API_BASE_URL in Vercel dashboard → Environment Variables
// e.g. https://ayona-portfolio-backend.vercel.app/api
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default BASE_URL;
