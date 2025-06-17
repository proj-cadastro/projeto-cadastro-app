import { API_IA_URL, API_IA_KEY } from "@env";
import axios from "axios";

const apiIA = axios.create({
  baseURL: 'http://10.1.22.133:8000',
  // baseURL: API_IA_URL,
  headers: {
    "Content-Type": "application/json",
    "API_KEY": `PALMEIRAS`
    // "API_KEY": `${API_IA_KEY}`
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

export async function gerarProfessorIA() {
  const response = await apiIA.post("/predict/full");
  return response.data;
}