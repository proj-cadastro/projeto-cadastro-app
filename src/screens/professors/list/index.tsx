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
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

import { TableStyle } from "../../../style/TableStyle";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";
import ColumnSelectionModal from "../../../components/ColumnSelectionModal";
import { professorLabels } from "../../../utils/translateObject";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

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
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProp>();

  const { professors, refreshProfessorsData } = useProfessor();

  // Usa o contexto do tema
  const { isDarkMode } = useThemeMode();

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
      <SafeAreaView style={[
        TableStyle.container,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" }
      ]}>
        <View style={TableStyle.menuContainer}>
          <HamburgerMenu />
        </View>

        {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}

        <ScrollView contentContainerStyle={TableStyle.scrollContent}>
          <Text style={[
            TableStyle.title,
            { color: isDarkMode ? "#fff" : "#000" }
          ]}>
            Professores
          </Text>

          <TextInput
            placeholder="Nome do Professor"
            placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
            value={nome}
            onChangeText={setNome}
            style={[
              TableStyle.input,
              { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" }
            ]}
          />

          <View style={TableStyle.filterRow}>
            <View style={TableStyle.filterGroup}>
              <TouchableOpacity onPress={() => setShowCursos((prev) => !prev)}>
                <Text style={[
                  TableStyle.filterText,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}>Cursos ▼</Text>
              </TouchableOpacity>
              {showCursos && (
                <View style={TableStyle.submenuOverlay}>
                  <View style={TableStyle.submenu}>
                    {Object.entries(cursos).map(([curso, checked]) =>
                      renderCheckbox(
                        curso,
                        checked,
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
                <Text style={[
                  TableStyle.filterText,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}>Titulação ▼</Text>
              </TouchableOpacity>
              {showTitulacoes && (
                <View style={TableStyle.submenuOverlay}>
                  <View style={TableStyle.submenu}>
                    {Object.entries(titulacoes).map(([tit, checked]) =>
                      renderCheckbox(
                        tit,
                        checked,
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
            {professors.length === 0 ? (
              <Text style={[
                TableStyle.emptyText,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>
                Nenhum Professor Encontrado
              </Text>
            ) : (
              professors.map((prof, idx) => (
                <View key={idx} style={TableStyle.cardContainer}>
                  <TouchableOpacity
                    onPress={() => prof.id && toggleCardExpansion(prof.id)}
                    style={[
                      TableStyle.card,
                      { backgroundColor: isDarkMode ? "#232323" : "#fff" }
                    ]}
                  >
                    <Text style={[
                      TableStyle.cardTitle,
                      { color: isDarkMode ? "#fff" : "#000" }
                    ]}>{prof.nome}</Text>
                    <Text style={[
                      TableStyle.cardSubtitle,
                      { color: isDarkMode ? "#ccc" : "#333" }
                    ]}>{prof.email}</Text>
                    <Text style={[
                      TableStyle.cardSubtitle,
                      { color: isDarkMode ? "#ccc" : "#333" }
                    ]}>
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
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 40,
    right: 35,
    zIndex: 20,
  },
});

export default ListProfessorScreen;