import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { useProfessor } from "../../../context/ProfessorContext";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { deleteProfessor } from "../../../services/professors/professorService";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";

import { TableStyle } from "../../../style/TableStyle";

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

  const navigation = useNavigation<NavigationProp>()

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
      await deleteProfessor(id)
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

  return (
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
            <TouchableOpacity
              onPress={() => setShowCursos((prev) => !prev)}
            >
              <Text style={TableStyle.filterText}>Cursos ▼</Text>
            </TouchableOpacity>
            {showCursos && (
              <View style={TableStyle.submenuOverlay}>
                <View style={TableStyle.submenu}>
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
                      (val) => setTitulacoes((prev) => ({ ...prev, [tit]: val })),
                      tit
                    )
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={TableStyle.table}>
          {professors.length === 0 ? (<Text style={TableStyle.emptyText}>Nenhum Professor Encontrado</Text>) : (
            <>
              <View style={TableStyle.tableHeader}>
                <Text style={TableStyle.headerCell}>Nome</Text>
                <Text style={TableStyle.headerCell}>E-mail</Text>
                <Text style={TableStyle.headerCell}>Titulação</Text>
              </View>

              {professors.map((prof, idx) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={TableStyle.tableRow}
                    onPress={() => setExpandedRow(expandedRow === idx ? null : idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={TableStyle.cell}>{prof.nome}</Text>
                    <Text style={TableStyle.cell}>{prof.email}</Text>
                    <Text style={TableStyle.cell}>{prof.titulacao}</Text>
                  </TouchableOpacity>
                  {expandedRow === idx && (
                    <View style={TableStyle.optionsRow}>
                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() => {
                          const detalhes =
                            `👨‍🏫 Nome: ${prof.nome}\n✉️ Email: ${prof.email}\n🎓 Titulação: ${prof.titulacao}`;
                          alert(detalhes);
                        }}
                      >
                        <Text style={TableStyle.cleanOptionText}>🔎 Ver mais</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() => {
                          if (prof.id)
                            navigation.navigate(`EditProfessors`, { id: prof.id })
                        }}
                      >
                        <Text style={TableStyle.cleanOptionText}>📝 Editar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() =>
                          showConfirmDialog({
                            message: `Deseja realmente excluir ${prof.nome}?`,
                            onConfirm: () => { if (prof.id) handleDelete(prof.id) },
                          })}
                      >
                        <Text style={TableStyle.cleanOptionText}>🗑️ Remover</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                </View>
              ))
              }
              <View style={TableStyle.printButtonContainer}>
                <Button title="Imprimir 🖨️" onPress={handleImprimir} color="#6c757d" />
              </View>
            </>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListProfessorScreen;