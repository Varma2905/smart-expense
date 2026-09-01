import API from './api';

export const settingsService = {
  getSettings: async () => {
    return await API.get('/settings');
  },
  updateSettings: async (data) => {
    return await API.put('/settings', data);
  },
};
