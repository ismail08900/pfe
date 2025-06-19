import axios from "axios";

// Crée une instance axios personnalisée
const api = axios.create({
  baseURL: "http://localhost:8000/api", // adapte si besoin
});

// Ajoute un intercepteur pour inclure le token dans chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
