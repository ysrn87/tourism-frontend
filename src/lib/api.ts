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

// Agent API
export const agentAPI = {
  getRequests: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/agent/requests', { params }),
  
  getRequestById: (id: number) =>
    api.get(`/agent/requests/${id}`),
  
  updateStatus: (id: number, data: { status: string; note?: string }) =>
    api.post(`/agent/requests/${id}/status`, data),
  
  getStats: () =>
    api.get('/agent/requests/stats'),
  
  getActivity: (id: number) =>
    api.get(`/agent/requests/${id}/activity`),
};

// Admin API
export const adminAPI = {
  registerAgent: (data: { name: string; email: string; phone: string; password: string }) =>
    api.post('/admin/register/agent', data),
  
  getAgents: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/agents', { params }),
  
  getAgentById: (id: number) =>
    api.get(`/admin/agents/${id}`),
  
  toggleAgentActive: (id: number) =>
    api.patch(`/admin/agents/${id}/toggle-active`),
  
  getRequests: (params?: { page?: number; limit?: number; status?: string; destination?: string }) =>
    api.get('/admin/requests', { params }),
  
  getRequestById: (id: number) =>
    api.get(`/admin/requests/${id}`),
  
  assignRequest: (id: number, agentId: number) =>
    api.post(`/admin/requests/${id}/assign`, { agentId }),
  
  reassignRequest: (id: number, agentId: number) =>
    api.post(`/admin/requests/${id}/reassign`, { agentId }),
  
  getDashboardStats: () =>
    api.get('/admin/dashboard/stats'),
};