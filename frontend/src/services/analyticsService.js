import API from './api';

export const analyticsService = {
  getOverview: async (params) => {
    return await API.get('/analytics/overview', { params });
  },
  getCategories: async (params) => {
    return await API.get('/analytics/categories', { params });
  },
  getTrends: async (params) => {
    return await API.get('/analytics/trends', { params });
  },
};
