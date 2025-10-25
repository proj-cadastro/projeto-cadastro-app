import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../../utils/jwt";
import api from "../apiService";
import { UsuarioResponse } from "../../types/user";

export interface UserData {
  nome: string;
  email: string;
  senha: string;
}

export async function signUp(data: UserData) {
  console.log("Chegou no service", api);
  const response = await api.post("/usuarios", data);
  console.log("Usuário criado:", response);
  return response.data;
}

export async function updateUser(data: Partial<UserData>, id: string) {
  const response = await api.put(`/usuarios/${id}`, data);

  return response.data;
}

export async function getLoggedUser(): Promise<UsuarioResponse> {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Token não encontrado no AsyncStorage");
    }

    console.log("🔍 getLoggedUser: Tentando obter dados do usuário");

    // Como você confirmou que a rota é /usuarios, vamos usar diretamente
    try {
      const response = await api.get("/usuarios/me");

      // Tratar diferentes formatos de resposta
      if (response.data.data) {
        return response.data.data;
      } else if (response.data.user) {
        return response.data.user;
      } else {
        return response.data;
      }
    } catch (error: any) {
      // Se não conseguir obter do servidor, não podemos determinar o role
      throw new Error(
        `Erro ao obter dados do usuário: ${
          error.response?.status || error.message
        }`
      );
    }
  } catch (error: any) {
    console.error("❌ Erro em getLoggedUser:", error);
    throw error;
  }
}

export async function getAllUsers(): Promise<UsuarioResponse[]> {
  const response = await api.get("/usuarios");
  return response.data.data;
}

export async function updateUserStatus(
  userId: string,
  isActive: boolean
): Promise<void> {
  await api.patch(`/usuarios/${userId}/status`, { isActive });
}

export interface UpdateUserDto {
  nome?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

export async function updateUserById(
  userId: string,
  data: UpdateUserDto
): Promise<UsuarioResponse> {
  const response = await api.put(`/usuarios/${userId}`, data);
  return response.data.data || response.data;
}
