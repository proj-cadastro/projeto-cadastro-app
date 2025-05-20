import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const StepTwoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Step Two Screen</Text>
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

export default StepTwoScreen;
