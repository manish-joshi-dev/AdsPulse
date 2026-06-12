import axios from 'axios';

const unwrap = (response) => response.data?.data ?? response.data;

export const api = axios.create({
  baseURL: '/api',
  timeout: 90000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adspulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.code = error.response?.data?.error?.code;
    normalizedError.details = error.response?.data?.error?.details;
    normalizedError.response = error.response;

    return Promise.reject(normalizedError);
  }
);

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

export const upload = {
  uploadCSV: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload/csv', formData, {
      onUploadProgress: (progressEvent) => {
        if (!onProgress) return;

        if (!progressEvent.total) {
          onProgress(0);
          return;
        }

        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    }).then(unwrap);
  }
};

export const analysis = {
  getStatus: (jobId) =>
    api.get(`/analysis/status/${jobId}`).then(unwrap),

  getResults: (jobId) =>
    api.get(`/analysis/results/${jobId}`).then((response) => {
      const payload = unwrap(response);
      return payload.analysisJob || payload;
    }),

  getHistory: () =>
    api.get('/analysis/history').then((response) => unwrap(response).analyses || []),

  deleteAnalysis: (jobId) =>
    api.delete(`/analysis/${jobId}`).then(unwrap)
};

export const reports = {
  generate: (jobId, title) =>
    api.post('/reports/generate', { jobId, title }).then((response) => unwrap(response).report),

  get: (reportId) =>
    api.get(`/reports/${reportId}`).then((response) => unwrap(response).report),

  share: (reportId) =>
    api.post(`/reports/${reportId}/share`).then(unwrap)
};

api.auth = auth;
api.upload = upload;
api.analysis = analysis;
api.reports = reports;

export default api;
