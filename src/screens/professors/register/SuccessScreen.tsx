import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const SuccessScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Registration Successful!</Text>
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

export default SuccessScreen;
