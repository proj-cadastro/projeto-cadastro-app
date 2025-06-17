import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type ProfessorIAData = {
  nome: string;
  email: string;
  titulacao: string;
  idUnidade: string;
  referencia?: string;
  statusAtividade?: string;
  lattes?: string;
};

export type RootStackParamList = {

  RegisterProfessorsStepOne: { iaData?: ProfessorIAData };

  RegisterProfessorsStepTwo: { partialDataProfessor: ProfessorIAData };

  EditProfessors: { id: number };

  DetailsProfessors: { id: number };

  FormCourseStepOne: undefined;

  RegisterCourseStepTwo: {
    partialDataCurso: {
      nome: string;
      sigla: string;
      codigo: string;
    };
  };
  
  EditCourses: { id: number };
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
export type RouteParamsProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;