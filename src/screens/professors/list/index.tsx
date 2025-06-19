import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useProfessor } from "../../../context/ProfessorContext";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { deleteProfessor } from "../../../services/professors/professorService";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

import { TableStyle } from "../../../style/TableStyle";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";
import ColumnSelectionModal from "../../../components/ColumnSelectionModal";
import { professorLabels } from "../../../utils/translateObject";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";
import { getCourses } from "../../../services/course/cursoService";
import { getProfessors } from "../../../services/professors/professorService";

const ListProfessorScreen = () => {
  const [nome, setNome] = useState("");
  const [cursos, setCursos] = useState<{ [key: string]: boolean }>({});
  const [titulacoes, setTitulacoes] = useState<{ [key: string]: boolean }>({});
  const [showCursos, setShowCursos] = useState(false);
  const [showTitulacoes, setShowTitulacoes] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);
  const [availableCursos, setAvailableCursos] = useState<string[]>([]);
  const [availableTitulacoes, setAvailableTitulacoes] = useState<string[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const navigation = useNavigation<NavigationProp>();

  const { refreshProfessorsData } = useProfessor();

  useEffect(() => {
    refreshProfessorsData();
  }, []);

  useEffect(() => {
    const fetchUnidade = async () => {
      try {
        const unidade = await buscarOuCacheUnidadeProxima();
        setUnidadeNome(unidade?.nome ?? null);
      } catch {
        setUnidadeNome(null);
      }
    };
    fetchUnidade();
    const interval = setInterval(fetchUnidade, 180000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchFilters = async () => {
      const cursosData = await getCourses();
      setAvailableCursos(cursosData.map((c: any) => c.nome));
      setCursos(
        cursosData.reduce(
          (acc: any, c: any) => ({ ...acc, [c.nome]: false }),
          {}
        )
      );
      const titulacoesData = ["Especialista", "Mestre", "Doutor"];
      setAvailableTitulacoes(titulacoesData);
      setTitulacoes(
        titulacoesData.reduce((acc, t) => ({ ...acc, [t]: false }), {})
      );
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProfessors = async () => {
      setIsLoading(true);
      try {
        const cursosSelecionados = Object.entries(cursos)
          .filter(([_, v]) => v)
          .map(([k]) => k);
        const titulacoesSelecionadas = Object.entries(titulacoes)
          .filter(([_, v]) => v)
          .map(([k]) => k);
        const data = await getProfessors({
          nome: debouncedSearchTerm || undefined,
          cursos: cursosSelecionados.length ? cursosSelecionados : undefined,
          titulacoes: titulacoesSelecionadas.length
            ? titulacoesSelecionadas
            : undefined,
        });
        setProfessors(data);
      } catch (e) {
        setProfessors([]);
      }
      setIsLoading(false);
    };

    fetchProfessors();
  }, [debouncedSearchTerm, cursos, titulacoes]);

  const handleDelete = async (id: number) => {
    try {
      await deleteProfessor(id);
      refreshProfessorsData();
    } catch (error: any) {
      console.error(error.response.data.mensagem);
    }
  };

  const renderCheckbox = (
    label: string,
    checked: boolean,
    onChange: (val: boolean) => void,
    key?: string
  ) => (
    <TouchableOpacity
      key={key}
      style={TableStyle.checkboxContainer}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      <Text style={[TableStyle.checkbox, checked && TableStyle.checked]}>
        {checked ? "☑" : "☐"}
      </Text>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  const toggleCardExpansion = (id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const columnOptions = Object.keys(professors[0] || {}).filter(
    (key) => key !== "id"
  );

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleShareData = async () => {
    try {
      setIsLoading(true);
      await shareDataToPdfFile(professors, selectedColumns, "professor");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={TableStyle.container}>
        <View style={TableStyle.menuContainer}>
          <HamburgerMenu />
        </View>

        {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}

        <ScrollView contentContainerStyle={TableStyle.scrollContent}>
          <Text style={TableStyle.title}>Professores</Text>

          <TextInput
            placeholder="Nome do Professor"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={TableStyle.input}
          />

          <View style={TableStyle.filterRow}>
            <View style={TableStyle.filterGroup}>
              <TouchableOpacity onPress={() => setShowCursos((prev) => !prev)}>
                <Text style={TableStyle.filterText}>Cursos ▼</Text>
              </TouchableOpacity>
              {showCursos && (
                <View style={TableStyle.submenuOverlay}>
                  <View style={TableStyle.submenu}>
                    {availableCursos.map((curso) =>
                      renderCheckbox(
                        curso,
                        cursos[curso] || false,
                        (val) =>
                          setCursos((prev) => ({ ...prev, [curso]: val })),
                        curso
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
            <View style={TableStyle.filterGroup}>
              <TouchableOpacity
                onPress={() => setShowTitulacoes((prev) => !prev)}
              >
                <Text style={TableStyle.filterText}>Titulação ▼</Text>
              </TouchableOpacity>
              {showTitulacoes && (
                <View style={TableStyle.submenuOverlay}>
                  <View style={TableStyle.submenu}>
                    {availableTitulacoes.map((tit) =>
                      renderCheckbox(
                        tit,
                        titulacoes[tit] || false,
                        (val) =>
                          setTitulacoes((prev) => ({ ...prev, [tit]: val })),
                        tit
                      )
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={TableStyle.cardList}>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : professors.length === 0 ? (
              <Text style={TableStyle.emptyText}>
                Nenhum Professor Encontrado
              </Text>
            ) : (
              professors.map((prof, idx) => (
                <View key={idx} style={TableStyle.cardContainer}>
                  <TouchableOpacity
                    onPress={() => prof.id && toggleCardExpansion(prof.id)}
                    style={TableStyle.card}
                  >
                    <Text style={TableStyle.cardTitle}>{prof.nome}</Text>
                    <Text style={TableStyle.cardSubtitle}>{prof.email}</Text>
                    <Text style={TableStyle.cardSubtitle}>
                      {prof.titulacao}
                    </Text>
                  </TouchableOpacity>
                  {expandedCard === prof.id && (
                    <View style={TableStyle.cardActionsContainer}>
                      <TouchableOpacity
                        style={[TableStyle.actionButton, TableStyle.editButton]}
                        onPress={() => {
                          if (prof.id)
                            navigation.navigate("EditProfessors", {
                              id: prof.id,
                            });
                        }}
                      >
                        <Icon name="edit" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          TableStyle.actionButton,
                          {
                            backgroundColor: "#007bff",
                            justifyContent: "center",
                            alignItems: "center",
                          },
                        ]}
                        onPress={() => {
                          if (prof.id !== undefined) {
                            navigation.navigate("DetailsProfessors", {
                              id: prof.id,
                            });
                          }
                        }}
                      >
                        <Icon name="add" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          TableStyle.actionButton,
                          TableStyle.deleteButton,
                        ]}
                        onPress={() =>
                          showConfirmDialog({
                            message: `Deseja realmente excluir ${prof.nome}?`,
                            onConfirm: () => {
                              if (prof.id) handleDelete(prof.id);
                            },
                          })
                        }
                      >
                        <Icon name="delete" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {professors.length > 0 && (
          <View style={styles.fabContainer}>
            <InteractBtn name="share" onPressFn={handleExportClick} />
          </View>
        )}

        <ColumnSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          columnOptions={columnOptions}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          onConfirm={handleShareData}
          labels={professorLabels}
          loading={isLoading}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
    elevation: 2,
  },
});

export default ListProfessorScreen;
