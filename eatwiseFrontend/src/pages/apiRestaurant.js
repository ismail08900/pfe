import axios from "axios";

// Instance Axios pour l'espace restaurant
const apiRestaurant = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

apiRestaurant.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurantToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiRestaurant;