import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const StepOneScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Step One Screen</Text>
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

export default StepOneScreen;
