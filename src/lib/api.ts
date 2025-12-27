import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (identifier: string, password: string) =>
    api.post('/auth/login', { identifier, password }),
  
  register: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
  
  refresh: () => api.post('/auth/refresh'),
};

// User API
export const userAPI = {
  createRequest: (data: { destination: string; message?: string }) =>
    api.post('/user/requests', data),
  
  getRequests: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/user/requests', { params }),
  
  getRequestById: (id: number) =>
    api.get(`/user/requests/${id}`),
  
  cancelRequest: (id: number) =>
    api.patch(`/user/requests/${id}/cancel`),
  
  getStats: () =>
    api.get('/user/requests/stats'),
};

// Tour Guide API
export const tourGuideAPI = {
  getRequests: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/tour-guide/requests', { params }),
  
  getRequestById: (id: number) =>
    api.get(`/tour-guide/requests/${id}`),
  
  updateStatus: (id: number, data: { status: string; note?: string }) =>
    api.post(`/tour-guide/requests/${id}/status`, data),
  
  getStats: () =>
    api.get('/tour-guide/requests/stats'),
  
  getActivity: (id: number) =>
    api.get(`/tour-guide/requests/${id}/activity`),
};

// Admin API
export const adminAPI = {
  registerTourGuide: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post('/admin/register/tour-guide', data),
  
  getTourGuides: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/tour-guides', { params }),
  
  getTourGuideById: (id: number) =>
    api.get(`/admin/tour-guides/${id}`),
  
  toggleTourGuideActive: (id: number) =>
    api.patch(`/admin/tour-guides/${id}/toggle-active`),
  
  getRequests: (params?: { page?: number; limit?: number; status?: string; destination?: string }) =>
    api.get('/admin/requests', { params }),
  
  getRequestById: (id: number) =>
    api.get(`/admin/requests/${id}`),
  
  assignRequest: (id: number, tourGuideId: number) =>
    api.post(`/admin/requests/${id}/assign`, { tourGuideId }),
  
  reassignRequest: (id: number, tourGuideId: number) =>
    api.post(`/admin/requests/${id}/reassign`, { tourGuideId }),
  
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats'),

  // Tour Packages
  getAllPackages: (params?: { active?: string; featured?: string }) =>
    api.get('/packages', { params }),
  
  getPackageById: (id: number) =>
    api.get(`/packages/${id}`),
  
  createPackage: (data: any) =>
    api.post('/packages', data),
  
  updatePackage: (id: number, data: any) =>
    api.put(`/packages/${id}`, data),
  
  deletePackage: (id: number) =>
    api.delete(`/packages/${id}`),
  
  togglePackageFeatured: (id: number) =>
    api.patch(`/packages/${id}/toggle-featured`),
};

// Package API
export const packageAPI = {
  getAll: (params?: { featured?: boolean; destination?: string }) =>
    api.get('/packages', { params }),
  
  getBySlug: (slug: string) =>
    api.get(`/packages/${slug}`),
};