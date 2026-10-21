import axios from "axios";

// Set REACT_APP_API_URL in frontend/kfc-app/.env for deployment.
// Local development defaults to the Express backend.
export const API_BASE_URL = (process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/$/, "");

const api = axios.create({ baseURL: API_BASE_URL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  let cartId = localStorage.getItem("kfc_cart_id");
  if (!cartId) {
    cartId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("kfc_cart_id", cartId);
  }
  config.headers["x-cart-id"] = cartId;
  return config;
});

export default api;
