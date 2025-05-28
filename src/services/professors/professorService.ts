import { Professor } from "../../types/professor";
import api from "../apiService";

export const postProfessor = async (data: Professor) => {
    const response = await api.post("/professores", data)

    return response.data
}

export const getProfessors = async () => {
    const response = await api.get("/professores")
    //forma de como a lista de professores está vindo do backend
    //response.data.data
    //data = {message: professores encontrados com sucesso, data: []}
    return response.data.data
}


export const deleteProfessor = async (id: number) => {
    const response = await api.delete(`/professores/${id}`)

    return response.data
}

export const updateProfessor = async (id: number, data: Professor) => {
    const response = await api.put(`/professores/${id}`, data)

    return response.data
}