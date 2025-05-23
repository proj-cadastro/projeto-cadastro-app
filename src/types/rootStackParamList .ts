//esquema de configuração para enviar qualquer informação via parâmetros para outra tela...

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  FormProfessorStepOne: undefined;
  RegisterProfessorsStepTwo: {
    partialDataProfessor: {
      name: string;
      email: string;
      titulacao: string;
      numMatricula: string;
      codUnidade: string;
    };
  };
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;
export type RouteParamsProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
