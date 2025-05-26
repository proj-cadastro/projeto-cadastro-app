import { ModeloCurso } from "../enums/courses/courseEnum";

export type Course = {
  nome: string;
  codigo: string;
  sigla: string;
  modelo: ModeloCurso;
  coordenadorId: number;
};