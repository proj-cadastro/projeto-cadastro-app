import React from "react";
import SuccessScreen from "../../../../components/SucessScreen";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, View } from "react-native";
import { FormStyles } from "../../../../style/FormStyles";
import HamburgerMenu from "../../../../components/HamburgerMenu";

const Finished = () => {
  const navigation = useNavigation();

  return (

      <>
        <HamburgerMenu/>
        <SuccessScreen
          title="Curso Cadastrado com Sucesso!"
          description="Seu curso já está disponível para relatórios!"
          onPressFn={() => navigation.navigate("ListCourses" as never)}
        />
      </>

  );
};

export default Finished;
