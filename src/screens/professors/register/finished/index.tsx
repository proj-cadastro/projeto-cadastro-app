import React from "react";
import SuccessScreen from "../../../../components/SucessScreen";
import { useNavigation } from "@react-navigation/native";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const FinishedProfessorScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HamburgerMenu />
      <SuccessScreen
        title="Professor Cadastrado com Sucesso!"
        description="Seu professor já está disponível para relatórios!"
        onPressFn={() => navigation.navigate("ListProfessors" as never)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FinishedProfessorScreen;