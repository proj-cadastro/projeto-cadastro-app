import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Image } from "react-native";

const LoadingScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/logoFatecCapi.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Aguarde</Text>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 20,
        resizeMode: "contain",
    },
});

export default LoadingScreen;
