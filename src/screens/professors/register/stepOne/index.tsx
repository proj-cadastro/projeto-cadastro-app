import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Card, Button, ProgressBar, useTheme } from "react-native-paper";
import ListPicker from "../../../../components/atoms/ListPicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp, RouteParamsProps } from "../../../../routes/rootStackParamList ";
import { FormStyles } from "../../../../style/FormStyles";
import { Titulacao } from "../../../../enums/professors/professorEnum";
import { professorRegisterSchema } from "../../../../validations/professorsRegisterValidations";
import HamburgerMenu from "../../../../components/HamburgerMenu";

export default function ProfessorFormStepOne() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParamsProps<"RegisterProfessorsStepOne">>();
  const iaData = route.params?.iaData;
  const { colors } = useTheme(); // <-- Hook do tema

  const [nome, setNome] = useState(iaData?.nome || "");
  const [email, setEmail] = useState(iaData?.email || "");
  const [titulacao, setTitulacao] = useState(iaData?.titulacao || "");
  const [idUnidade, setIdUnidade] = useState(iaData?.idUnidade || "");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

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
    <SafeAreaView style={[FormStyles.safeArea, { backgroundColor: colors.background }]}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <Button
        onPress={() => navigation.goBack()}
        style={FormStyles.goBackButton}
        labelStyle={{ color: colors.onPrimary }}
      >
        Voltar
      </Button>
      <View style={[FormStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={[FormStyles.card, { backgroundColor: colors.elevation.level1 }]} mode="elevated">
            <Card.Content>
              <Text style={[FormStyles.title, { color: colors.onBackground }]}>Cadastro de Professor</Text>
              <Text style={[FormStyles.description, { color: colors.onBackground }]}>
                Insira os dados do professor para registrá-lo no sistema
              </Text>
              <Text style={[FormStyles.label, { color: colors.onBackground }]}>Nome</Text>
              {fieldErrors.nome && (
                <Text style={[styles.errorText, { color: colors.error }]}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                placeholder="ex: José Maria da Silva"
                style={[
                  FormStyles.input,
                  { color: colors.onBackground, backgroundColor: colors.surface, borderColor: colors.outline },
                  fieldErrors.nome ? styles.inputError : null,
                ]}
                placeholderTextColor={colors.onSurfaceVariant}
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
              <Text style={[FormStyles.label, { color: colors.onBackground }]}>Email</Text>
              {fieldErrors.email && (
                <Text style={[styles.errorText, { color: colors.error }]}>{fieldErrors.email}</Text>
              )}
              <TextInput
                placeholder="ex: jose.maria@fatec.sp.gov.br"
                style={[
                  FormStyles.input,
                  { color: colors.onBackground, backgroundColor: colors.surface, borderColor: colors.outline },
                  fieldErrors.email ? styles.inputError : null,
                ]}
                placeholderTextColor={colors.onSurfaceVariant}
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
              <Text style={[FormStyles.label, { color: colors.onBackground }]}>Titulação</Text>
              {fieldErrors.titulacao && (
                <Text style={[styles.errorText, { color: colors.error }]}>{fieldErrors.titulacao}</Text>
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
              <Text style={[FormStyles.label, { color: colors.onBackground }]}>Código da Unidade</Text>
              {fieldErrors.idUnidade && (
                <Text style={[styles.errorText, { color: colors.error }]}>{fieldErrors.idUnidade}</Text>
              )}
              <TextInput
                placeholder="ex: 301"
                style={[
                  FormStyles.input,
                  { width: "100%", color: colors.onBackground, backgroundColor: colors.surface, borderColor: colors.outline },
                  fieldErrors.idUnidade ? styles.inputError : null,
                ]}
                placeholderTextColor={colors.onSurfaceVariant}
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
                labelStyle={{ color: colors.onPrimary }}
                style={[FormStyles.button, { backgroundColor: colors.primary }]}
                onPress={handleAdvance}
              >
                Avançar
              </Button>
            </Card.Actions>

            <ProgressBar progress={0.5} color={colors.primary} />

          </Card>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
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