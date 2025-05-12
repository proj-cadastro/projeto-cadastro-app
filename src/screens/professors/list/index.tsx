import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const ProfessorsListScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <Text>Professors List Screen</Text>
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

export default ProfessorsListScreen;
