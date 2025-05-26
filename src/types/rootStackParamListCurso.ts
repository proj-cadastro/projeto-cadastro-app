//esquema de configuração para enviar qualquer informação via parâmetros para outra tela...

import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamListCurso = {
  FormCursoStepOne: undefined;
  RegisterCursosStepTwo: {
    partialDataCurso: {
      nome: string;
      sigla: string;
      codigo: string;
      
    };
  };
};

export type NavigationProp = StackNavigationProp<RootStackParamListCurso>;
export type RouteParamsProps<T extends keyof RootStackParamListCurso> = RouteProp<RootStackParamListCurso, T>;
