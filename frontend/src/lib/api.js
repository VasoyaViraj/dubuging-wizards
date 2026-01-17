import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle auth errors
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

// Auth API
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

// Citizen API
export const citizenAPI = {
    getDepartments: () => api.get('/citizen/departments'),
    getDepartment: (id) => api.get(`/citizen/departments/${id}`),
    getDepartmentServices: (id) => api.get(`/citizen/departments/${id}/services`),
    getService: (id) => api.get(`/citizen/services/${id}`),
    submitRequest: (data) => api.post('/citizen/requests', data),
    getRequests: (params) => api.get('/citizen/requests', { params }),
    getRequest: (id) => api.get(`/citizen/requests/${id}`),
    getRecentAppointments: () => api.get('/citizen/recent-appointments'),
};

// Admin API
export const adminAPI = {
    // Departments
    getDepartments: () => api.get('/admin/departments'),
    createDepartment: (data) => api.post('/admin/departments', data),
    updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
    enableDepartment: (id) => api.patch(`/admin/departments/${id}/enable`),
    disableDepartment: (id) => api.patch(`/admin/departments/${id}/disable`),
    deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),

    // Services
    getServices: () => api.get('/admin/services'),
    createService: (data) => api.post('/admin/services', data),
    updateService: (id, data) => api.put(`/admin/services/${id}`, data),
    enableService: (id) => api.patch(`/admin/services/${id}/enable`),
    disableService: (id) => api.patch(`/admin/services/${id}/disable`),
    deleteService: (id) => api.delete(`/admin/services/${id}`),

    // Users
    getUsers: (params) => api.get('/admin/users', { params }),
    createUser: (data) => api.post('/admin/users', data),
    toggleUser: (id) => api.patch(`/admin/users/${id}/toggle`),

    // Stats
    getStats: () => api.get('/admin/stats'),
};

// Officer API
export const officerAPI = {
    getRequests: (params) => api.get('/officer/requests', { params }),
    getRequest: (id) => api.get(`/officer/requests/${id}`),
    acceptRequest: (id, data) => api.patch(`/officer/requests/${id}/accept`, data),
    rejectRequest: (id, data) => api.patch(`/officer/requests/${id}/reject`, data),
    getStats: () => api.get('/officer/stats'),
};

export default api;
