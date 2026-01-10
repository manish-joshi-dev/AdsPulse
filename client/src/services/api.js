import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  timeout: 90000
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adspulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle errors and auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adspulse_token');
      window.location.href = '/login';
    }
    
    const message =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      'Request failed';
    
    return Promise.reject(new Error(message));
  }
);

// Auth endpoints
export const auth = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  getMe: () =>
    api.get('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout')
};

// Upload endpoints
export const upload = {
  uploadCSV: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
  }
};

// Analysis endpoints
export const analysis = {
  getStatus: (jobId) =>
    api.get(`/analysis/status/${jobId}`),
  
  getResults: (jobId) =>
    api.get(`/analysis/results/${jobId}`),
  
  getHistory: () =>
    api.get('/analysis/history'),
  
  deleteAnalysis: (jobId) =>
    api.delete(`/analysis/${jobId}`)
};

// Reports endpoints
export const reports = {
  generate: (jobId, title) =>
    api.post('/reports/generate', { jobId, title }),
  
  get: (reportId) =>
    api.get(`/reports/${reportId}`),
  
  share: (reportId) =>
    api.post(`/reports/${reportId}/share`)
};

export default api;

