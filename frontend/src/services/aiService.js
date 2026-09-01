import API from './api';

export const aiService = {
  getInsights: async (query = null) => {
    return await API.post('/ai/insights', { query });
  },
};
