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
import ListPicker from "../../../../components/atoms/ListPicker";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../../types/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";
import { Titulacao } from "../../../../enums/professors/professorEnum";
import { professorRegisterSchema } from "../../../../validations/professorsRegisterValidations";

export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [titulacao, setTitulacao] = useState(Titulacao.MESTRE);
  const [idUnidade, setIdUnidade] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleAdvance = () => {
    try {
      setFieldErrors({});
      professorRegisterSchema.validateSync(
        { nome, email, titulacao, idUnidade },
        { abortEarly: false }
      );
      const partialDataProfessor = {
        nome,
        email,
        titulacao,
        idUnidade,
      };
      navigation.navigate("RegisterProfessorsStepTwo", {
        partialDataProfessor,
      });
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
            <Card.Content>
              <Text style={FormStyles.title}>Cadastro de Professor</Text>

              <Text style={FormStyles.description}>
                Insira os dados do professor para registrá-lo no sistema
              </Text>

              <Text style={FormStyles.label}>Nome</Text>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                placeholder="value"
                style={[
                  FormStyles.input,
                  fieldErrors.nome ? styles.inputError : null,
                ]}
                value={nome}
                onChangeText={(text) => {
                  setNome(text);
                  if (fieldErrors.nome)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.nome;
                      return updated;
                    });
                }}
              />

              <Text style={FormStyles.label}>Email</Text>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <TextInput
                placeholder="value"
                style={[
                  FormStyles.input,
                  fieldErrors.email ? styles.inputError : null,
                ]}
                onChangeText={(text) => {
                  setEmail(text);
                  if (fieldErrors.email)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.email;
                      return updated;
                    });
                }}
                value={email}
              />

              <Text style={FormStyles.label}>Titulação</Text>
              {fieldErrors.titulacao && (
                <Text style={styles.errorText}>{fieldErrors.titulacao}</Text>
              )}
              <ListPicker
                items={Object.values(Titulacao)}
                onSelect={(titulacao: Titulacao) => {
                  setTitulacao(titulacao);
                  if (fieldErrors.titulacao)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.titulacao;
                      return updated;
                    });
                }}
              />

              <Text style={FormStyles.label}>Código da Unidade</Text>
              {fieldErrors.idUnidade && (
                <Text style={styles.errorText}>{fieldErrors.idUnidade}</Text>
              )}
              <TextInput
                placeholder="value"
                style={[
                  FormStyles.input,
                  fieldErrors.idUnidade ? styles.inputError : null,
                ]}
                onChangeText={(text) => {
                  setIdUnidade(text);
                  if (fieldErrors.idUnidade)
                    setFieldErrors((prev) => {
                      const updated = { ...prev };
                      delete updated.idUnidade;
                      return updated;
                    });
                }}
                value={idUnidade}
              />
            </Card.Content>

            <Card.Actions>
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
