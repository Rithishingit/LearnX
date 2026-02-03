import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Flag to suppress auth errors during initial check
let suppressAuthErrors = false;
export const setSuppressAuthErrors = (value) => { suppressAuthErrors = value; };

// Add response interceptor to handle errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        
        // Don't show toast for 401 errors (auth issues are handled by redirecting)
        if (status === 401) {
            localStorage.removeItem('user');
            // Silently reject - components will handle redirect
            return Promise.reject(error);
        }
        
        // For other errors, show toast if it's a user-facing error
        if (status >= 400 && status < 500 && message && !suppressAuthErrors) {
            // Don't toast for common expected errors
            const skipMessages = ['Not enrolled', 'not found'];
            if (!skipMessages.some(m => message.toLowerCase().includes(m.toLowerCase()))) {
                // Don't auto-toast here - let components decide
            }
        }
        
        return Promise.reject(error);
    }
);

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const logout = () => API.get('/auth/logout');
export const getMe = () => API.get('/auth/me');

export const getCourses = () => API.get('/courses');
export const getCourse = (id) => API.get(`/courses/${id}`);
export const createCourse = (data) => API.post('/courses', data);
export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);
export const enrollCourse = (courseId) => API.post(`/enrollments`, { courseId });
export const checkEnrollment = (courseId) => API.get(`/enrollments/${courseId}`);
export const getMyEnrollments = () => API.get('/enrollments');

export default API;
