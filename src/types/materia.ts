export interface Materia {
  id?: number;
  nome: string;
  cargaHoraria: number;
  professorId: number | null;
}
