// API base URL
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get full image URL
export const getImageUrl = (imagePath: string | null | undefined) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // If it starts with /uploads, prefix with backend base URL (without /api)
  if (imagePath.startsWith('/uploads')) {
    const baseUrl = API_BASE_URL.replace('/api', '').replace('https://nickz-construction-one.vercel.app/api', 'https://nickz-construction-one.vercel.app');
    return baseUrl + imagePath;
  }
  // Otherwise, assume it's a relative path
  const baseUrl = API_BASE_URL.replace('/api', '').replace('https://nickz-construction-one.vercel.app/api', 'https://nickz-construction-one.vercel.app');
  return baseUrl + '/' + imagePath;
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    console.error('Failed URL:', url);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiRequest('/auth/profile'),
  
  createAdmin: (adminData) => apiRequest('/auth/create', {
    method: 'POST',
    body: JSON.stringify(adminData),
  }),
};

// Services API
export const servicesAPI = {
  getAll: () => apiRequest('/services'),
  
  getBySlug: (slug) => apiRequest(`/services/${slug}`),
  
  getAllAdmin: () => apiRequest('/services/admin/all'),
  
  create: (formData) => {
    const token = localStorage.getItem('authToken');
    return fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  
  update: (id, formData) => {
    const token = localStorage.getItem('authToken');
    return fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  
  delete: (id) => apiRequest(`/services/${id}`, {
    method: 'DELETE',
  }),
};

// Projects API
export const projectsAPI = {
  getAll: (category) => {
    const query = category && category !== 'All' ? `?category=${category}` : '';
    return apiRequest(`/projects${query}`);
  },
  
  getBySlug: (slug) => apiRequest(`/projects/${slug}`),
  
  getAllAdmin: () => apiRequest('/projects/admin/all'),
  
  create: (formData) => {
    const token = localStorage.getItem('authToken');
    return fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  
  update: (id, formData) => {
    const token = localStorage.getItem('authToken');
    return fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
  
  delete: (id) => apiRequest(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => apiRequest('/reviews'),
  
  getAllAdmin: () => apiRequest('/reviews/admin/all'),
  
  getAllPending: () => apiRequest('/reviews/admin/pending'),
  
  getAllApproved: () => apiRequest('/reviews/admin/approved'),
  
  create: (reviewData) => apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  update: (id, reviewData) => apiRequest(`/reviews/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  }),
  
  approve: (id) => apiRequest(`/reviews/${id}/approve`, {
    method: 'PATCH',
  }),
  
  reject: (id) => apiRequest(`/reviews/${id}/reject`, {
    method: 'PATCH',
  }),
  
  delete: (id) => apiRequest(`/reviews/${id}`, {
    method: 'DELETE',
  }),
  
  toggleApproval: (id) => apiRequest(`/reviews/${id}/approve`, {
    method: 'PATCH',
  }),
};

// Contacts API
export const contactsAPI = {
  create: (contactData) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contactData),
  }),
  
  getAllAdmin: () => apiRequest('/contacts/admin/all'),
  
  update: (id, contactData) => apiRequest(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contactData),
  }),
  
  delete: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),
  
  markAsRead: (id) => apiRequest(`/contacts/${id}/read`, {
    method: 'PATCH',
  }),
};

// Quote Requests API
export const quotesAPI = {
  create: (quoteData) => apiRequest('/quotes', {
    method: 'POST',
    body: JSON.stringify(quoteData),
  }),
  
  getAllAdmin: () => apiRequest('/quotes/admin/all'),
  
  update: (id, quoteData) => apiRequest(`/quotes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(quoteData),
  }),
  
  delete: (id) => apiRequest(`/quotes/${id}`, {
    method: 'DELETE',
  }),
  
  markAsRead: (id) => apiRequest(`/quotes/${id}/read`, {
    method: 'PATCH',
  }),
};

// Settings API
export const settingsAPI = {
  getAll: () => apiRequest('/settings'),
  
  get: (key) => apiRequest(`/settings/${key}`),
  
  set: (key, value) => apiRequest(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  }),
  
  delete: (key) => apiRequest(`/settings/${key}`, {
    method: 'DELETE',
  }),
};

// Team API
export const teamAPI = {
  getAll: () => apiRequest('/team'),
  
  getAllAdmin: () => apiRequest('/team/admin/all'),
  
  create: (teamData) => {
    const formData = new FormData();
    formData.append('name', teamData.name);
    formData.append('role', teamData.role);
    formData.append('bio', teamData.bio || '');
    formData.append('sort_order', teamData.sort_order?.toString() || '0');
    
    if (teamData.imageFile) {
      formData.append('image', teamData.imageFile);
    }
    
    return apiRequest('/team', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  
  update: (id, teamData) => {
    const formData = new FormData();
    formData.append('name', teamData.name);
    formData.append('role', teamData.role);
    formData.append('bio', teamData.bio || '');
    formData.append('sort_order', teamData.sort_order?.toString() || '0');
    
    if (teamData.imageFile) {
      formData.append('image', teamData.imageFile);
    }
    
    return apiRequest(`/team/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  
  delete: (id) => apiRequest(`/team/${id}`, {
    method: 'DELETE',
  }),
};
