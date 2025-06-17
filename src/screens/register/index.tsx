import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card, Button, useTheme } from "react-native-paper";
import { signUp } from "../../services/users/userService";
import { userRegisterSchema } from "../../validations/usersValidations";
import { FormStyles } from "../../style/FormStyles";

const RegisterScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

  const handleRegister = async () => {
    setFieldErrors({});
    setIsLoading(true);
    try {
      await userRegisterSchema.validate(
        { nome, email, senha },
        { abortEarly: false }
      );
      await signUp({ nome, email, senha });
      navigation.navigate("Login");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({
          api: error.response?.data?.mensagem || "Erro ao cadastrar",
        });
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.fullScreenContainer, { backgroundColor: colors.background }]}>
          <Card style={[FormStyles.card, styles.card, { backgroundColor: colors.elevation.level1 }]} mode="elevated">
            <Card.Content>
              <Image
                source={require("../../../assets/logoFatecCapi.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[FormStyles.title, { color: colors.onBackground }]}>Cadastro</Text>
              <Text style={[FormStyles.description, { color: colors.onBackground }]}>
                Preencha os campos para criar sua conta.
              </Text>
            </Card.Content>
            <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>
              {fieldErrors.nome && (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              )}
              <TextInput
                style={[
                  FormStyles.input,
                  { width: "100%", color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surface },
                  fieldErrors.nome ? styles.inputError : null
                ]}
                placeholder="Nome"
                placeholderTextColor={colors.onSurfaceVariant}
                value={nome}
                onChangeText={setNome}
              />
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              <TextInput
                style={[
                  FormStyles.input,
                  { width: "100%", color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surface },
                  fieldErrors.email ? styles.inputError : null
                ]}
                placeholder="E-mail"
                placeholderTextColor={colors.onSurfaceVariant}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}
              <TextInput
                style={[
                  FormStyles.input,
                  { width: "100%", color: colors.onBackground, borderColor: colors.outline, backgroundColor: colors.surface },
                  fieldErrors.senha ? styles.inputError : null
                ]}
                placeholder="Senha"
                placeholderTextColor={colors.onSurfaceVariant}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              {fieldErrors.api && (
                <Text style={styles.errorText}>{fieldErrors.api}</Text>
              )}
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              ) : (
                <Button
                  mode="contained"
                  buttonColor={colors.primary}
                  labelStyle={{ color: colors.onPrimary }}
                  style={FormStyles.button}
                  onPress={handleRegister}
                >
                  Cadastrar
                </Button>
              )}
              <View style={styles.linksContainer}>
                <Card style={[styles.linkCard, { backgroundColor: colors.secondary }]} mode="elevated">
                  <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={[styles.linkText, { color: colors.onSecondary }]}>Já tem uma conta? Entrar</Text>
                  </TouchableOpacity>
                </Card>
              </View>
            </Card.Actions>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 10,
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: "center",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
  },
  inputError: {
    borderColor: "red",
  },
  linksContainer: {
    width: "100%",
    marginTop: 10,
    gap: 8,
  },
  linkCard: {
    borderRadius: 8,
    elevation: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
    minHeight: 36,
    justifyContent: "center",
  },
  linkText: {
    textAlign: "center",
    fontSize: 14,
  },
});

export default RegisterScreen;