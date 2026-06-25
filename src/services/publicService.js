import API from './api';

export const publicService = {
  // CONTACT
  sendContactMessage: async (data) => {
    const response = await API.post('/public/contact', data);
    return response.data;
  },

  // SYSTEM CONFIGS
  getSystemConfigs: async () => {
    const response = await API.get('/public/configs');
    return response.data;
  },

  // AUCTIONS (Public)
  searchAuctions: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`/public/auctions?${queryString}`);
    return response.data;
  }
};

export default publicService;
