import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const RegisterProfessorScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Register Professor Screen</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default RegisterProfessorScreen;