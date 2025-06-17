import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Image } from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import Chart from "../../components/Chart";
import { useProfessor } from "../../context/ProfessorContext";
import { groupByTitulacao } from "../../utils/filterUtilities";
import { InteractBtn } from "../../components/atoms/InteractBtn";
import { useTheme } from "react-native-paper"; // ou do seu context de tema

const HomeScreen = () => {
  const { professors } = useProfessor();
  const { labels, data } = groupByTitulacao(professors);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const { colors } = useTheme(); // Hook do tema

  const toggleChartType = () => {
    setChartType((prev) => (prev === "bar" ? "pie" : "bar"));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>
      {professors.length !== 0 ? (
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.onBackground }]}>
            Distribuição de Professores por Titulação
          </Text>
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
          <Text style={[styles.title, { color: colors.onBackground }]}>
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
    alignSelf: "center",
    textAlign: "center",
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