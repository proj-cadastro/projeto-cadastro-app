import { View, Image, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, Card, Switch } from "react-native-paper";
import { FormStyles } from "../../../style/FormStyles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getForgetPasswordToken } from "../../../services/users/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/apiService";
import { userEmailSchema } from "../../../validations/usersValidations";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

const ForgetPasswordStepOne = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Usa o contexto do tema
    const { isDarkMode, toggleTheme } = useThemeMode();

    const handleAdvance = async () => {
        setFieldErrors({});
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500)); // Timeout de 2 segundos

        try {
            await userEmailSchema.validate({ email }, { abortEarly: false });
            const token = await getForgetPasswordToken(email);
            await AsyncStorage.setItem("token", token);
            api.defaults.headers.Authorization = `Bearer ${token}`;
            navigation.navigate("ForgetPasswordStepTwo" as never);
        } catch (error: any) {
            console.log(error.response?.data?.mensagem || error.message);

            if (error.name === "ValidationError") {
                const errors: { [key: string]: string } = {};
                error.inner.forEach((err: any) => {
                    if (err.path) errors[err.path] = err.message;
                });
                setFieldErrors(errors);
            } else {
                setFieldErrors({
                    api: error.response?.data?.mensagem || "Erro ao seguir com a recuperação de senha",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }} // Aplica fundo escuro se dark mode
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.fullScreenContainer}>

                <Card style={[FormStyles.card, styles.card, { backgroundColor: isDarkMode ? "#232323" : "#fff" }]} mode="elevated">
                    <Card.Content>
                        <Button
                            onPress={() => navigation.goBack()}
                            style={FormStyles.goBackButton}
                            labelStyle={{ color: "white" }}
                        >
                            Voltar
                        </Button>
                        <Image
                            source={require("../../../../assets/cps.png")}
                            style={{ width: 300, height: 200, alignSelf: "center" }}
                            resizeMode="contain"
                        />
                        <Text style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Recuperar Senha</Text>
                        <Text style={[FormStyles.description, { color: isDarkMode ? "#fff" : "#000" }]}>
                            Digite seu e-mail para inicializar a recuperação de senha.
                        </Text>
                    </Card.Content>
                    <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>
                        {fieldErrors.email && (
                            <Text style={styles.errorText}>{fieldErrors.email}</Text>
                        )}
                        {fieldErrors.api && (
                            <Text style={styles.errorText}>{fieldErrors.api}</Text>
                        )}
                        <TextInput
                            placeholder="e-mail"
                            placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                            style={[FormStyles.input, { width: "100%", color: isDarkMode ? "#fff" : "#000", borderColor: isDarkMode ? "#444" : "#ccc" }]}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        {loading ? (
                            <ActivityIndicator
                                size="large"
                                color="#007BFF"
                                style={{ marginBottom: 20 }}
                            />
                        ) : (
                            <Button
                                mode="contained"
                                buttonColor="blue"
                                labelStyle={{ color: "white" }}
                                style={FormStyles.button}
                                onPress={handleAdvance}
                            >
                                Verificar
                            </Button>
                        )}
                    </Card.Actions>
                </Card>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    fullScreenContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        // backgroundColor será sobrescrito pelo modo escuro
    },
    switchContainer: {
        position: "absolute",
        top: 40,
        right: 24,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 2,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        // backgroundColor será sobrescrito pelo modo escuro
    },
    errorText: {
        color: "red",
        alignSelf: "flex-start",
        marginBottom: 8,
        marginLeft: 2,
        fontSize: 12,
    },
});

export default ForgetPasswordStepOne;