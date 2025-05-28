import api from "../apiService";

export async function login(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, senha })
    return response.data.token;
}