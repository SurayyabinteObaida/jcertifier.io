import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const certificatesAPI = {
  generate: (eventId, data) => api.post(`/api/issuer/events/${eventId}/generate`, data),
  regenerate: (eventId, data) => api.post(`/api/issuer/events/${eventId}/regenerate`, data),
  list: (eventId) => api.get(`/api/issuer/events/${eventId}/certificates`),
};

export const authAPI = {
  register: (email, password, organization_name) =>
    api.post('/api/auth/register', { email, password, organization_name }),
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
};

export const eventsAPI = {
  create: (data) => api.post('/api/issuer/events', data),
  list: () => api.get('/api/issuer/events'),
  get: (id) => api.get(`/api/issuer/events/${id}`),
};

export const participantsAPI = {
  upload: (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/issuer/events/${eventId}/participants/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  list: (eventId) => api.get(`/api/issuer/events/${eventId}/participants`),
};


export const templatesAPI = {
  list: () => api.get('/api/issuer/templates'),
};

export const verificationAPI = {
  verify: (token) => api.get(`/api/verify/${token}`),
};

export const API_BASE = API_URL;
