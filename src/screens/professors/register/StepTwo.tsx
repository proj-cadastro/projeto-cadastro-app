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
import {
  Card,
  Button,
  ProgressBar,
  MD3Colors,
  Checkbox,
} from "react-native-paper";
import ListPicker from "../../../components/atoms/ListPicker";

const screenHeight = Dimensions.get("window").height;

export default function StepTwo() {
  const [lattes, setLattes] = useState("");
  const [referencia, setReferencia] = useState("");
  //variaveis que estão com TROCAR, precisam ter seus nomes trocados, estes nao estao conferidos com o que a api trabalha na requisicao
  const [observacoes, setObservacoes] = useState("");
  const [cursos, setCursos] = useState("");
  const [status, setStatus] = useState("");

  const [checked, setChecked] = useState(false);

  const handleSubmit = async () => {
    try {
      //conversar com o service para enviar o objeto completo para a api
    } catch (error) {
      console.error(error)
    }
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
                2º Etapa
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

              <Text style={styles.label}>Lattes</Text>
              <TextInput
                placeholder="https://lattesexemplo.com"
                style={styles.input}
                value={lattes}
                onChangeText={setLattes}
              />

              <Text style={styles.label}>Referência</Text>
              <TextInput
                placeholder="PES II - B"
                style={styles.input}
                onChangeText={setReferencia}
                value={referencia}
              />

              <Text style={styles.label}>Curso(s)</Text>

              {/* componentizar este parceiro, isolar a lógica de busca de cursos */}
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />

              <Text style={styles.label}>O professor está ativo?</Text>
              {/* pegamos o valor do picker via uma funcao na props que nos retorna o valor selecionado ao clicar */}
              <ListPicker
                items={["Sim", "Não"]}
                onSelect={(status) => setStatus(status)}
              />
            </Card.Content>

            <Card.Actions>
              <Button
                labelStyle={{ color: "white" }}
                style={styles.button}
                onPress={handleSubmit}
              >
                Finalizar
              </Button>
            </Card.Actions>

            <ProgressBar progress={1} color={MD3Colors.neutral40} />
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
