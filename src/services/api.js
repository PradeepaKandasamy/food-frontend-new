import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const authService = {
  register: (userData) => API.post('/auth/register', userData),
  login: (userData) => API.post('/auth/login', userData),
};

export const foodService = {
  fetchFoods: () => API.get('/foods'),
  createFood: (foodData) => API.post('/foods', foodData),
  deleteFood: (id) => API.delete(`/foods/${id}`),
};

export const sellerService = {
  register: (sellerData) => API.post('/seller/register', sellerData),
  getDashboard: () => API.get('/seller/dashboard'),
};

export const cartService = {
  addToCart: (data) => API.post('/cart/add', data),
  fetchCart: () => API.get('/cart'),
  removeItem: (id) => API.delete(`/cart/${id}`),
};

export default API;
