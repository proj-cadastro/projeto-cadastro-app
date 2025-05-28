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
import { useCourse } from "../../../context/CourseContext";
import { deleteCourse } from "../../../services/course/cursoService";
import { showConfirmDialog } from "../../../components/atoms/ConfirmAlert";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useNavigation } from "@react-navigation/native";
import { TableStyle } from "../../../style/TableStyle";
import { useProfessor } from "../../../context/ProfessorContext";

const ListCoursesScreen = () => {

  const navigation = useNavigation<NavigationProp>()

  const [nome, setNome] = useState("");

  const [modalidades, setModalidades] = useState({
    Presencial: true,
    Híbrido: true,
    EAD: false,
  });
  const [showModalidades, setShowModalidades] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const { courses, refreshCoursesData } = useCourse()
  const { getProfessorById } = useProfessor()

  const handleFiltrar = () => {
    // lógica de filtragem aqui (se quiser ajuda com isso, posso montar também)
  };

  const handleImprimir = () => {
    // lógica de impressão ou exportação
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id)
      refreshCoursesData()
      console.log(courses.length)

    } catch (error: any) {
      console.error(error.response.data.mensagem)
    }
  }

  useEffect(() => { refreshCoursesData() }, [])

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
        <Text style={TableStyle.title}>Cursos</Text>

        <TextInput
          placeholder="Nome do Curso"
          value={nome}
          onChangeText={setNome}
          style={TableStyle.input}
        />

        <View style={TableStyle.filterRow}>
          <View style={TableStyle.filterGroup}>
            <TouchableOpacity onPress={() => setShowModalidades((prev) => !prev)}>
              <Text style={TableStyle.filterText}>Modalidades ▼</Text>
            </TouchableOpacity>
            {showModalidades && (
              <View style={TableStyle.submenuOverlay}>
                <View style={TableStyle.submenu}>
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

        <View style={TableStyle.table}>
          {courses.length === 0 ? (<Text style={TableStyle.emptyText}>Nenhum Curso Encontrado</Text>) : (
            <>
              <View style={TableStyle.tableHeader}>
                <Text style={TableStyle.headerCell}>Nome</Text>
                <Text style={TableStyle.headerCell}>Sigla</Text>
                <Text style={TableStyle.headerCell}>Código</Text>
              </View>

              {courses.map((curso, idx) => (
                <View key={idx}>
                  <TouchableOpacity
                    style={TableStyle.tableRow}
                    onPress={() => setExpandedRow(expandedRow === idx ? null : idx)}
                    activeOpacity={0.7}
                  >
                    <Text style={TableStyle.cell}>{curso.nome}</Text>
                    <Text style={TableStyle.cell}>{curso.sigla}</Text>
                    <Text style={TableStyle.cell}>{curso.codigo}</Text>
                  </TouchableOpacity>
                  {expandedRow === idx && (
                    <View style={TableStyle.optionsRow}>
                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() => {
                          const coordenador = getProfessorById(curso.coordenadorId)
                          const detalhes =
`
🔠 Nome: ${curso.nome}
🔤 Sigla: ${curso.sigla}
#️⃣ Código: ${curso.codigo}
🧩 Modelo: ${curso.modelo}
🧑‍🏫 Coordenador: ${coordenador?.nome || "Não informado"}
`;
                          alert(detalhes)
                        }}
                      >
                        <Text style={TableStyle.cleanOptionText}>🔎 Ver mais</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() => { if (curso.id) navigation.navigate("EditCourses", { id: curso.id }) }}
                      >
                        <Text style={TableStyle.cleanOptionText}>📝 Editar</Text>

                      </TouchableOpacity>
                      <TouchableOpacity
                        style={TableStyle.cleanOptionBtn}
                        onPress={() =>
                          showConfirmDialog({
                            message: `Deseja realmente excluir ${curso.nome}?`,
                            onConfirm: () => { if (curso.id) handleDelete(curso.id) },
                          })}
                      >
                        <Text style={TableStyle.cleanOptionText}>🗑️ Remover</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
              <View style={TableStyle.printButtonContainer}>
                <Button title="Imprimir 🖨️" onPress={handleImprimir} color="#6c757d" />
              </View>
            </>)}

        </View>


      </ScrollView>
    </SafeAreaView>

  );
};

export default ListCoursesScreen;