import API from './api';

export const reportService = {
  getReportSummary: async (params) => {
    return await API.get('/reports/summary', { params });
  },
};
