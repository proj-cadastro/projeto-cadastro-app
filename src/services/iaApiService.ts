import { API_IA_URL, API_IA_KEY } from "@env";
import axios from "axios";

const baseURL = API_IA_URL;
const ApiKey = API_IA_KEY;

export const apiIA = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    "API_KEY": ApiKey
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