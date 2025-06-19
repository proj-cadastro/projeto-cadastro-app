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
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp, RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";
import { Titulacao } from "../../../../enums/professors/professorEnum";
import { professorRegisterSchema } from "../../../../validations/professorsRegisterValidations";
import HamburgerMenu from "../../../../components/HamburgerMenu";
import { useThemeMode } from "../../../../context/ThemeContext"; // Importa o contexto do tema

export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepOne">>();
  const iaData = route.params?.iaData;

  const [nome, setNome] = useState(iaData?.nome || "");
  const [email, setEmail] = useState(iaData?.email || "");
  const [titulacao, setTitulacao] = useState(iaData?.titulacao || "");
  const [idUnidade, setIdUnidade] = useState(iaData?.idUnidade || "");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Usa o contexto do tema
  const { isDarkMode } = useThemeMode();

  const handleAdvance = () => {
    try {
      setFieldErrors({});
      professorRegisterSchema.validateSync(
        { nome, email, titulacao, idUnidade },
        { abortEarly: false }
      );
      navigation.navigate("RegisterProfessorsStepTwo", {
        partialDataProfessor: {
          nome,
          email,
          titulacao,
          idUnidade,
          referencia: iaData?.referencia,
          statusAtividade: iaData?.statusAtividade,
          lattes: iaData?.lattes,
        },
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
    <SafeAreaView style={[
      FormStyles.safeArea,
      { backgroundColor: isDarkMode ? "#181818" : "#fff" }
    ]}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <Button
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
          <Card style={[
            FormStyles.card,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" }
          ]} mode="elevated">
            <Card.Content>
              <Text style={[
                FormStyles.title,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Cadastro de Professor</Text>
              <Text style={[
                FormStyles.description,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>
                Insira os dados do professor para registrá-lo no sistema
              </Text>
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Nome</Text>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                placeholder="ex: José Maria da Silva"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                style={[
                  FormStyles.input,
                  { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
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
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Email</Text>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <TextInput
                placeholder="ex: jose.maria@fatec.sp.gov.br"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                style={[
                  FormStyles.input,
                  { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
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
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Titulação</Text>
              {fieldErrors.titulacao && (
                <Text style={styles.errorText}>{fieldErrors.titulacao}</Text>
              )}
              <ListPicker
                items={Object.values(Titulacao)}
                selected={titulacao}
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
              <Text style={[
                FormStyles.label,
                { color: isDarkMode ? "#fff" : "#000" }
              ]}>Código da Unidade</Text>
              {fieldErrors.idUnidade && (
                <Text style={styles.errorText}>{fieldErrors.idUnidade}</Text>
              )}
              <TextInput
                placeholder="ex: 301"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                style={[
                  FormStyles.input,
                  { width: "100%", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
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