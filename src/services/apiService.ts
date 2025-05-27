import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// @ts-ignore
const baseURL = process.env.API_URL;

// Base URL da sua API
const api = axios.create({
  baseURL,
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
