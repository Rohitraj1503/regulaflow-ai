import axios from 'axios';

const API_BASE = '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('regulaflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle unauthorized / token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('regulaflow_token');
        localStorage.removeItem('regulaflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getCurrentUser: () => apiClient.get('/auth/me'),

  // Dashboard
  getDashboardMetrics: () => apiClient.get('/dashboard/metrics'),

  // Applications
  getApplications: (params) => apiClient.get('/applications', { params }),
  getApplicationById: (id) => apiClient.get(`/applications/${id}`),
  createApplication: (data) => apiClient.post('/applications', data),
  submitApplication: (id) => apiClient.post(`/applications/${id}/submit`),
  transitionWorkflow: (id, data) => apiClient.post(`/applications/${id}/transition`, data),
  getEligibleOfficers: () => apiClient.get('/applications/officers'),
  assignOfficer: (id, officerId) => apiClient.post(`/applications/${id}/assign`, { officerId }),
  getApplicationHistory: (id) => apiClient.get(`/applications/${id}/history`),
  getApplicationDeficiencies: (id) => apiClient.get(`/applications/${id}/deficiencies`),
  getApplicationDocuments: (id) => apiClient.get(`/applications/${id}/documents`),
  verifyDocument: (appId, docId, data) => apiClient.post(`/applications/${appId}/documents/${docId}/verify`, data),
  respondToDeficiency: (deficiencyId, data) => apiClient.post(`/applications/deficiencies/${deficiencyId}/respond`, data),
  uploadDocument: (id, params) => apiClient.post(`/applications/${id}/documents`, null, { params }),
  uploadApplicationFile: (appId, formData) => apiClient.post(`/applications/${appId}/documents/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDocumentDownloadUrl: (appId, docId) => `${API_BASE}/applications/${appId}/documents/${docId}/download`,

  // EVC
  getEvcSchedules: () => apiClient.get('/evc'),
  getEvcById: (id) => apiClient.get(`/evc/${id}`),
  scheduleEvc: (data) => apiClient.post('/evc', data),
  submitEvcReport: (id, data) => apiClient.post(`/evc/${id}/report`, data),

  // Compliance
  getObligations: (institutionId) => apiClient.get('/compliance/obligations', { params: { institutionId } }),
  submitEvidence: (data) => apiClient.post('/compliance/evidence', data),
  verifyEvidence: (evidenceId, data) => apiClient.post(`/compliance/evidence/${evidenceId}/verify`, data),

  // Notifications
  getNotifications: (unreadOnly = false) => apiClient.get('/notifications', { params: { unreadOnly } }),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markNotificationAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllNotificationsAsRead: () => apiClient.patch('/notifications/read-all'),

  // Regulatory & AI
  getRegulations: () => apiClient.get('/regulatory/documents'),
  getClauses: (docId) => apiClient.get(`/regulatory/documents/${docId}/clauses`),
  getKnowledgeGraph: () => apiClient.get('/regulatory/knowledge-graph'),
  analyzeImpact: (data) => apiClient.post('/regulatory/impact-analysis', data),
  queryCopilot: (data) => apiClient.post('/ai/query', data),

  // Audit
  getAuditEvents: (params) => apiClient.get('/audit', { params }),
  getAuditCsvExportUrl: () => `${API_BASE}/audit/export`,

  // Institutions
  getInstitutions: () => apiClient.get('/institutions'),

  // System Administration
  getAdminOverview: () => apiClient.get('/admin/overview'),
  getAdminUsers: () => apiClient.get('/admin/users'),
  createAdminUser: (data, password) => apiClient.post('/admin/users', data, { params: { password } }),
  toggleUserActive: (userId) => apiClient.patch(`/admin/users/${userId}/toggle-active`),
  updateUserRole: (userId, role) => apiClient.patch(`/admin/users/${userId}/role`, { role }),
  resetUserPassword: (userId, newPassword) => apiClient.post(`/admin/users/${userId}/reset-password`, newPassword ? { newPassword } : {}),
  getAdminInstitutions: () => apiClient.get('/admin/institutions'),
  updateInstitutionStatus: (id, status) => apiClient.patch(`/admin/institutions/${id}/status`, { status }),
  getAdminSettings: () => apiClient.get('/admin/settings'),
  updateAdminSettings: (settings) => apiClient.put('/admin/settings', settings),
  previewInstitutionCsv: (formData) => apiClient.post('/admin/institutions/import/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  confirmInstitutionImport: (formData, updateExisting = false) => apiClient.post('/admin/institutions/import/confirm', formData, {
    params: { updateExisting },
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getInstitutionImportHistory: () => apiClient.get('/admin/institutions/import/history'),
};

export default apiClient;
