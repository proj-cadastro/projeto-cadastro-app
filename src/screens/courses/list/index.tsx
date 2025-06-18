import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useCourse } from "../../../context/CourseContext";
import { deleteCourse } from "../../../services/course/cursoService";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useNavigation } from "@react-navigation/native";
import { TableStyle } from "../../../style/TableStyle";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useProfessor } from "../../../context/ProfessorContext";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";
import ColumnSelectionModal from "../../../components/ColumnSelectionModal";
import { courseLabels } from "../../../utils/translateObject";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";

const ListCoursesScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [modalidades, setModalidades] = useState({
    Presencial: true,
    Híbrido: true,
    EAD: false,
  });
  const [showModalidades, setShowModalidades] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [unidadeNome, setUnidadeNome] = useState<string | null>(null);

  const { courses, refreshCoursesData } = useCourse();
  const { getProfessorById } = useProfessor();

  const columnOptions = Object.keys(courses[0] || {}).filter(
    (key) => key !== "id" && key !== "coordenadorId"
  );

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

  const handleExportClick = () => {
    setIsModalVisible(true);
  };

  const handleShareData = async () => {
    try {
      await shareDataToPdfFile(courses, selectedColumns, "course");
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      refreshCoursesData();
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

  const toggleCardExpansion = (id: number | undefined) => {
    if (id !== undefined) {
      setExpandedCard((prev) => (prev === id ? null : id));
    }
  };

  return (
    <SafeAreaView style={TableStyle.container}>
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>

      {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}

      <ScrollView contentContainerStyle={TableStyle.scrollContent}>
        <Text style={TableStyle.title}>Cursos</Text>

        <TextInput
          placeholder="Nome do Curso"
          value={nome}
          onChangeText={setNome}
          style={TableStyle.input}
        />

        <View style={TableStyle.filterRow}>
          <View style={TableStyle.filterGroup}>
            <TouchableOpacity
              onPress={() => setShowModalidades((prev) => !prev)}
            >
              <Text style={TableStyle.filterText}>Modalidades ▼</Text>
            </TouchableOpacity>
            {showModalidades && (
              <View style={TableStyle.submenuOverlay}>
                <View style={TableStyle.submenu}>
                  {Object.entries(modalidades).map(([mod, checked]) =>
                    renderCheckbox(
                      mod,
                      checked,
                      (val) =>
                        setModalidades((prev) => ({ ...prev, [mod]: val })),
                      mod
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={TableStyle.cardList}>
          {courses.length === 0 ? (
            <Text style={TableStyle.emptyText}>Nenhum Curso Encontrado</Text>
          ) : (
            courses.map((curso, idx) => (
              <View key={idx} style={TableStyle.cardContainer}>
                {curso.id && (
                  <TouchableOpacity
                    onPress={() => toggleCardExpansion(curso.id)}
                    style={TableStyle.card}
                  >
                    <Text style={TableStyle.cardTitle}>{curso.nome}</Text>
                    <Text style={TableStyle.cardSubtitle}>{curso.sigla}</Text>
                    <Text style={TableStyle.cardSubtitle}>{curso.codigo}</Text>
                  </TouchableOpacity>
                )}
                {expandedCard === curso.id && (
                  <View style={TableStyle.cardActionsContainer}>
                    <TouchableOpacity
                      style={[TableStyle.actionButton, TableStyle.editButton]}
                      onPress={() =>
                        curso.id &&
                        navigation.navigate("EditCourses", { id: curso.id })
                      }
                    >
                      <Icon name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[TableStyle.actionButton, TableStyle.deleteButton]}
                      onPress={() =>
                        showConfirmDialog({
                          message: `Deseja realmente excluir ${curso.nome}?`,
                          onConfirm: () => {
                            if (curso.id) handleDelete(curso.id);
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

      {courses.length > 0 && (
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
        labels={courseLabels}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    bottom: 38,
    right: 35,
    zIndex: 20,
  },
});

export default ListCoursesScreen;