import API from './api';

export const authService = {
  login: async (credentials) => {
    return await API.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await API.post('/auth/register', userData);
  },
  getMe: async () => {
    return await API.get('/auth/me');
  },
};
