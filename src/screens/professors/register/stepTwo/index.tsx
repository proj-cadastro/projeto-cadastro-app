"use client";

import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput } from "react-native";
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  Checkbox,
} from "react-native-paper";

import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { RouteParamsProps } from "../../../../types/rootStackParamList ";

import { FormStyles } from "../../../../style/FormStyles";

export default function StepTwo() {
  const navigation = useNavigation();

  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepTwo">>();
  const { partialDataProfessor } = route.params;

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [lattes, setLattes] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [cursos, setCursos] = useState("");
  const [status, setStatus] = useState("");

  const [checked, setChecked] = useState(false);

  const handleSubmit = async () => {
    try {
      const professor = {
        lattes,
        referencia,
        observacoes,
        cursos,
        status,
        ...partialDataProfessor,
      };
      console.log(professor);

      navigation.navigate("RegisterProfessorsFinished" as never);
      //conversar com o service para enviar o objeto completo para a api
    } catch (error) {
      console.error(error);
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
              <TextInput
                placeholder="PES II - B"
                style={FormStyles.input}
                onChangeText={setReferencia}
                value={referencia}
              />

              <Text style={FormStyles.label}>Observações</Text>
              <TextInput
                placeholder="Professor de licença..."
                style={FormStyles.input}
                onChangeText={setObservacoes}
                value={observacoes}
              />

              <Text style={FormStyles.label}>Curso(s)</Text>
              {/* componentizar este parceiro, isolar a lógica de busca de cursos */}
              {/* como se consumisse um contexto de cursos, e depois pegasse seus nomes e atribuisse aos checkpoints, fazer um .map((curso))...*/}
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />

              <Text style={FormStyles.label}>Professor está ativo?</Text>
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Sim", "Não"]}
                onSelect={(status) => setStatus(status)}
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
