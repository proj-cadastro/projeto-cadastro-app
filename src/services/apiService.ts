import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenValid } from "../utils/jwtDecode";
import { authEventEmitter } from "../events/AuthEventEmitter";

const api = axios.create({
  baseURL: "http://10.68.153.95:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    const isValid = await isTokenValid(token);
    if (!isValid) {
      authEventEmitter.emit("logout");
      console.log("Vencido");
      throw new axios.Cancel("Token Expirado, por favor faça login");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;