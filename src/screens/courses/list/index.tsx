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

const ListCoursesScreen = () => {  const [nome, setNome] = useState("");
  const [curso, setCursos] = useState({
    CDN: true,
    CO: false,
    DSM: true,
  });
  const [modalidades, setModalidades] = useState({
    Presencial: true,
    Híbrido: true,
    EAD: false,
  });

  const cursos = [
    { nome: "Ciência de Dados", sigla: "CDN", codigo: "181" },
    { nome: "Controle de Obras", sigla: "CO", codigo: "105" },
    { nome: "Desenvolvimento de Software Multiplataforma", sigla: "DSM", codigo: "181" },
  ];

  const handleFiltrar = () => {
    // lógica de filtragem aqui (se quiser ajuda com isso, posso montar também)
  };

  const handleImprimir = () => {
    // lógica de impressão ou exportação
  };

  const renderCheckbox = (
  label: string,
  checked: boolean,
  onChange: (val: boolean) => void,
  key?: string
) => (
  <TouchableOpacity
    key={key}
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
        <Text style={styles.title}>Filtrar Cursos</Text>

        <TextInput
          placeholder="Nome do Curso"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />
        <TextInput
          placeholder="Nome do Coordenador"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

<View style={styles.checkboxRow}>
  

  <View style={styles.checkboxGroup}>
    <Text style={styles.subtitle}>Modalidades</Text>
    {Object.entries(modalidades).map(([mod, checked]) =>
      renderCheckbox(
        mod,
        checked,
        (val) => setModalidades((prev) => ({ ...prev, [mod]: val })),
        mod // key
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
            <Text style={styles.headerCell}>Sigla</Text>
            <Text style={styles.headerCell}>Código</Text>
            <Text style={styles.headerCell}>Opções</Text>
          </View>

                {cursos.map((cursos, idx) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.cell}>{cursos.nome}</Text>
          <Text style={styles.cell}>{cursos.sigla}</Text>
          <Text style={styles.cell}>{cursos.codigo}</Text>
          <View style={[styles.cell, { flexDirection: "row", gap: 8 }]}>
            <TouchableOpacity onPress={() => alert(`Adicionar para ${cursos.nome}`)}>
              <Text>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert(`Editar ${cursos.nome}`)}>
              <Text>📝</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert(`Excluir ${cursos.nome}`)}>
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

export default ListCoursesScreen;
