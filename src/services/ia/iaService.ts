import { apiIA } from "..//iaApiService";

export async function gerarProfessorIA() {
  const response = await apiIA.post("/predict/full");
  return response.data;
}