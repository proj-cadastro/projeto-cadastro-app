import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import Chart from "../../components/Chart";
import { useProfessor } from "../../context/ProfessorContext";
import { groupByTitulacao } from "../../utils/filterUtilities";
import { MaterialIcons } from "@expo/vector-icons"; // ou use outro ícone
import { InteractBtn } from "../../components/atoms/InteractBtn";

const HomeScreen = () => {
  const { professors } = useProfessor();
  const { labels, data } = groupByTitulacao(professors);

  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const toggleChartType = () => {
    setChartType((prev) => (prev === "bar" ? "pie" : "bar"));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>
      {professors.length !== 0 ? (
        <View style={styles.content}>
          <Text style={styles.title}>Distribuição de Professores por Titulação</Text>
          <Chart data={data} label={labels} chartType={chartType} />

          <InteractBtn
            name={chartType === "bar" ? "pie-chart" : "bar-chart"}
            onPressFn={toggleChartType}
          />

        </View>
      ) : (
        <View style={styles.emptyContent}>
          <Image
            source={require("../../../assets/logoFatecCapi.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>
            Bem vindo ao Sistema Gerenciador de Professores da Fatec Votorantim!
          </Text>
        </View>
      )}
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
    textAlign: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

});

export default HomeScreen;
