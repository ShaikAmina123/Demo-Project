import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // Uses Vite proxy in dev → avoids CORS issues
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('gn_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('gn_token');
      localStorage.removeItem('gn_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const auth = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  changePassword: (data) => api.put('/auth/password', data)
};

export const dashboard = {
  get: () => api.get('/dashboard')
};

export const assets = {
  list: (params) => api.get('/assets', { params }),
  stats: () => api.get('/assets/stats'),
  get: (id) => api.get(`/assets/${id}`),
  create: (data) => api.post('/assets', data),
  update: (id, data) => api.put(`/assets/${id}`, data),
  delete: (id) => api.delete(`/assets/${id}`)
};

export const users = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

export const workOrders = {
  list: (params) => api.get('/work-orders', { params }),
  get: (id) => api.get(`/work-orders/${id}`),
  create: (data) => api.post('/work-orders', data),
  update: (id, data) => api.put(`/work-orders/${id}`, data),
  delete: (id) => api.delete(`/work-orders/${id}`)
};

export const checkouts = {
  list: (params) => api.get('/checkouts', { params }),
  create: (data) => api.post('/checkouts', data),
  checkin: (id, data) => api.post(`/checkouts/${id}/checkin`, data)
};

export const licenses = {
  list: () => api.get('/licenses'),
  get: (id) => api.get(`/licenses/${id}`),
  create: (data) => api.post('/licenses', data),
  update: (id, data) => api.put(`/licenses/${id}`, data),
  delete: (id) => api.delete(`/licenses/${id}`)
};

export const audits = {
  list: () => api.get('/audits'),
  get: (id) => api.get(`/audits/${id}`),
  create: (data) => api.post('/audits', data),
  update: (id, data) => api.put(`/audits/${id}`, data),
  delete: (id) => api.delete(`/audits/${id}`)
};

export const assetGroups = {
  list: () => api.get('/asset-groups'),
  get: (id) => api.get(`/asset-groups/${id}`),
  create: (data) => api.post('/asset-groups', data),
  update: (id, data) => api.put(`/asset-groups/${id}`, data),
  delete: (id) => api.delete(`/asset-groups/${id}`)
};

export default api;
