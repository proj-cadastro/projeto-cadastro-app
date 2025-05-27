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
} from "react-native";
import { login as loginService} from "../../services/users/authService";
import { userLoginSchema } from "../../validations/users/usersValidations";
import { useAuth } from "../../context/AuthContext";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const { login: authLogin } = useAuth();

  const handleLogin = async () => {
    try {
      setFieldErrors({});
      await userLoginSchema.validate(
        { email, senha: password },
        { abortEarly: false }
      );
      await loginService(email, password);
      authLogin();
      navigation.navigate("Home");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err: any) => {
          if (err.path) errors[err.path] = err.message;
        });
        setFieldErrors(errors);
      } else {
        setFieldErrors({
          api: error.response?.data?.mensagem || "Erro ao fazer login",
        });
      }
      console.error(error.response.data.mensagem);
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
            style={[
              styles.input,
              fieldErrors.email ? styles.inputError : null,
            ]}
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
          />
          {fieldErrors.senha && (
            <Text style={styles.errorText}>{fieldErrors.senha}</Text>
          )}
          <TextInput
            style={[
              styles.input,
              fieldErrors.senha ? styles.inputError : null,
            ]}
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {fieldErrors.api && (
            <Text style={styles.errorText}>{fieldErrors.api}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
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
});

export default LoginScreen;
