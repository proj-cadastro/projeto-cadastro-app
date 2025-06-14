"use client";

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Card, Button, ProgressBar, MD3Colors } from "react-native-paper";

import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";

import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { RouteParamsProps } from "../../../../routes/rootStackParamList ";

import { FormStyles } from "../../../../style/FormStyles";
import { postProfessor } from "../../../../services/professors/professorService";
import {
  Referencia,
  StatusAtividade,
} from "../../../../enums/professors/professorEnum";
import { useProfessor } from "../../../../context/ProfessorContext";
import { professorRegisterStep2Schema } from "../../../../validations/professorsRegisterValidations";

export default function ProfessorFormStepTwo() {
  const navigation = useNavigation();

  const { refreshProfessorsData } = useProfessor();

  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepTwo">>();
  const { partialDataProfessor } = route.params;

  const [lattes, setLattes] = useState("");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [statusAtividade, setStatusAtividade] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    try {
      setFieldErrors({});
      professorRegisterStep2Schema.validateSync(
        { lattes, referencia, observacoes, professorAtivo: statusAtividade },
        { abortEarly: false }
      );
      const professor = {
        lattes,
        referencia,
        observacoes,
        statusAtividade,
        ...partialDataProfessor,
      };

      await postProfessor(professor);
      refreshProfessorsData();

      navigation.navigate("RegisterProfessorsFinished" as never);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      }
      console.error(error.response.data);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  {fieldErrors.lattes && (
                    <Text style={styles.errorText}>{fieldErrors.lattes}</Text>
                  )}
                  <TextInput
                    placeholder="https://lattesexemplo.com"
                    style={[
                      FormStyles.input,
                      fieldErrors.lattes ? styles.inputError : null,
                    ]}
                    value={lattes}
                    onChangeText={setLattes}
                  />

                  <Text style={FormStyles.label}>Referência</Text>
                  {fieldErrors.referencia && (
                    <Text style={styles.errorText}>
                      {fieldErrors.referencia}
                    </Text>
                  )}
                  <ListPicker
                    items={Object.values(Referencia)}
                    onSelect={(ref: Referencia) => setReferencia(ref)}
                  />

                  <Text style={FormStyles.label}>Observações</Text>
                  {fieldErrors.observacoes && (
                    <Text style={styles.errorText}>
                      {fieldErrors.observacoes}
                    </Text>
                  )}
                  <TextInput
                    placeholder="Professor de licença..."
                    style={FormStyles.input}
                    onChangeText={setObservacoes}
                    value={observacoes}
                  />

                  <Text style={FormStyles.label}>Professor está ativo?</Text>
                  {fieldErrors.professorAtivo && (
                    <Text style={styles.errorText}>
                      {fieldErrors.professorAtivo}
                    </Text>
                  )}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
