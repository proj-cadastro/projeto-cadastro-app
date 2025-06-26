import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TextInput,
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card } from "react-native-paper";
import { RouteParamsProps } from "../../../routes/rootStackParamList ";
import ListPicker from "../../../components/atoms/ListPicker";
import { useCourse } from "../../../context/CourseContext";
import { Course } from "../../../types/courses";
import { updateCourse } from "../../../services/course/cursoService";
import { ModeloCurso } from "../../../enums/courses/courseEnum";
import { useProfessor } from "../../../context/ProfessorContext";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

const EditCourseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteParamsProps<"EditCourses">>();
  const { id } = route.params;

  const { getCourseById } = useCourse()
  const course = getCourseById(Number(id));

  const { professors, getProfessorById } = useProfessor()

  const [formData, setFormData] = useState<Course | null>(null);

  // Usa o contexto do tema
  const { isDarkMode } = useThemeMode();

  useEffect(() => {
    if (course) setFormData(course);
  }, [course]);

  const handleUpdate = async () => {
    try {
      if (formData) await updateCourse(id, formData)
      navigation.navigate("ListCourses" as never)
    } catch (error: any) {
      console.error(error.response?.data?.mensagem || error.message);
    }
  };

  const fetchCourseCoordinator = () => {
    if (formData?.coordenadorId) return getProfessorById(formData.coordenadorId)
  }

  if (!formData) {
    return (
      <SafeAreaView style={[
        FormStyles.safeArea,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" }
      ]}>
        <Text style={[
          FormStyles.title,
          { color: isDarkMode ? "#fff" : "#000" }
        ]}>Curso não encontrado</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[
      FormStyles.safeArea,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={FormStyles.goBackButton}
        labelStyle={{ color: "white" }}
      >
        Voltar
      </Button>

      <View style={FormStyles.container}>
        <Text style={[
          FormStyles.title,
          { color: isDarkMode ? "#fff" : "#000" }
        ]}>Atualizar {course?.nome}</Text>
        <Text style={[
          FormStyles.description,
          { color: isDarkMode ? "#fff" : "#000" }
        ]}>
          Modifique os dados conforme necessário 🙂
        </Text>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[
            FormStyles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" }
          ]}>
            <Card.Content>
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Nome</Text>
              <TextInput
                style={[
                  FormStyles.input,
                  { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" }
                ]}
                placeholder="Digite o nome"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.nome}
                onChangeText={(e) => setFormData({ ...formData, nome: e })}
              />

              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Sigla </Text>
              <TextInput
                style={[
                  FormStyles.input,
                  { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" }
                ]}
                placeholder="Ex: DSM"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.sigla}
                onChangeText={(e) =>
                  setFormData({ ...formData, sigla: e })
                }
              />

              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Código</Text>
              <TextInput
                style={[
                  FormStyles.input,
                  { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" }
                ]}
                placeholder="ex: 412"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={formData.codigo}
                onChangeText={(e) => setFormData({ ...formData, codigo: e })}
              />

              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Modelo</Text>
              <ListPicker
                items={Object.values(ModeloCurso)}
                selected={formData.modelo}
                onSelect={(modelo: ModeloCurso) =>
                  setFormData({ ...formData, modelo })
                }
                backgroundColor={isDarkMode ? "#202020" : "#fff"}
              />

              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Coordenador</Text>
              <ListPicker
                items={professors}
                selected={fetchCourseCoordinator()}
                onSelect={(coordenadorId: number) => setFormData({ ...formData, coordenadorId })}
                getLabel={(professor) => professor.nome}
                getValue={(professor) => professor.id}
                backgroundColor={isDarkMode ? "#202020" : "#fff"}
              />

            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                onPress={handleUpdate}
                style={FormStyles.button}
                labelStyle={{ color: "white" }}
              >
                Atualizar
              </Button>
            </Card.Actions>
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditCourseScreen;