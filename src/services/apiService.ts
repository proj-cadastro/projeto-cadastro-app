import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL da sua API
const api = axios.create({
  baseURL: "http://10.68.153.95:3000", //rodar o backend local e adicionar o ipv4 da sua máquina, encontre via cmd/ipconfig
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
