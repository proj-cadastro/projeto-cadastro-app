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
import { Card, Button, ProgressBar, MD3Colors, Modal, Portal } from "react-native-paper";
import ListPicker from "../../../../components/atoms/ListPicker";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { useRoute, useNavigation } from "@react-navigation/native";
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

  const [lattes, setLattes] = useState(partialDataProfessor?.lattes || "");
  const [referencia, setReferencia] = useState(partialDataProfessor?.referencia || "");
  const [statusAtividade, setStatusAtividade] = useState(partialDataProfessor?.statusAtividade || "");
  const [observacoes, setObservacoes] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      setFieldErrors({});
      setMissingFields([]);
      await professorRegisterStep2Schema.validate(
        { lattes, referencia, observacoes, statusAtividade },
        { abortEarly: false }
      );
      const professor = {
        ...partialDataProfessor,
        lattes,
        referencia,
        observacoes,
        statusAtividade,
      };

      const response = await postProfessor(professor);

      if (response?.sucesso === false) {
        setModalMsg(
          response?.erro ||
          "Erro ao criar professor. Verifique os campos e tente novamente."
        );
        setModalVisible(true);
        return;
      }

      refreshProfessorsData();
      navigation.navigate("RegisterProfessorsFinished" as never);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        const missing: string[] = [];
        error.inner.forEach((err: any) => {
          if (err.path) {
            errors[err.path] = err.message;
            missing.push(err.message);
          }
        });
        setFieldErrors(errors);
        setMissingFields(missing);
        setModalMsg("");
        setModalVisible(true);
      } else {
        setModalMsg("Erro inesperado. Tente novamente.");
        setMissingFields([]);
        setModalVisible(true);
      }
      console.error(error.response?.data);
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
                  <Text style={FormStyles.title}>2º Etapa</Text>
                  <Text style={FormStyles.description}>
                    Insira os dados do professor para registrá-lo no sistema
                  </Text>


                  <Text style={FormStyles.label}>Lattes</Text>
                  {fieldErrors.lattes && (
                    <Text style={styles.errorText}>{fieldErrors.lattes}</Text>
                  )}
                  <TextInput
                    placeholder="ex: http://lattes.cnpq.br/7144753485915650"
                    style={[
                      FormStyles.input,
                      fieldErrors.lattes ? styles.inputError : null,
                    ]}
                    value={lattes}
                    onChangeText={setLattes}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />


                  <Text style={FormStyles.label}>Referência</Text>
                  {fieldErrors.referencia && (
                    <Text style={styles.errorText}>
                      {fieldErrors.referencia}
                    </Text>
                  )}
                  <ListPicker
                    items={Object.values(Referencia)}
                    selected={referencia}
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
                    selected={statusAtividade} // <-- Adicione esta prop
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
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={{
                backgroundColor: "white",
                padding: 20,
                margin: 20,
                borderRadius: 10,
              }}
            >
              <Text style={styles.modalTitle}>
                Erro ao cadastrar professor
              </Text>
              {missingFields.length > 0 ? (
                <>
                  <Text style={{ marginBottom: 10 }}>
                    Preencha corretamente os campos obrigatórios:
                  </Text>
                  {missingFields.map((msg, idx) => (
                    <Text key={idx} style={{ color: "red", marginBottom: 2 }}>
                      - {msg}
                    </Text>
                  ))}
                  <View style={{ height: 15 }} />
                </>
              ) : (
                <Text style={{ marginBottom: 35 }}>{modalMsg}</Text>
              )}
              <Button
                mode="contained"
                buttonColor={FormStyles.button.backgroundColor}
                labelStyle={{ color: "white" }}
                style={FormStyles.button}
                onPress={() => setModalVisible(false)}
              >
                Fechar
              </Button>
            </Modal>
          </Portal>

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
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
  },
});