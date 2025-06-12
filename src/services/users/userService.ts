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

