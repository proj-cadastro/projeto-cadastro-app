import {
    View, Image, Text, TextInput, StyleSheet, KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { FormStyles } from "../../../style/FormStyles";
import { Card, Button, Switch } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import { compareCode } from "../../../services/users/authService";
import { useThemeMode } from "../../../context/ThemeContext"; // Importa o contexto do tema

const ForgetPasswordStepTwo = () => {
    const navigation = useNavigation()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Usa o contexto do tema
    const { isDarkMode, toggleTheme } = useThemeMode();

    const handleSubmit = async () => {
        setFieldErrors({});
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Timeout de 2 segundos

        try {
            await compareCode(code)
            navigation.navigate("ForgetPasswordStepThree" as never)
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
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }} // Aplica fundo escuro se dark mode
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.fullScreenContainer}>
                
                <Card style={[FormStyles.card, styles.card, { backgroundColor: isDarkMode ? "#232323" : "#fff" }]} mode="elevated">
                    <Card.Content>
                        <Image
                            source={require("../../../../assets/cps.png")}
                            style={{ width: 300, height: 200, alignSelf: "center" }}
                            resizeMode="contain"
                        />
                        <Text style={[FormStyles.title, { color: isDarkMode ? "#fff" : "#000" }]}>Recuperar Senha</Text>
                        <Text style={[FormStyles.description, { color: isDarkMode ? "#fff" : "#000" }]}>
                            Insira o código enviado no seu e-mail
                        </Text>
                        {fieldErrors.api && (
                            <Text style={styles.errorText}>{fieldErrors.api}</Text>
                        )}
                        <OtpInput
                            numberOfDigits={6}
                            onTextChange={(text) => console.log(text)}
                            placeholder="******"
                            blurOnFilled={true}
                            autoFocus={false}
                            onFilled={(text) => setCode(text)}
                            // OtpInput não tem suporte direto a tema, mas o fundo da tela já muda
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
                                style={[FormStyles.button, { marginTop: 30 }]}
                                onPress={handleSubmit}
                            >
                                Verificar
                            </Button>
                        )}
                        <Button
                            onPress={() => navigation.navigate("Login" as never)}
                            style={[FormStyles.button, { marginTop: 10, backgroundColor: "transparent" }]}
                            labelStyle={{ color: isDarkMode ? "#fff" : "black" }}
                        >
                            Cancelar
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </KeyboardAvoidingView>
    )
}

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

export default ForgetPasswordStepTwo