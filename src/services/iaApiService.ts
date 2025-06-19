import { API_IA_URL, API_IA_KEY } from "@env";
import axios from "axios";

export const apiIA = axios.create({
  baseURL: API_IA_URL.trim(),
  headers: {
    "Content-Type": "application/json",
    "API_KEY": `${API_IA_KEY.trim()}`
  },
});

apiIA.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (
      error.response &&
      error.response.data &&
      error.response.data.detail === "Not authenticated"
    ) {
      console.error("Erro de autenticação na IA: Not authenticated");
    }
    return Promise.reject(error);
  }
);