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
import { FormStyles } from "../../../../style/FormStyles";
import { coursesRegisterSchema } from "../../../../validations/coursesRegisterValidations";
import { NavigationProp } from "../../../../routes/rootStackParamList ";

export default function StepOne() {
  const navigation = useNavigation<NavigationProp>();

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

      navigation.navigate("RegisterCourseStepTwo", { partialDataCurso });
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
      <View style={[FormStyles.container, styles.centerContainer]}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardWrapper}>
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
});