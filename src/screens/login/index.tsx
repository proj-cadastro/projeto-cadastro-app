import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Card, Button, IconButton } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/users/authService";
import { userLoginSchema } from "../../validations/usersValidations";
import { FormStyles } from "../../style/FormStyles";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    setFieldErrors({});
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      await userLoginSchema.validate(
        { email, senha: password },
        { abortEarly: false }
      );
      const token = await loginService(email, password);
      authLogin(token);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({
          api: error.response?.data?.erro || "Erro ao fazer login",
        });
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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.fullScreenContainer}>
          <Card style={[FormStyles.card, styles.card]} mode="elevated">
            <Card.Content>
              <Image
                source={require("../../../assets/logoFatecCapi.png")}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={FormStyles.title}>Login</Text>
              <Text style={FormStyles.description}>
                Entre com seu e-mail e senha para acessar o sistema.
              </Text>
            </Card.Content>

            <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>
              {fieldErrors.email && (
                <Text style={styles.errorText}>{fieldErrors.email}</Text>
              )}
              {fieldErrors.senha && (
                <Text style={styles.errorText}>{fieldErrors.senha}</Text>
              )}
              {fieldErrors.api && (
                <Text style={styles.errorText}>{fieldErrors.api}</Text>
              )}

              {/* Campo Email */}
              <TextInput
                placeholder="E-mail"
                style={[FormStyles.input, { width: "100%" }]}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />

              {/* Campo Senha com botão mostrar/ocultar */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  style={[FormStyles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <IconButton
                  icon={showPassword ? "eye-off" : "eye"}
                  size={20}
                  onPress={() => setShowPassword(!showPassword)}
                />
              </View>

              {/* Loader ou botão */}
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color="#D32719"
                  style={{ marginBottom: 20, marginTop: 10 }}
                />
              ) : (
                <Button
                  mode="contained"
                  buttonColor="#D32719"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={handleLogin}
                >
                  Entrar
                </Button>
              )}

              {/* Links de ações */}
              <View style={styles.linksContainer}>
                <Card style={styles.linkCard} mode="elevated">
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ForgetPasswordStepOne")}
                  >
                    <Text style={styles.linkText}>Esqueceu sua senha?</Text>
                  </TouchableOpacity>
                </Card>
                <Card style={styles.linkCard} mode="elevated">
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.linkText}>
                      Não tem uma conta? Cadastre-se aqui
                    </Text>
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
    backgroundColor: "#fff",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 10,
    backgroundColor: "#fff",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  linksContainer: {
    width: "100%",
    marginTop: 10,
    gap: 8,
  },
  linkCard: {
    backgroundColor: "#a1a1a1",
    borderRadius: 8,
    elevation: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 4,
    minHeight: 36,
    justifyContent: "center",
  },
  linkText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
