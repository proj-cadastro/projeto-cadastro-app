"use client";

import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput } from "react-native";
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
import { RouteParamsProps } from "../../../../types/rootStackParamList ";

import { FormStyles } from "../../../../style/FormStyles";
import { postProfessor } from "../../../../services/professors/professorService";
import { Referencia, StatusAtividade } from "../../../../enums/professors/professorEnum";
import { useProfessor } from "../../../../context/ProfessorContext";

export default function ProfessorFormStepTwo() {
  const navigation = useNavigation();

  const { refreshProfessorsData } = useProfessor()

  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepTwo">>();
  const { partialDataProfessor } = route.params;

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [lattes, setLattes] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [statusAtividade, setStatusAtividade] = useState("");


  const handleSubmit = async () => {
    try {
      const professor = {
        lattes,
        referencia,
        observacoes,
        statusAtividade,
        ...partialDataProfessor,
      };
      console.log(professor);

      await postProfessor(professor)
      refreshProfessorsData()

      navigation.navigate("RegisterProfessorsFinished" as never);
      //conversar com o service para enviar o objeto completo para a api 

    } catch (error: any) {
      console.error(error.response.data);
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
                Insira os dados do professor para registrá-lo no sistema
              </Text>

              {/* body */}
              <Text style={FormStyles.label}>Lattes</Text>
              <TextInput
                placeholder="https://lattesexemplo.com"
                style={FormStyles.input}
                value={lattes}
                onChangeText={setLattes}
              />

              <Text style={FormStyles.label}>Referência</Text>
              <ListPicker
                items={Object.values(Referencia)}
                onSelect={(ref: Referencia) => setReferencia(ref)}
              />

              <Text style={FormStyles.label}>Observações</Text>
              <TextInput
                placeholder="Professor de licença..."
                style={FormStyles.input}
                onChangeText={setObservacoes}
                value={observacoes}
              />



              <Text style={FormStyles.label}>Professor está ativo?</Text>
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={Object.values(StatusAtividade)}
                onSelect={(status) => setStatusAtividade(status)}
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
