import { Referencia, StatusAtividade, Titulacao } from "../enums/professors/professorEnum";

export type Professor = {
  nome: string;
  email: string;
  titulacao: string;
  idUnidade: string;
  referencia: string;
  lattes: string;
  statusAtividade: string;
  observacoes?: string;
};
