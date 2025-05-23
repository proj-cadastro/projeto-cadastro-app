import api from "../apiService";

export interface UserData {
  username: string;
  email: string;
  password: string;
}

export async function createUser(userData: UserData) {
  const response = await api.post("/users", userData);
  return response.data;
}
