import API from './api';

export const budgetService = {
  getBudgets: async (month, year) => {
    return await API.get('/budgets', { params: { month, year } });
  },
  createOrUpdateBudget: async (data) => {
    return await API.post('/budgets', data);
  },
  updateBudget: async (id, data) => {
    return await API.put(`/budgets/${id}`, data);
  },
  deleteBudget: async (id) => {
    return await API.delete(`/budgets/${id}`);
  },
};
