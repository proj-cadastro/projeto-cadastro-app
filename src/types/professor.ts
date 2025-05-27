import { Referencia, StatusAtividade, Titulacao } from "../enums/professors/professorEnum";

export type Professor = {
  id?: number
  nome: string;
  email: string;
  titulacao: string;
  idUnidade: string;
  referencia: string;
  lattes: string;
  statusAtividade: string;
  observacoes?: string;
};
