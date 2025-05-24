import { Courses } from "./courses";

export type Professor = {
  name: string;
  email: string;
  titulacao: string;
  numMatricula: string;
  codUnidade: string;
  lattes: string;
  referencia: string;
  observacoes: string;
  cursos: Courses[]
};
