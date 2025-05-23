import axios from "axios";

// Base URL da sua API
const api = axios.create({
  baseURL: "https://projeto-cadastro-api.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
