/**
 * PLACAMATE API Client
 * Connects React frontend with Spring Boot backend (/api) using session cookies
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Needed for JSESSIONID cookie
  });

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    // Session expired or unauthenticated
    const error = new Error('Authentication required');
    error.status = 401;
    throw error;
  }

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.statusText}`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errData.error || errorMsg;
    } catch {
      // fallback
    }
    const err = new Error(errorMsg);
    err.status = response.status;
    throw err;
  }

  // Handle empty or 204 responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const api = {
  // Authentication
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: () => request('/auth/me'),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  // Student Endpoints
  getStudentProfile: () => request('/students/me'),

  updateStudentProfile: (profileData) =>
    request('/students/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/students/me/resume', {
      method: 'POST',
      body: formData,
    });
  },

  getResumeUrl: (studentId) =>
    studentId ? `${API_BASE}/students/${studentId}/resume` : `${API_BASE}/students/me/resume`,

  // Jobs & Applications (Student)
  getJobs: () => request('/jobs'),

  getJobById: (id) => request(`/jobs/${id}`),

  checkEligibility: (jobId) => request(`/jobs/${jobId}/eligibility`),

  getMyApplications: () => request('/applications/me'),

  applyForJob: (jobId) =>
    request('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    }),

  getStudentInterviews: () => request('/interviews/student'),

  // Recruiter Endpoints
  getRecruiterDashboard: () => request('/recruiter/dashboard'),

  getRecruiterJobs: () => request('/recruiter/jobs'),

  getJobApplicants: (jobId) => request(`/recruiter/jobs/${jobId}/applicants`),

  getAllApplicants: () => request('/recruiter/applicants'),

  getRecruiterCompany: () => request('/recruiter/company'),

  updateRecruiterCompany: (data) =>
    request('/recruiter/company', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  createJob: (jobData) =>
    request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    }),

  updateJob: (id, jobData) =>
    request(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    }),

  closeJob: (id) =>
    request(`/jobs/${id}/close`, {
      method: 'PATCH',
    }),

  updateApplicationStatus: (applicationId, status, notes) =>
    request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),

  scheduleInterview: (interviewData) =>
    request('/interviews', {
      method: 'POST',
      body: JSON.stringify(interviewData),
    }),

  // Placement Officer (Admin) Endpoints
  getAdminDashboard: () => request('/admin/dashboard'),

  getAdminStudents: () => request('/admin/students'),

  getAdminCompanies: () => request('/admin/companies'),

  createCompany: (companyData) =>
    request('/admin/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    }),

  getAdminJobs: () => request('/admin/jobs'),

  getAdminApplications: () => request('/admin/applications'),

  getAdminAnalytics: () => request('/admin/analytics'),

  // Notifications
  getNotifications: () => request('/notifications'),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllNotificationsRead: () =>
    request('/notifications/read-all', {
      method: 'PATCH',
    }),
};
