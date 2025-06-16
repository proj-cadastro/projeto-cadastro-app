import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../../utils/jwt";
import api from "../apiService";

export interface UserData {
  nome: string;
  email: string;
  senha: string;
}

export async function signUp(data: UserData) {
  const response = await api.post("/usuarios", data);
  return response.data;
}

export async function updateUser(data: Partial<UserData>, id: string) {
  const response = await api.put(`/usuarios/${id}`, data)

  return response.data
}

export async function getLoggedUser() {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    throw new Error("Token não encontrado no AsyncStorage");
  }
  console.log(token)
  const payload = decodeJwt(token);
  
  console.log(payload.userId)
  const response = await api.get(`/usuarios/${payload.userId}`)
  return response.data.data
}
