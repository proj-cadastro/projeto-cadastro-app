import { Professor } from "./professor";

export type Courses = {
  nome: string;
  sigla: string;
  codigo: number;
  disciplinas: string;
  modelo: string;
  professor: Professor[];
  coordenador: string;
};