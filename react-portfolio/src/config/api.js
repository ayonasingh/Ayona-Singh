// API Configuration
// In production (same Vercel domain), /api is a relative path that works automatically.
// In local dev, falls back to localhost:5000/api
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

export default BASE_URL;
