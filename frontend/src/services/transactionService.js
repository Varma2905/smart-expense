import API from './api';

export const transactionService = {
  getTransactions: async (params) => {
    return await API.get('/transactions', { params });
  },
  getTransactionById: async (id) => {
    return await API.get(`/transactions/${id}`);
  },
  createTransaction: async (data) => {
    return await API.post('/transactions', data);
  },
  updateTransaction: async (id, data) => {
    return await API.put(`/transactions/${id}`, data);
  },
  deleteTransaction: async (id) => {
    return await API.delete(`/transactions/${id}`);
  },
};
