"use client";

import React, { useState } from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput } from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";
import ListPicker from "../../../../components/atoms/ListPicker";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../../types/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";

export default function StepOne() {
  const navigation = useNavigation<NavigationProp>(); // Usa a tipagem correta

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [titulacao, setTitulacao] = useState("");
  const [numMatricula, setNumMatricula] = useState("");
  const [codUnidade, setCodUnidade] = useState("");

  const handleAdvance = () => {
    const partialDataProfessor = {
      name,
      email,
      titulacao,
      numMatricula,
      codUnidade,
    };

    //enviando o objeto do professor para a próxima fase do form(StepTwo)
    navigation.navigate("RegisterProfessorsStepTwo", { partialDataProfessor });
    console.log(partialDataProfessor);
  };

  return (
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={FormStyles.card} mode="elevated">
            <Card.Content>
              <Text style={FormStyles.title}>Cadastro de Professor</Text>

              <Text style={FormStyles.description}>
                Insira os dados do professor para registrá-lo no sistema
              </Text>

              <Text style={FormStyles.label}>Nome</Text>
              <TextInput
                placeholder="value"
                style={FormStyles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={FormStyles.label}>Email</Text>
              <TextInput
                placeholder="value"
                style={FormStyles.input}
                onChangeText={setEmail}
                value={email}
              />

              <Text style={FormStyles.label}>Titulação</Text>
              {/* Buscar as titulações dos professores e atribuir a lista, ou por ser estático, retornar diretamente*/}
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Exemplo1", "Exemplo2"]}
                onSelect={(titulacao) => setTitulacao(titulacao)}
              />

              <Text style={FormStyles.label}>Número de Matrícula</Text>
              <TextInput
                placeholder="value"
                style={FormStyles.input}
                onChangeText={setNumMatricula}
                value={numMatricula}
              />

              <Text style={FormStyles.label}>Código da Unidade</Text>
              <TextInput
                placeholder="value"
                style={FormStyles.input}
                onChangeText={setCodUnidade}
                value={codUnidade}
              />
            </Card.Content>

            <Card.Actions>
              <Button
                labelStyle={{ color: "white" }}
                style={FormStyles.button}
                onPress={handleAdvance}
              >
                Ir para a Próxima Etapa
              </Button>
            </Card.Actions>

            <ProgressBar progress={0.5} color={MD3Colors.neutral40} />
          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
