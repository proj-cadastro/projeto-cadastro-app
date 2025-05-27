import React, { useEffect, useState } from "react";
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
import { useProfessor } from "../../../context/ProfessorContext";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { deleteProfessors } from "../../../services/professors/professorService";

const ListProfessorScreen = () => {
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
  const [showCursos, setShowCursos] = useState(false);
  const [showTitulacoes, setShowTitulacoes] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const { professors, refreshProfessorsData } = useProfessor()

  useEffect(() => { refreshProfessorsData() }, [])

  const handleFiltrar = () => {
    // lógica de filtragem aqui (se quiser ajuda com isso, posso montar também)
  };

  const handleImprimir = () => {
    // lógica de impressão ou exportação
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProfessors(id)
      refreshProfessorsData()
      console.log(professors.length)

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
        <Text style={styles.title}>Professores</Text>

        <TextInput
          placeholder="Nome do Professor"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <TouchableOpacity
              onPress={() => setShowCursos((prev) => !prev)}
            >
              <Text style={styles.filterText}>Cursos ▼</Text>
            </TouchableOpacity>
            {showCursos && (
              <View style={styles.submenuOverlay}>
                <View style={styles.submenu}>
                  {Object.entries(cursos).map(([curso, checked]) =>
                    renderCheckbox(
                      curso,
                      checked,
                      (val) => setCursos((prev) => ({ ...prev, [curso]: val })),
                      curso
                    )
                  )}
                </View>
              </View>
            )}
          </View>
          <View style={styles.filterGroup}>
            <TouchableOpacity
              onPress={() => setShowTitulacoes((prev) => !prev)}
            >
              <Text style={styles.filterText}>Titulação ▼</Text>
            </TouchableOpacity>
            {showTitulacoes && (
              <View style={styles.submenuOverlay}>
                <View style={styles.submenu}>
                  {Object.entries(titulacoes).map(([tit, checked]) =>
                    renderCheckbox(
                      tit,
                      checked,
                      (val) => setTitulacoes((prev) => ({ ...prev, [tit]: val })),
                      tit
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.table}>
          {professors.length === 0 ? (<Text style={styles.emptyText}>Nenhum Professor Encontrado</Text>) : (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Nome</Text>
                <Text style={styles.headerCell}>E-mail</Text>
                <Text style={styles.headerCell}>Titulação</Text>
              </View>

              {professors.map((prof, idx) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={styles.tableRow}
                    onPress={() => setExpandedRow(expandedRow === idx ? null : idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cell}>{prof.nome}</Text>
                    <Text style={styles.cell}>{prof.email}</Text>
                    <Text style={styles.cell}>{prof.titulacao}</Text>
                  </TouchableOpacity>
                  {expandedRow === idx && (
                    <View style={styles.optionsRow}>
                      <TouchableOpacity
                        style={styles.cleanOptionBtn}
                        onPress={() => alert(`Ver mais de ${prof.nome}`)}
                      >
                        <Text style={styles.cleanOptionText}>🔎 Ver mais</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cleanOptionBtn}
                        onPress={() => alert(`Editar ${prof.nome}`)}
                      >
                        <Text style={styles.cleanOptionText}>📝 Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.cleanOptionBtn}
                        onPress={() =>
                          showConfirmDialog({
                            message: `Deseja realmente excluir ${prof.nome}?`,
                            onConfirm: () => { if (prof.id) handleDelete(prof.id) },
                          })}
                      >
                        <Text style={styles.cleanOptionText}>🗑️ Remover</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </View>
              ))
              }
              <View style={styles.printButtonContainer}>
                <Button title="Imprimir 🖨️" onPress={handleImprimir} color="#6c757d" />
              </View>
            </>
          )}

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
  headerCell: {
    color: "#fff",
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
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
  emptyText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 16,
    color: "#888",
  },
});

export default ListProfessorScreen;
