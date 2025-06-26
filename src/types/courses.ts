import { ModeloCurso } from "../enums/courses/courseEnum";
import { Materia } from "./materia";

export type Course = {
  id?: number;
  nome: string;
  codigo: string;
  sigla: string;
  modelo: ModeloCurso | undefined;
  coordenadorId: number | undefined;
  materias?: Materia[];
};
