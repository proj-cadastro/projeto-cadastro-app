import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useProfessor } from "../../../context/ProfessorContext";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { deleteProfessor } from "../../../services/professors/professorService";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

import { TableStyle } from "../../../style/TableStyle";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { InteractBtn } from "../../../components/atoms/InteractBtn";
import { shareDataToPdfFile } from "../../../services/file/fileService";

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

  const navigation = useNavigation<NavigationProp>();

  const { professors, refreshProfessorsData } = useProfessor();

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
      <Text style={[TableStyle.checkbox, checked && TableStyle.checked]}>
        {checked ? "☑" : "☐"}
      </Text>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  const toggleCardExpansion = (id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const handleShareData = async () => {
    try {
      console.log(professors)
      await shareDataToPdfFile(professors)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={TableStyle.container}>
        <View style={TableStyle.menuContainer}>
          <HamburgerMenu />
        </View>

        <ScrollView contentContainerStyle={TableStyle.scrollContent}>
          <Text style={TableStyle.title}>Professores</Text>

          <TextInput
            placeholder="Nome do Professor"
            value={nome}
            onChangeText={setNome}
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
                <Text style={TableStyle.filterText}>Titulação ▼</Text>
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
                            navigation.navigate('EditProfessors', {
                              id: prof.id,
                            });
                        }}
                      >
                        <Icon name="edit" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          TableStyle.actionButton,
                          { backgroundColor: "#007bff", justifyContent: "center", alignItems: "center" },
                        ]}
                        onPress={() => {
                          if (prof.id !== undefined) {
                            navigation.navigate('DetailsProfessors', { id: prof.id });
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

        { /* Se existirem professores a serem exibidos, habilita o compartilhamento*/}
        {professors.length > 0 &&
          <InteractBtn
            name="share"
            onPressFn={handleShareData}
          />}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ListProfessorScreen;


