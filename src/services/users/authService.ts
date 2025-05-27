import api from "../apiService";

import AsyncStorage from "@react-native-async-storage/async-storage";

export async function login(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, senha })
    return response.data.token;
}
