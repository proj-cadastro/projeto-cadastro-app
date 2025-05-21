import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  Button,
  ScrollView,
  TouchableOpacity
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";

interface Professor {
  nome: string;
  email: string;
  titulacao: string;
}

const ProfessorsListScreen = () => {
  const [nome, setNome] = useState("");
  const [cursos, setCursos] = useState({
    CDN: true,
    CO: false,
    DSM: true,
  });
  const [titulacoes, setTitulacoes] = useState({
    Especialista: true,
    Doutor: true,
    Mestre: false,
  });

  const professores = [
    { nome: "Jura", email: "Lanches.com", titulacao: "Doutor" },
    { nome: "Lion", email: "Parmera.com", titulacao: "Mestre" },
    { nome: "Matheus", email: "Maromba.com", titulacao: "Especialista" },
  ];

  const handleFiltrar = () => {
    // lógica de filtragem aqui (se quiser ajuda com isso, posso montar também)
  };

  const handleImprimir = () => {
    // lógica de impressão ou exportação
  };

  const renderCheckbox = (label: string, checked: boolean, onChange: (val: boolean) => void) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <Text style={[styles.checkbox, checked && styles.checked]}>
        {checked ? "☑" : "☐"}
      </Text>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Filtrar Professores</Text>

        <TextInput
          placeholder="Nome do Professor"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <View style={styles.checkboxRow}>
          <View style={styles.checkboxGroup}>
            <Text style={styles.subtitle}>Cursos</Text>
            {Object.entries(cursos).map(([curso, checked]) =>
              renderCheckbox(curso, checked, (val) =>
                setCursos((prev) => ({ ...prev, [curso]: val }))
              )
            )}
          </View>

          <View style={styles.checkboxGroup}>
            <Text style={styles.subtitle}>Titulação</Text>
            {Object.entries(titulacoes).map(([tit, checked]) =>
              renderCheckbox(tit, checked, (val) =>
                setTitulacoes((prev) => ({ ...prev, [tit]: val }))
              )
            )}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Button title="Filtrar 🔍" onPress={handleFiltrar} color="#007bff" />
          <Button title="Imprimir 🖨️" onPress={handleImprimir} color="#6c757d" />
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Nome</Text>
            <Text style={styles.headerCell}>E-mail</Text>
            <Text style={styles.headerCell}>Titulação</Text>
            <Text style={styles.headerCell}>Opções</Text>
          </View>

                {professores.map((prof, idx) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.cell}>{prof.nome}</Text>
          <Text style={styles.cell}>{prof.email}</Text>
          <Text style={styles.cell}>{prof.titulacao}</Text>
          <View style={[styles.cell, { flexDirection: "row", gap: 8 }]}>
            <TouchableOpacity onPress={() => alert(`Adicionar para ${prof.nome}`)}>
              <Text>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert(`Editar ${prof.nome}`)}>
              <Text>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert(`Excluir ${prof.nome}`)}>
              <Text>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  scrollContent: { 
    padding: 16,
    paddingTop: 100, // ajuste o valor conforme desejar
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  checkboxRow: { flexDirection: "row", justifyContent: "space-between" },
  checkboxGroup: { flex: 1, marginRight: 8 },
  subtitle: { fontWeight: "bold", marginBottom: 8 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { marginRight: 6, fontSize: 16 },
  checked: { color: "#007bff" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  table: { marginTop: 20 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 8,
  },
  headerCell: {
    color: "#fff",
    flex: 1,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: { flex: 1 },
});

export default ProfessorsListScreen;
