"use client";

import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text } from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
} from "react-native-paper";

import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { RouteParamsProps } from "../../../../types/rootStackParamListCurso";

import { FormStyles } from "../../../../style/FormStyles";
import { postCourse } from "../../../../services/course/cursoService";
import { ModeloCurso } from "../../../../enums/courses/courseEnum";
import { useCourse } from "../../../../context/CourseContext";
import { useProfessor } from "../../../../context/ProfessorContext";

export default function StepTwo() {
  const navigation = useNavigation();

  const { refreshCoursesData } = useCourse()
  const { professors } = useProfessor()

  const route = useRoute<RouteParamsProps<"RegisterCursosStepTwo">>();
  const { partialDataCurso } = route.params;

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [modelo, setModelo] = useState<ModeloCurso>(ModeloCurso.PRESENCIAL);
  const [coordenadorId, setCoordenadorId] = useState(1);


  const handleSubmit = async () => {
    try {
      const curso = {
        modelo,
        coordenadorId,
        ...partialDataCurso,
      };
      console.log(curso);

      await postCourse(curso)
      refreshCoursesData()
      navigation.navigate("RegisterCursosFinished" as never);
      //conversar com o service para enviar o objeto completo para a api
    } catch (error: any) {
      console.error(error.response.data.mensagem);
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

      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[FormStyles.card]} mode="elevated">
            <Card.Content>
              {/* header */}
              <Text style={FormStyles.title}>2º Etapa</Text>

              <Text style={FormStyles.description}>
                Insira os dados do curso para registrá-lo no sistema
              </Text>

              {/* body */}
              <ListPicker
                items={Object.values(ModeloCurso)}
                onSelect={(modelo) => setModelo(modelo)}
              />

              <Text style={FormStyles.label}>Coordenador</Text>

              <ListPicker
                items={professors}
                onSelect={(id) => setCoordenadorId(id)}
                getLabel={(prof) => prof.nome}
                getValue={(prof) => prof.id}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
