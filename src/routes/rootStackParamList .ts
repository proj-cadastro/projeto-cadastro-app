//esquema de configuração para enviar qualquer informação via parâmetros para outra tela...

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {

  //Rotas de Professor: 
  RegisterProfessorsStepOne: undefined;

  RegisterProfessorsStepTwo: {
    partialDataProfessor: {
      nome: string;
      email: string;
      titulacao: string;
      idUnidade: string;
    };
  };

  EditProfessors: {
    id: number
  }
  //##

  //Rotas de Curso
  FormCourseStepOne: undefined
  
  RegisterCourseStepTwo: {
    partialDataCurso: {
      nome: string;
      sigla: string;
      codigo: string;

    };
  };
  EditCourses: {
    id: number
  }
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
export type RouteParamsProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
