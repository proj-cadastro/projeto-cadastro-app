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
import { RouteParamsProps } from "../../../../types/rootStackParamListCurso"; 

import { FormStyles } from "../../../../style/FormStyles";

export default function StepTwo() {
  const navigation = useNavigation();

  const route = useRoute<RouteParamsProps<"RegisterCursosStepTwo">>();
  const { partialDataCurso } = route.params;

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [modelo, setModelo] = useState("");
  const [professores, setProfessores] = useState("");
  const [coordenador, setCoordenador] = useState("");
 

  const handleSubmit = async () => {
    try {
      const curso = {
        modelo,
        professores,
        coordenador,
        ...partialDataCurso,
      };
      console.log(curso);

      navigation.navigate("RegisterCursosFinished" as never);
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
                Insira os dados do curso para registrá-lo no sistema
              </Text>

              {/* body */}
              <Text style={FormStyles.label}>Modelo</Text>
              <TextInput
                placeholder="Modelo do curso"
                style={FormStyles.input}
                value={modelo}
                onChangeText={setModelo}
              />

              <Text style={FormStyles.label}>Professores</Text>
              {/* Buscar as titulações dos professores e atribuir a lista, ou por ser estático, retornar diretamente*/}
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Professor1", "Professor2"]}
                onSelect={(professores) => setProfessores(professores)}
              />

                            

              <Text style={FormStyles.label}>Coordenador</Text>
              {/* Buscar as titulações dos professores e atribuir a lista, ou por ser estático, retornar diretamente*/}
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Coordenador1"]}
                onSelect={(coordenador) => setCoordenador(coordenador)}
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
