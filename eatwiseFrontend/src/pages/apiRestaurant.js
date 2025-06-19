import axios from "axios";

// Instance Axios pour l'espace restaurant
const apiRestaurant = axios.create({
  baseURL: "http://localhost:8000/api", // adapte si besoin
});

apiRestaurant.interceptors.request.use((config) => {
  const token = localStorage.getItem('restaurantToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default apiRestaurant;