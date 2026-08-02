import axios from "axios";
import { getToken, clearSession } from "../lib/token";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired token used to surface as a confusing inline error on whatever page
// you were on. Clear the dead session and send the user to sign in instead.
// Login itself is exempt, so bad credentials still render their own message.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isAuthCall) {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login?expired=1");
      }
    }
    return Promise.reject(error);
  }
);

export default client;
