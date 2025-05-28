"use client";

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../../types/rootStackParamListCurso";
import { FormStyles } from "../../../../style/FormStyles";
import { coursesRegisterSchema } from "../../../../validations/coursesRegisterValidations";

export default function StepOne() {
  const navigation = useNavigation<NavigationProp>(); // Usa a tipagem correta

  //necessário conferir os reqs da api, para ver se está batendo com o que estamos armazenando...
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleAdvance = () => {
    try {
      setFieldErrors({});
      coursesRegisterSchema.validateSync(
        { nome, sigla, codigo },
        { abortEarly: false }
      );
      const partialDataCurso = {
        nome,
        sigla,
        codigo,
      };

      //enviando o objeto do curso para a próxima fase do form(StepTwo)
      navigation.navigate("RegisterCursosStepTwo", { partialDataCurso });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      }
    }
  };

  return (
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={FormStyles.card} mode="elevated">
            <Card.Content style={{ flex: 1 }}>
              <Text style={FormStyles.title}>Cadastro de Curso</Text>

              <Text style={FormStyles.description}>
                Insira os dados do Curso para registrá-lo no sistema
              </Text>

              <Text style={FormStyles.label}>Nome do Curso</Text>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                placeholder="Nome do Curso"
                style={[
                  FormStyles.input,
                  fieldErrors.nome ? styles.inputError : null,
                ]}
                value={nome}
                onChangeText={setNome}
              />

              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={FormStyles.label}>Sigla</Text>
                  {fieldErrors.sigla && (
                    <Text style={styles.errorText}>{fieldErrors.sigla}</Text>
                  )}
                  <TextInput
                    placeholder="Sigla"
                    style={[
                      FormStyles.input,
                      fieldErrors.sigla ? styles.inputError : null,
                    ]}
                    onChangeText={setSigla}
                    value={sigla}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={FormStyles.label}>Código</Text>
                  {fieldErrors.codigo && (
                    <Text style={styles.errorText}>{fieldErrors.codigo}</Text>
                  )}
                  <TextInput
                    placeholder="Código"
                    style={[
                      FormStyles.input,
                      fieldErrors.codigo ? styles.inputError : null,
                    ]}
                    onChangeText={setCodigo}
                    value={codigo}
                  />
                </View>
              </View>
            </Card.Content>

            <Card.Actions style={{ marginTop: "auto" }}>
              <Button
                labelStyle={{ color: "white" }}
                style={FormStyles.button}
                onPress={handleAdvance}
              >
                Avançar
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
});
