"use client";

import React, { useState, useEffect } from "react";
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import locationAnimation from "../../../../../assets/location-icon.json";
import { UnitSuggestionButton } from "../../../../components/UnitSuggestionButton";
import { SuggestionSwitch } from "../../../../components/SuggestionSwitch";
import { sugerirProfessorIA } from "../../../../services/ia/iaService";
import { FieldSuggestionButton } from "../../../../components/FieldSuggestionButton";

import { useThemeMode } from "../../../../context/ThemeContext"; // Importa o contexto do tema


export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepOne">>();
  const iaData = route.params?.iaData;

  const [nome, setNome] = useState(iaData?.nome || "");
  const [email, setEmail] = useState(iaData?.email || "");
  const [titulacao, setTitulacao] = useState(iaData?.titulacao || "");
  const [idUnidade, setIdUnidade] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [unidadeSugerida, setUnidadeSugerida] = useState<{ id: string; nome: string } | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionEnabled, setSuggestionEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState<{ nome?: string; email?: string; titulacao?: string }>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;
    const fetchInitialSuggestions = async () => {
      if (!suggestionEnabled) {
        setSuggestions({});
        return;
      }
      setLoadingSuggestions(true);
      try {
        const partial: Record<string, any> = {};
        if (nome) partial.nome = nome;
        if (email) partial.email = email;
        if (titulacao) partial.titulacao = titulacao;
        const data = await sugerirProfessorIA(partial);
        if (isMounted) {
          timeout = setTimeout(() => {
            setSuggestions(data);
          }, 600);
        }
      } catch {
        if (isMounted) setSuggestions({});
      } finally {
        if (isMounted) setLoadingSuggestions(false);
      }
    };
    fetchInitialSuggestions();
    return () => {
      isMounted = false;
      if (timeout) clearTimeout(timeout);
    };
  }, [suggestionEnabled]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (suggestionEnabled) {
      AsyncStorage.getItem("@unidade_sugerida").then((data) => {
        if (data) {
          try {
            const unidade = JSON.parse(data);
            timeout = setTimeout(() => {
              setUnidadeSugerida({ id: unidade.id, nome: unidade.nome });
              setShowSuggestion(true);
            }, 600);
          } catch { }
        }
      });
    } else {
      setShowSuggestion(false);
    }
    return () => clearTimeout(timeout);
  }, [suggestionEnabled]);

  const fetchSuggestions = async (fieldChanged: string, value: string) => {
    if (!suggestionEnabled) return;
    setLoadingSuggestions(true);
    try {
      const partial: Record<string, any> = {};
      if (fieldChanged === "nome" && value) partial.nome = value;
      else if (nome) partial.nome = nome;
      if (fieldChanged === "email" && value) partial.email = value;
      else if (email) partial.email = email;
      if (fieldChanged === "titulacao" && value) partial.titulacao = value;
      else if (titulacao) partial.titulacao = titulacao;
      const data = await sugerirProfessorIA(partial);
      setSuggestions(data);
    } catch (e) {
      setSuggestions({});
    } finally {
      setLoadingSuggestions(false);
    }
  };

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
        suggestionEnabled,
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

              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    !nome && suggestions.nome && suggestionEnabled
                      ? suggestions.nome
                      : "ex: José Maria da Silva"
                  }
                  style={[
                    FormStyles.input,
                    { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    styles.inputFlex,
                    fieldErrors.nome ? styles.inputError : null,
                    !nome && suggestions.nome && suggestionEnabled ? styles.suggestionPlaceholder : null,
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
                  onBlur={() => fetchSuggestions("nome", nome)}
                  placeholderTextColor={
                    !nome && suggestions.nome && suggestionEnabled
                      ? "#D32719"
                      : isDarkMode
                        ? "#aaa"
                        : "#888"
                  }

                />
                {!nome && suggestions.nome && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setNome(suggestions.nome!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Email</Text>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    !email && suggestions.email && suggestionEnabled
                      ? suggestions.email
                      : "ex: jose.maria@fatec.sp.gov.br"
                  }
                  style={[
                    FormStyles.input,
                    styles.inputFlex,
                    { color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    fieldErrors.email ? styles.inputError : null,
                    !nome && suggestions.nome && suggestionEnabled ? styles.suggestionPlaceholder : null,
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
                  onBlur={() => fetchSuggestions("email", email)}
                  placeholderTextColor={
                    !email && suggestions.email && suggestionEnabled ? "#D32719" : "#888"
                  }
                />
                {!email && suggestions.email && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setEmail(suggestions.email!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Titulação</Text>
              {fieldErrors.titulacao && (
                <Text style={styles.errorText}>{fieldErrors.titulacao}</Text>
              )}
              <View style={styles.inputRow}>
                <View style={styles.pickerFlex}>
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
                    suggestedLabel={
                      !titulacao && suggestions.titulacao && suggestionEnabled
                        ? suggestions.titulacao
                        : undefined
                    }
                    suggestionStyle={{ fontStyle: "italic", color: "#D32719" }}
                  />
                </View>
                {!titulacao && suggestions.titulacao && suggestionEnabled && (
                  <FieldSuggestionButton onPress={() => setTitulacao(suggestions.titulacao!)} />
                )}
              </View>
              <Text style={[FormStyles.label, { color: isDarkMode ? "#fff" : "#000" }]}>Código da Unidade</Text>
              {fieldErrors.idUnidade && (
                <Text style={styles.errorText}>{fieldErrors.idUnidade}</Text>
              )}
              <View style={styles.inputRow}>
                <TextInput
                  placeholder={
                    showSuggestion && unidadeSugerida?.id
                      ? `${unidadeSugerida.id}`
                      : "ex: 301"
                  }
                  style={[
                    FormStyles.input,
                    styles.inputFlex,
                    { width: "100%", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" },
                    !idUnidade && showSuggestion && unidadeSugerida?.id
                      ? styles.suggestionPlaceholder
                      : null,
                    fieldErrors.idUnidade ? styles.inputError : null,
                  ]}
                  placeholderTextColor={
                    showSuggestion && unidadeSugerida?.id
                      ? "#D32719"
                      : "#888"
                  }
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
                {showSuggestion && unidadeSugerida?.id && !idUnidade && (
                  <UnitSuggestionButton
                    onPress={() => setIdUnidade(unidadeSugerida.id)}
                    lottieSource={locationAnimation}
                  />
                )}
              </View>

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
          <SuggestionSwitch
            value={suggestionEnabled}
            onValueChange={setSuggestionEnabled}
          />
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
  },
  suggestionPlaceholder: {
    fontStyle: "italic",
    color: "#D32719",
  },
  pickerFlex: {
    flex: 1,
  },
});