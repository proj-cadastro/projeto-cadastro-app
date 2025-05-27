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
import { useCourse } from "../../../context/CourseContext";
import { deleteCourse } from "../../../services/course/cursoService";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";

const ListCoursesScreen = () => {
  const [nome, setNome] = useState("");

  const [modalidades, setModalidades] = useState({
    Presencial: true,
    Híbrido: true,
    EAD: false,
  });
  const [showModalidades, setShowModalidades] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const { courses, refreshCoursesData } = useCourse()

  const handleFiltrar = () => {
    // lógica de filtragem aqui (se quiser ajuda com isso, posso montar também)
  };

  const handleImprimir = () => {
    // lógica de impressão ou exportação
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id)
      await refreshCoursesData()
    } catch (error: any) {
      console.error(error.response.data.mensagem)
    }
  }

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
        <Text style={styles.title}>Cursos</Text>

        <TextInput
          placeholder="Nome do Curso"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <TouchableOpacity onPress={() => setShowModalidades((prev) => !prev)}>
              <Text style={styles.filterText}>Modalidades ▼</Text>
            </TouchableOpacity>
            {showModalidades && (
              <View style={styles.submenuOverlay}>
                <View style={styles.submenu}>
                  {Object.entries(modalidades).map(([mod, checked]) =>
                    renderCheckbox(
                      mod,
                      checked,
                      (val) => setModalidades((prev) => ({ ...prev, [mod]: val })),
                      mod
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCellNome}>Nome</Text>
            <Text style={styles.headerCellSmall}>Sigla</Text>
            <Text style={styles.headerCellSmall}>Código</Text>
          </View>

          {courses.map((curso, idx) => (
            <View key={idx}>
              <TouchableOpacity
                style={styles.tableRow}
                onPress={() => setExpandedRow(expandedRow === idx ? null : idx)}
                activeOpacity={0.7}
              >
                <Text style={styles.cellNome}>{curso.nome}</Text>
                <Text style={styles.cellSmall}>{curso.sigla}</Text>
                <Text style={styles.cellSmall}>{curso.codigo}</Text>
              </TouchableOpacity>
              {expandedRow === idx && (
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={styles.cleanOptionBtn}
                    onPress={() => alert(`Ver mais de ${curso.nome}`)}
                  >
                    <Text style={styles.cleanOptionText}>🔎 Ver mais</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cleanOptionBtn}
                    onPress={() => alert(`Editar ${curso.nome}`)}
                  >
                    <Text style={styles.cleanOptionText}>📝 Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cleanOptionBtn}
                    onPress={() =>
                      showConfirmDialog({
                        message: `Deseja realmente excluir ${curso.nome}?`,
                        onConfirm: () => { if (curso.id) handleDelete(curso.id) },
                      })}
                  >
                    <Text style={styles.cleanOptionText}>🗑️ Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.printButtonContainer}>
          <Button title="Imprimir 🖨️" onPress={handleImprimir} color="#6c757d" />
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
    paddingTop: 100,
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 32,
    position: "relative",
    zIndex: 20,
  },
  filterGroup: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
  },
  submenuOverlay: {
    position: "absolute",
    top: 32,
    left: "50%",
    transform: [{ translateX: -80 }],
    zIndex: 100,
    width: 160,
    alignItems: "center",
  },
  submenu: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 120,
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
  headerCellNome: {
    color: "#fff",
    flex: 3,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerCellSmall: {
    color: "#fff",
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cellNome: {
    flex: 3,
    textAlign: "center",
  },
  cellSmall: {
    flex: 1,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 2,
    gap: 16,
  },
  cleanOptionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cleanOptionText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "400",
  },
  printButtonContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
});

export default ListCoursesScreen;
