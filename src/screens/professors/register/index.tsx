import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import ProfessorFormStepOne from "./stepOne";

const RegisterProfessorScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={styles.content}>
        <ProfessorFormStepOne/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RegisterProfessorScreen;
