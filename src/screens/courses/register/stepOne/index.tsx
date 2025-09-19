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
import { coursesRegisterSchema, siglaValidationSchema, codigoValidationSchema } from "../../../../validations/coursesRegisterValidations";
import { NavigationProp } from "../../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../../context/ThemeContext";
import { useToast } from "../../../../utils/useToast";
import Toast from "../../../../components/atoms/Toast";

export default function StepOne() {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [codigo, setCodigo] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const { isDarkMode } = useThemeMode();
  const { toast, showWarning, hideToast } = useToast();

  const validateSigla = (value: string) => {
    if (value.length > 0) {
      try {
        siglaValidationSchema.validateSync(value);
      } catch (error: any) {
        showWarning(error.message);
      }
    }
  };

  const validateCodigo = (value: string) => {
    if (value.length > 0) {
      try {
        codigoValidationSchema.validateSync(value);
      } catch (error: any) {
        showWarning(error.message);
      }
    }
  };

  const handleSiglaChange = (value: string) => {
    setSigla(value);
    validateSigla(value);
  };

  const handleCodigoChange = (value: string) => {
    setCodigo(value);
    validateCodigo(value);
  };

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
    <SafeAreaView style={[
      FormStyles.safeArea,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <View style={[FormStyles.container, styles.centerContainer]}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardWrapper}>
            <Card style={[
              FormStyles.card,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" }
            ]} mode="elevated">
              <Card.Content style={{ flex: 1 }}>
                <Text style={[
                  FormStyles.title,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}>Cadastro de Curso</Text>

                <Text style={[
                  FormStyles.description,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}>
                  Insira os dados do Curso para registrá-lo no sistema
                </Text>

                <Text style={[
                  FormStyles.label,
                  { color: isDarkMode ? "#fff" : "#000" }
                ]}>Nome do Curso</Text>
                {fieldErrors.nome && (
                  <Text style={styles.errorText}>{fieldErrors.nome}</Text>
                )}
                <TextInput
                  placeholder="Nome do Curso"
                  placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                  style={[
                    FormStyles.input,
                    { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    fieldErrors.nome ? styles.inputError : null,
                  ]}
                  value={nome}
                  onChangeText={setNome}
                />

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" }
                    ]}>Sigla</Text>
                    {fieldErrors.sigla && (
                      <Text style={styles.errorText}>{fieldErrors.sigla}</Text>
                    )}
                    <TextInput
                      placeholder="Sigla"
                      placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                      style={[
                        FormStyles.input,
                        { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                        fieldErrors.sigla ? styles.inputError : null,
                      ]}
                      onChangeText={handleSiglaChange}
                      value={sigla}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[
                      FormStyles.label,
                      { color: isDarkMode ? "#fff" : "#000" }
                    ]}>Código</Text>
                    {fieldErrors.codigo && (
                      <Text style={styles.errorText}>{fieldErrors.codigo}</Text>
                    )}
                    <TextInput
                      placeholder="Código"
                      placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                      style={[
                        FormStyles.input,
                        { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                        fieldErrors.codigo ? styles.inputError : null,
                      ]}
                      onChangeText={handleCodigoChange}
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

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
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