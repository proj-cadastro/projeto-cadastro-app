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

export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepOne">>();
  const iaData = route.params?.iaData;

  const [nome, setNome] = useState(iaData?.nome || "");
  const [email, setEmail] = useState(iaData?.email || "");
  const [titulacao, setTitulacao] = useState(iaData?.titulacao || "");
  const [idUnidade, setIdUnidade] = useState(iaData?.idUnidade || "");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [unidadeSugerida, setUnidadeSugerida] = useState<{ id: string; nome: string } | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionEnabled, setSuggestionEnabled] = useState(false);

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
            }, 2000);
          } catch {}
        }
      });
    } else {
      setShowSuggestion(false);
    }
    return () => clearTimeout(timeout);
  }, [suggestionEnabled]);

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
    <SafeAreaView style={FormStyles.safeArea}>
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
                placeholder="ex: José Maria da Silva"
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
                placeholder="ex: jose.maria@fatec.sp.gov.br"
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
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              <Text style={FormStyles.label}>Titulação</Text>
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
              <Text style={FormStyles.label}>Código da Unidade</Text>
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
  },
});