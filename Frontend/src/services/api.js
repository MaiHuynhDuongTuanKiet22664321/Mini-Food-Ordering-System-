import axios from 'axios';

// API base URLs
const USER_SERVICE = 'http://localhost:3001';
const FOOD_SERVICE = 'http://localhost:3002';
const ORDER_SERVICE = 'http://localhost:3003';
const PAYMENT_SERVICE = 'http://localhost:3004';

// Create axios instances for each service
const userApi = axios.create({
  baseURL: USER_SERVICE,
});

const foodApi = axios.create({
  baseURL: FOOD_SERVICE,
});

const orderApi = axios.create({
  baseURL: ORDER_SERVICE,
});

const paymentApi = axios.create({
  baseURL: PAYMENT_SERVICE,
});

// Add token to requests
const addToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userApi.interceptors.request.use(addToken);
foodApi.interceptors.request.use(addToken);
orderApi.interceptors.request.use(addToken);
paymentApi.interceptors.request.use(addToken);

// User Service API calls
export const userLogin = async (username, password) => {
  const response = await userApi.post('/login', { username, password });
  return response.data;
};

export const userRegister = async (name, username, password) => {
  const response = await userApi.post('/register', { name, username, password });
  return response.data;
};

// Food Service API calls
export const getFoodList = async () => {
  const response = await foodApi.get('/foods');
  return response.data;
};

export const getFoodById = async (foodId) => {
  const response = await foodApi.get(`/foods/${foodId}`);
  return response.data;
};

// Order Service API calls
export const createOrder = async (orderData) => {
  const response = await orderApi.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await orderApi.get('/orders');
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await orderApi.get(`/orders/${orderId}`);
  return response.data;
};

// Payment Service API calls
export const createPayment = async (paymentData) => {
  const response = await paymentApi.post('/payments', paymentData);
  return response.data;
};

export const getPaymentStatus = async (paymentId) => {
  const response = await paymentApi.get(`/payments/${paymentId}/status`);
  return response.data;
};

export const getNotifications = async (userId) => {
  const response = await paymentApi.get(`/notifications/${userId}`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await paymentApi.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export default {
  userApi,
  foodApi,
  orderApi,
  paymentApi,
};
