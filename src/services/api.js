import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  sendOTP: (data) => api.post('/auth/sendotp', data),
  changePassword: (data) => api.post('/auth/changepassword', data),
  resetPasswordToken: (data) => api.post('/auth/reset-password-token', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// Course APIs
export const courseAPI = {
  getAllCourses: () => api.post('/course/getAllCourses'),
  getCourseDetails: (courseId) => api.post('/course/getCourseDetails', { courseId }),
  createCourse: (data) => api.post('/course/createCourse', data),
  createSection: (data) => api.post('/course/addSection', data),
  updateSection: (data) => api.post('/course/updateSection', data),
  deleteSection: (data) => api.post('/course/deleteSection', data),
  createSubSection: (data) => api.post('/course/createSubSection', data),
  createCategory: (data) => api.post('/course/createCategoy', data),
  showAllCategory: () => api.post('/course/showAllCategory'),
  categoryPageDetails: (data) => api.post('/course/categoryPageDetails', data),
  createRating: (data) => api.post('/course/createRating', data),
  getAllRating: (courseId) => api.post('/course/getAllRating', { courseId }),
  averageRating: (courseId) => api.post('/course/averageRating', { courseId }),
};

// Profile APIs
export const profileAPI = {
  updateProfile: (data) => api.put('/profile/updateProfile', data),
  deleteProfile: () => api.delete('/profile/deleteProfile'),
};

// Payment APIs
export const paymentAPI = {
  capturePayments: (data) => api.post('/payment/capturePayments', data),
  verifySignature: (data) => api.post('/payment/verifySignature', data),
};

export default api; 