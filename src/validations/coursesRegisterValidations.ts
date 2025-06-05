import * as Yup from "yup";

export const coursesRegisterSchema = Yup.object().shape({
  nome: Yup.string()
    .required("Nome do curso é obrigatório")
    .min(3, "Nome deve ter pelo menos 3 caracteres"),
  sigla: Yup.string()
    .required("Sigla do curso é obrigatória")
    .min(2, "Mínimo 2 caracteres"),
  codigo: Yup.string()
  .required("Código é obrigatório"),
});


export const coursesRegisterStep2Schema = Yup.object().shape({
    modelo: Yup.string()
    .required("Modalidade é obrigatória"),
    coordenadorId: Yup.string()
    .required("Coordenador é obrigatório"),
})