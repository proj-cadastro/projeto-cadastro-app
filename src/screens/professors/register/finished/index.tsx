import React from "react";
import SuccessScreen from "../../../../components/SucessScreen";
import { useNavigation } from "@react-navigation/native";
import HamburgerMenu from "../../../../components/HamburgerMenu";

const FinishedProfessorScreen = () => {
  const navigation = useNavigation();

  return (

      <>
        <HamburgerMenu/>
        <SuccessScreen
          title="Professor Cadastrado com Sucesso!"
          description="Seu professor já está disponível para relatórios!"
          onPressFn={() => navigation.navigate("ListProfessors" as never)}
        />
      </>

  );
};

export default FinishedProfessorScreen;
