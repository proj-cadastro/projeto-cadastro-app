"use client";

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StyleSheet,
  Modal,
} from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  TextInput,
} from "react-native-paper";

import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import AddMateriaModal from "../../../../components/modals/AddMateriaModal";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

import { FormStyles } from "../../../../style/FormStyles";
import { postCourse } from "../../../../services/course/cursoService";
import { ModeloCurso } from "../../../../enums/courses/courseEnum";
import { useCourse } from "../../../../context/CourseContext";
import { useProfessor } from "../../../../context/ProfessorContext";
import { coursesRegisterStep2Schema } from "../../../../validations/coursesRegisterValidations";
import { RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { Materia } from "../../../../types/materia";

export default function StepTwo() {
  const navigation = useNavigation();

  const { refreshCoursesData } = useCourse();
  const { professors } = useProfessor();

  const route = useRoute<RouteParamsProps<"RegisterCourseStepTwo">>();
  const { partialDataCurso } = route.params;

  const [modelo, setModelo] = useState<ModeloCurso>();
  const [coordenadorId, setCoordenadorId] = useState();

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [isMateriaModalVisible, setMateriaModalVisible] = useState(false);
  const [materias, setMaterias] = useState<Materia[]>([]);

  const handleAddMateria = (materia: Materia) => {
    setMaterias([...materias, materia]);
  };

  const handleSubmit = async () => {
    try {
      setFieldErrors({});
      coursesRegisterStep2Schema.validateSync(
        { modelo, coordenadorId },
        { abortEarly: false }
      );
      const curso = {
        modelo,
        coordenadorId,
        materias,
        ...partialDataCurso,
      };

      await postCourse(curso);
      refreshCoursesData();
      navigation.navigate("RegisterCursosFinished" as never);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      }
      console.error(error.response?.data?.mensagem);
    }
  };

  return (
    <SafeAreaView style={FormStyles.safeArea}>
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
      <View style={[FormStyles.container, styles.centerContainer]}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardWrapper}>
            <Card style={[FormStyles.card]} mode="elevated">
              <Card.Content>
                <Text style={FormStyles.title}>2º Etapa</Text>

                <Text style={FormStyles.description}>
                  Insira os dados do curso para registrá-lo no sistema
                </Text>

                <Text style={FormStyles.label}>Modalidade</Text>
                {fieldErrors.modelo && (
                  <Text style={styles.errorText}>{fieldErrors.modelo}</Text>
                )}
                <ListPicker
                  items={Object.values(ModeloCurso)}
                  onSelect={(modelo) => {
                    setModelo(modelo);
                    if (fieldErrors.modelo)
                      setFieldErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.modelo;
                        return updated;
                      });
                  }}
                />

                <Text style={FormStyles.label}>Coordenador</Text>
                {fieldErrors.coordenadorId && (
                  <Text style={styles.errorText}>
                    {fieldErrors.coordenadorId}
                  </Text>
                )}
                <ListPicker
                  items={professors}
                  onSelect={(id) => {
                    setCoordenadorId(id);

                    if (fieldErrors.coordenadorId)
                      setFieldErrors((prev) => {
                        const updated = { ...prev };
                        delete updated.coordenadorId;
                        return updated;
                      });
                  }}
                  getLabel={(prof) => prof.nome}
                  getValue={(prof) => prof.id}
                />
                <Text style={FormStyles.label}>Matérias Adicionadas</Text>
                {materias.map((materia, index) => (
                  <Text key={index} style={styles.materiaItem}>
                    {materia.nome} - {materia.cargaHoraria}h
                  </Text>
                ))}

                <Button
                  mode="outlined"
                  onPress={() => setMateriaModalVisible(true)}
                  style={{ marginVertical: 10 }}
                >
                  Adicionar Matéria
                </Button>

                <AddMateriaModal
                  visible={isMateriaModalVisible}
                  onClose={() => setMateriaModalVisible(false)}
                  onAddMateria={handleAddMateria}
                  professors={professors}
                />
              </Card.Content>

              <Card.Actions>
                <Button
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={handleSubmit}
                >
                  Finalizar
                </Button>
              </Card.Actions>

              <ProgressBar progress={0.8} color={MD3Colors.neutral40} />
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    width: "96%",
    alignSelf: "center",
    justifyContent: "center",
    flex: 1,
  },
  materiaItem: {
    fontSize: 14,
    marginVertical: 5,
  },
});
