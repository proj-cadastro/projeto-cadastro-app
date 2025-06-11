import api from "../apiService";

export async function login(email: string, senha: string) {
    const response = await api.post("/auth/login", { email, senha })
    return response.data.token;
}

export async function getForgetPasswordToken(email: string) {
    const response = await api.post("/auth/esqueceu-senha", { email })
    return response.data.token
}

export async function compareCode(code: string) {

    const response = await api.post("/auth/verifica-reset-code", { code })

    return response.data


}