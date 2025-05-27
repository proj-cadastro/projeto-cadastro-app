import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env";

const api = axios.create({
  baseURL: API_URL, // Use a variável de ambiente ou um valor padrão
  headers: {
    "Content-Type": "application/json",
  },
});

//intercepta cada interacao com a api e injeta o token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export default api;
