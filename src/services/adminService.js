import API from './api';

export const adminService = {
  // === 1. USERS ===
  getAllUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },
  getUserById: async (id) => {
    const response = await API.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (data) => {
    const response = await API.post('/users', data);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await API.put(`/users/${id}`, data);
    return response.data;
  },
  updateUserStatus: async (id, status) => {
    const response = await API.put(`/users/${id}/status`, { status });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  },

  // === 2. ROLES ===
  getAllRoles: async () => {
    const response = await API.get('/roles');
    return response.data;
  },
  getRoleById: async (id) => {
    const response = await API.get(`/roles/${id}`);
    return response.data;
  },
  createRole: async (data) => {
    const response = await API.post('/roles', data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await API.put(`/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await API.delete(`/roles/${id}`);
    return response.data;
  },

  // === 3. CATEGORIES ===
  getAllCategories: async () => {
    const response = await API.get('/categories');
    return response.data;
  },
  getCategoryById: async (id) => {
    const response = await API.get(`/categories/${id}`);
    return response.data;
  },
  createCategory: async (data) => {
    const response = await API.post('/categories', data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await API.put(`/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  },

  // === 4. LOCATIONS ===
  getAllLocations: async () => {
    const response = await API.get('/locations');
    return response.data;
  },
  getLocationById: async (id) => {
    const response = await API.get(`/locations/${id}`);
    return response.data;
  },
  createLocation: async (data) => {
    const response = await API.post('/locations', data);
    return response.data;
  },
  updateLocation: async (id, data) => {
    const response = await API.put(`/locations/${id}`, data);
    return response.data;
  },
  deleteLocation: async (id) => {
    const response = await API.delete(`/locations/${id}`);
    return response.data;
  },

  // === 5. AUCTIONS ===
  getAllAuctions: async () => {
    const response = await API.get('/auctions');
    return response.data;
  },
  getAuctionById: async (id) => {
    const response = await API.get(`/auctions/${id}`);
    return response.data;
  },
  createAuction: async (data) => {
    const response = await API.post('/auctions', data);
    return response.data;
  },
  updateAuction: async (id, data) => {
    const response = await API.put(`/auctions/${id}`, data);
    return response.data;
  },
  deleteAuction: async (id) => {
    const response = await API.delete(`/auctions/${id}`);
    return response.data;
  },

  // === 6. AUCTION IMAGES ===
  getAllAuctionImages: async () => {
    const response = await API.get('/auction-images');
    return response.data;
  },
  getAuctionImageById: async (id) => {
    const response = await API.get(`/auction-images/${id}`);
    return response.data;
  },
  createAuctionImage: async (data) => {
    const response = await API.post('/auction-images', data);
    return response.data;
  },
  updateAuctionImage: async (id, data) => {
    const response = await API.put(`/auction-images/${id}`, data);
    return response.data;
  },
  deleteAuctionImage: async (id) => {
    const response = await API.delete(`/auction-images/${id}`);
    return response.data;
  },

  // === 7. AUCTION DEPOSITS ===
  getAllAuctionDeposits: async () => {
    const response = await API.get('/auction-deposits');
    return response.data;
  },
  getAuctionDepositById: async (id) => {
    const response = await API.get(`/auction-deposits/${id}`);
    return response.data;
  },
  createAuctionDeposit: async (data) => {
    const response = await API.post('/auction-deposits', data);
    return response.data;
  },
  updateAuctionDeposit: async (id, data) => {
    const response = await API.put(`/auction-deposits/${id}`, data);
    return response.data;
  },
  deleteAuctionDeposit: async (id) => {
    const response = await API.delete(`/auction-deposits/${id}`);
    return response.data;
  },

  // === 8. AUCTION REGISTRATIONS ===
  getAllAuctionRegistrations: async () => {
    const response = await API.get('/auction-registrations');
    return response.data;
  },
  getAuctionRegistrationById: async (id) => {
    const response = await API.get(`/auction-registrations/${id}`);
    return response.data;
  },
  createAuctionRegistration: async (data) => {
    const response = await API.post('/auction-registrations', data);
    return response.data;
  },
  updateAuctionRegistration: async (id, data) => {
    const response = await API.put(`/auction-registrations/${id}`, data);
    return response.data;
  },
  deleteAuctionRegistration: async (id) => {
    const response = await API.delete(`/auction-registrations/${id}`);
    return response.data;
  },

  // === 9. BIDS ===
  getAllBids: async () => {
    const response = await API.get('/bids');
    return response.data;
  },
  getBidById: async (id) => {
    const response = await API.get(`/bids/${id}`);
    return response.data;
  },
  createBid: async (data) => {
    const response = await API.post('/bids', data);
    return response.data;
  },
  updateBid: async (id, data) => {
    const response = await API.put(`/bids/${id}`, data);
    return response.data;
  },
  deleteBid: async (id) => {
    const response = await API.delete(`/bids/${id}`);
    return response.data;
  },

  // === 10. ORDERS ===
  getAllOrders: async () => {
    const response = await API.get('/orders');
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  },
  createOrder: async (data) => {
    const response = await API.post('/orders', data);
    return response.data;
  },
  updateOrder: async (id, data) => {
    const response = await API.put(`/orders/${id}`, data);
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await API.delete(`/orders/${id}`);
    return response.data;
  },

  // === 11. TRANSACTIONS ===
  getAllTransactions: async () => {
    const response = await API.get('/transactions');
    return response.data;
  },
  getTransactionById: async (id) => {
    const response = await API.get(`/transactions/${id}`);
    return response.data;
  },
  createTransaction: async (data) => {
    const response = await API.post('/transactions', data);
    return response.data;
  },
  updateTransaction: async (id, data) => {
    const response = await API.put(`/transactions/${id}`, data);
    return response.data;
  },
  deleteTransaction: async (id) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  },

  // === 12. REVIEWS ===
  getAllReviews: async () => {
    const response = await API.get('/reviews');
    return response.data;
  },
  getReviewById: async (id) => {
    const response = await API.get(`/reviews/${id}`);
    return response.data;
  },
  createReview: async (data) => {
    const response = await API.post('/reviews', data);
    return response.data;
  },
  updateReview: async (id, data) => {
    const response = await API.put(`/reviews/${id}`, data);
    return response.data;
  },
  deleteReview: async (id) => {
    const response = await API.delete(`/reviews/${id}`);
    return response.data;
  },

  // === 13. NEWS ===
  getAllNews: async () => {
    const response = await API.get('/news');
    return response.data;
  },
  getNewsById: async (id) => {
    const response = await API.get(`/news/${id}`);
    return response.data;
  },
  createNews: async (data) => {
    const response = await API.post('/news', data);
    return response.data;
  },
  updateNews: async (id, data) => {
    const response = await API.put(`/news/${id}`, data);
    return response.data;
  },
  deleteNews: async (id) => {
    const response = await API.delete(`/news/${id}`);
    return response.data;
  },

  // === 14. NOTIFICATIONS ===
  getAllNotifications: async () => {
    const response = await API.get('/notifications');
    return response.data;
  },
  getNotificationById: async (id) => {
    const response = await API.get(`/notifications/${id}`);
    return response.data;
  },
  createNotification: async (data) => {
    const response = await API.post('/notifications', data);
    return response.data;
  },
  updateNotification: async (id, data) => {
    const response = await API.put(`/notifications/${id}`, data);
    return response.data;
  },
  deleteNotification: async (id) => {
    const response = await API.delete(`/notifications/${id}`);
    return response.data;
  },

  // === 15. WATCHLISTS ===
  getAllWatchlists: async () => {
    const response = await API.get('/watchlists');
    return response.data;
  },
  getWatchlistById: async (id) => {
    const response = await API.get(`/watchlists/${id}`);
    return response.data;
  },
  createWatchlist: async (data) => {
    const response = await API.post('/watchlists', data);
    return response.data;
  },
  updateWatchlist: async (id, data) => {
    const response = await API.put(`/watchlists/${id}`, data);
    return response.data;
  },
  deleteWatchlist: async (id) => {
    const response = await API.delete(`/watchlists/${id}`);
    return response.data;
  },

  // === 16. AUDIT LOGS ===
  getAllAuditLogs: async () => {
    const response = await API.get('/audit-logs');
    return response.data;
  },
  getAuditLogById: async (id) => {
    const response = await API.get(`/audit-logs/${id}`);
    return response.data;
  },
  createAuditLog: async (data) => {
    const response = await API.post('/audit-logs', data);
    return response.data;
  },
  updateAuditLog: async (id, data) => {
    const response = await API.put(`/audit-logs/${id}`, data);
    return response.data;
  },
  deleteAuditLog: async (id) => {
    const response = await API.delete(`/audit-logs/${id}`);
    return response.data;
  },

  // === 17. ARTICLES ===
  getApprovedArticles: async () => {
    const response = await API.get('/articles');
    return response.data;
  },
  getAllArticles: async () => {
    const response = await API.get('/admin/articles');
    return response.data;
  },
  getArticleById: async (id) => {
    const response = await API.get(`/articles/${id}`);
    return response.data;
  },
  createArticle: async (data) => {
    const response = await API.post('/articles', data);
    return response.data;
  },
  updateArticleStatus: async (id, status) => {
    const response = await API.put(`/admin/articles/${id}/status?status=${status}`);
    return response.data;
  },
  getReviewsByArticle: async (id) => {
    const response = await API.get(`/articles/${id}/reviews`);
    return response.data;
  },
  addArticleReview: async (id, data) => {
    const response = await API.post(`/articles/${id}/reviews`, data);
    return response.data;
  },

  // === DASHBOARD GENERAL STATS ===
  getDashboardStats: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await API.get(`/admin/dashboard-stats?${params.toString()}`);
    return response.data;
  },

  // === SYSTEM CONFIGS ===
  getSystemConfigs: async () => {
    const response = await API.get('/public/configs');
    return response.data;
  },
  updateSystemConfigs: async (data) => {
    const response = await API.put('/admin/configs', data);
    return response.data;
  },

  // === FILE UPLOADS ===
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default adminService;
