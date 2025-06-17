import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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
import { useTheme } from "react-native-paper"; // <-- Importa o tema

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

  const navigation = useNavigation<NavigationProp>();
  const { professors, refreshProfessorsData } = useProfessor();
  const { colors } = useTheme(); // <-- Hook do tema

  useEffect(() => {
    refreshProfessorsData();
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
      <Text style={[TableStyle.checkbox, checked && TableStyle.checked, { color: colors.primary }]}>
        {checked ? "☑" : "☐"}
      </Text>
      <Text style={{ color: colors.onBackground }}>{label}</Text>
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
      await shareDataToPdfFile(professors, selectedColumns);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[TableStyle.container, { backgroundColor: colors.background }]}>
        <View style={TableStyle.menuContainer}>
          <HamburgerMenu />
        </View>

        <ScrollView contentContainerStyle={TableStyle.scrollContent}>
          <Text style={[TableStyle.title, { color: colors.onBackground }]}>Professores</Text>

          <TextInput
            placeholder="Nome do Professor"
            value={nome}
            onChangeText={setNome}
            style={[TableStyle.input, { color: colors.onBackground, backgroundColor: colors.surface, borderColor: colors.outline }]}
            placeholderTextColor={colors.onSurfaceVariant}
          />

          <View style={TableStyle.filterRow}>
            <View style={TableStyle.filterGroup}>
              <TouchableOpacity onPress={() => setShowCursos((prev) => !prev)}>
                <Text style={[TableStyle.filterText, { color: colors.primary }]}>Cursos ▼</Text>
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
                <Text style={[TableStyle.filterText, { color: colors.primary }]}>Titulação ▼</Text>
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
              <Text style={[TableStyle.emptyText, { color: colors.onSurfaceVariant }]}>
                Nenhum Professor Encontrado
              </Text>
            ) : (
              professors.map((prof, idx) => (
                <View key={idx} style={TableStyle.cardContainer}>
                  <TouchableOpacity
                    onPress={() => prof.id && toggleCardExpansion(prof.id)}
                    style={[TableStyle.card, { backgroundColor: colors.elevation.level1 }]}
                  >
                    <Text style={[TableStyle.cardTitle, { color: colors.onBackground }]}>{prof.nome}</Text>
                    <Text style={[TableStyle.cardSubtitle, { color: colors.onSurfaceVariant }]}>{prof.email}</Text>
                    <Text style={[TableStyle.cardSubtitle, { color: colors.onSurfaceVariant }]}>
                      {prof.titulacao}
                    </Text>
                  </TouchableOpacity>
                  {expandedCard === prof.id && (
                    <View style={TableStyle.cardActionsContainer}>
                      <TouchableOpacity
                        style={[TableStyle.actionButton, TableStyle.editButton, { backgroundColor: colors.secondary }]}
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
                          { backgroundColor: colors.primary, justifyContent: "center", alignItems: "center" },
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
                          { backgroundColor: colors.error },
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
          <InteractBtn name="share" onPressFn={() => setIsModalVisible(true)} />
        )}

        <ColumnSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          columnOptions={columnOptions}
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          onConfirm={handleShareData}
          labels={professorLabels}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ListProfessorScreen;