"use client";

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";
import ListPicker from "../../../components/atoms/ListPicker";

const screenHeight = Dimensions.get("window").height;

export default function StepOne() {

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [titulacao, setTitulacao] = useState("");
  const [numMatricula, setNumMatricula] = useState("");
  const [codUnidade, setCodUnidade] = useState("");


  const handleAdvance = () => {
    //precisa jogar este pessoal para a próxima fase do form
    const aux = { name, email, titulacao, numMatricula, codUnidade }
    
    console.log(aux)
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[styles.card]} mode="elevated">
            <Card.Content>
              <Text style={{ fontWeight: "bold", color: "#333", fontSize: 25 }}>
                Cadastro de Professor
              </Text>

              <Text
                style={{
                  color: "#757575",
                  marginTop: 4,
                  fontSize: 15,
                }}
              >
                Insira os dados do professor para registrá-lo no sistema
              </Text>


              <Text style={styles.label}>Nome</Text>
              <TextInput
                placeholder="value"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="value"
                style={styles.input}
                onChangeText={setEmail}
                value={email}
              />

              <Text style={styles.label}>Titulação</Text>
              {/* Buscar as titulações dos professores e atribuir a lista, ou por ser estático, retornar diretamente*/}
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Exemplo1", "Exemplo2"]}
                onSelect={(titulacao) => setTitulacao(titulacao)}
              />

              <Text style={styles.label}>Número de Matrícula</Text>
              <TextInput
                placeholder="value"
                style={styles.input}
                onChangeText={setNumMatricula}
                value={numMatricula}
              />

              <Text style={styles.label}>Código da Unidade</Text>
              <TextInput
                placeholder="value"
                style={styles.input}
                onChangeText={setCodUnidade}
                value={codUnidade}
              />
            </Card.Content>

            <Card.Actions>
              <Button
                labelStyle={{ color: "white" }}
                style={styles.button}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: screenHeight * 0.8, // 80% da altura da tela fixa
    width: "95%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
  },
  input: {
    borderColor: "#D9D9D9",
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#444",
    width: "100%",
    borderRadius: 12,
    borderWidth: 0,
  },
});
