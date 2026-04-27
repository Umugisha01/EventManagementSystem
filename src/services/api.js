import axios from 'axios';

const API_BASE_URL = 'https://rweh.runasp.net/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const savedUser = localStorage.getItem('hub_user');
    if (savedUser) {
      const { token } = JSON.parse(savedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle standard API format
api.interceptors.response.use(
  (response) => {
    // If the backend returns the standardized { success, data, message } format
    if (response.data && response.data.hasOwnProperty('success')) {
      if (response.data.success) {
        return response.data.data; // Return just the data part
      } else {
        return Promise.reject(response.data.message || 'API Error');
      }
    }
    return response.data;
  },
  (error) => {
    let message = 'Network Error';
    if (error.response?.data) {
      const data = error.response.data;
      message = data.message || error.message;
      
      // If there are specific validation errors, include the first one for clarity
      if (data.errors && data.errors.length > 0) {
        message = `${data.message}: ${data.errors[0]}`;
      }
    }
    return Promise.reject(message);
  }
);

export default api;

export const authApi = {
  login: (username, password) => api.post('/Auth/login', { identifier: username, password }),
  register: (userData) => api.post('/Auth/register', userData),
};

export const eventsApi = {
  getEvents: () => api.get('/Events'),
  getEvent: (id) => api.get(`/Events/${id}`),
  createEvent: (eventData) => api.post('/Events', eventData),
  updateEvent: (id, eventData) => api.put(`/Events/${id}`, eventData),
  publishEvent: (id) => api.post(`/Events/${id}/publish`),
  deleteEvent: (id) => api.delete(`/Events/${id}`),
};

export const bookingsApi = {
  createBooking: (bookingData) => api.post('/Bookings', bookingData),
  getUserHistory: (userId) => api.get(`/Bookings/user/${userId}`),
};

export const momoApi = {
  requestPayment: (momoData) => api.post('/Momo/request', momoData),
};

export const analyticsApi = {
  getPlatformStats: () => api.get('/Analytics/platform'),
  getManagerStats: (managerId) => api.get(`/Analytics/manager/${managerId}`),
  getEventStats: (eventId) => api.get(`/Analytics/event/${eventId}`),
};

export const staffApi = {
  getEventStaff: (eventId) => api.get(`/Staff/event/${eventId}`),
  assignStaff: (data) => api.post('/Staff/assign', data),
  removeStaff: (id) => api.delete(`/Staff/${id}`),
};

export const venuesApi = {
  getVenues: () => api.get('/Venues'),
  getVenue: (id) => api.get(`/Venues/${id}`),
  createVenue: (venueData) => api.post('/Venues', venueData),
  updateVenue: (id, venueData) => api.put(`/Venues/${id}`, venueData),
  deleteVenue: (id) => api.delete(`/Venues/${id}`),
  importSeats: (id, formData) => api.post(`/Venues/${id}/import-seats`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const usersApi = {
  getUsers: () => api.get('/Users'),
  createUser: (userData) => api.post('/Users', userData),
  updateUser: (id, userData) => api.put(`/Users/${id}`, userData),
  deleteUser: (id) => api.delete(`/Users/${id}`),
};

export const verifyApi = {
  verifyTicket: (qrCode, staffId) => api.post('/Verify/ticket', { qrCode, staffId: staffId.toString() }),
  getRecentLogs: (staffId) => api.get(`/Verify/logs?staffId=${staffId}`),
};
