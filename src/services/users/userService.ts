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

