import React from "react";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import Chart from "../../components/Chart";

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Distribuição de Titulação</Text>
        <Chart data={[1, 2, 3]} label={["Mestre", "Doutor", "Especialista"]}/>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
    alignSelf: "center",
  },
});

export default HomeScreen;
