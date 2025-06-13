import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { login as loginService } from "../../services/users/authService";
import { userLoginSchema } from "../../validations/usersValidations";
import { useAuth } from "../../context/AuthContext";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    setFieldErrors({});
    setIsLoading(true); // Ativa o estado de loading
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Timeout de 2 segundos
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
      console.error(error.response?.data?.mensagem);
    } finally {
      setIsLoading(false); // Desativa o estado de loading
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/logoFatecCapi.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>

          {fieldErrors.email && (
            <Text style={styles.errorText}>{fieldErrors.email}</Text>
          )}
          <TextInput
            style={[styles.input, fieldErrors.email ? styles.inputError : null]}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          {fieldErrors.senha && (
            <Text style={styles.errorText}>{fieldErrors.senha}</Text>
          )}
          <TextInput
            style={[styles.input, fieldErrors.senha ? styles.inputError : null]}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {fieldErrors.api && (
            <Text style={styles.errorText}>{fieldErrors.api}</Text>
          )}

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={{ marginBottom: 20 }}
            />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

          )}
          <TouchableOpacity onPress={() => navigation.navigate("ForgetPasswordStepOne")}>
            <Text style={styles.link} onPress={() => navigation.navigate("ForgetPasswordStepOne")}>Esqueceu sua senha?</Text>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Não tem uma conta? Cadastre-se aqui</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  inputError: {
    borderColor: "red",
  },
  link: {
    marginTop: 20,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  button: {
    width: "40%",
    height: 40,
    backgroundColor: "#a1a1a1",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    alignSelf: "flex-start",
    marginBottom: 8,
    marginLeft: 2,
    fontSize: 12,
  },
  loadingText: {
    color: "#000",
    fontSize: 16,
    marginBottom: 20,
  },
});

export default LoginScreen;
