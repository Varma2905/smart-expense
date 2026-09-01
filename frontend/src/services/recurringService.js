import API from './api';

export const recurringService = {
  getRecurring: async () => {
    return await API.get('/recurring');
  },
  createRecurring: async (data) => {
    return await API.post('/recurring', data);
  },
  updateRecurring: async (id, data) => {
    return await API.put(`/recurring/${id}`, data);
  },
  deleteRecurring: async (id) => {
    return await API.delete(`/recurring/${id}`);
  },
};
