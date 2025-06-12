import {
    View, Image, Text, TextInput, StyleSheet, KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { FormStyles } from "../../../style/FormStyles";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { updateUser } from "../../../services/users/userService";
import { userPasswordSchema } from "../../../validations/usersValidations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decodeJwt } from "../../../utils/jwtDecode";

const ForgetPasswordStepThree = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const [payload, setPayload] = useState<any>()

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const navigation = useNavigation()

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                if (storedToken) {
                    const data = decodeJwt(storedToken);
                    setPayload(data)
                } else {
                    console.warn("Token não encontrado no AsyncStorage");
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        };

        loadToken();
    }, []);

    const handleSubmit = async () => {
        setFieldErrors({});
        setLoading(true)

        try {
            // Verifica se as senhas são diferentes
            if (password !== confirmPassword) {
                setFieldErrors({ senha: "Senhas não são iguais." });
                return;
            }

            // Valida a senha com schema do Yup
            await userPasswordSchema.validate({ senha: password }, { abortEarly: false });

            // Chama o serviço para atualizar a senha
            await updateUser({ senha: password }, String(payload.id));

            // Navega de volta para o login após sucesso
            navigation.navigate("Login" as never);

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
            console.error(error.response?.data?.mensagem || error.message);
        } finally {
            setLoading(false); // Desativa o estado de loading
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.fullScreenContainer}>
                <Card style={[FormStyles.card, styles.card]} mode="elevated">
                    <Card.Content>

                        <Image
                            source={require("../../../../assets/cps.png")}
                            style={{ width: 300, height: 200, alignSelf: "center" }}
                            resizeMode="contain"
                        />


                        <Text style={FormStyles.title}>Recuperar Senha</Text>
                        <Text style={FormStyles.description}>
                            Cadastre sua nova senha!
                        </Text>

                        {/* Mensagens de erro */}
                        {fieldErrors.senha && (
                            <Text style={styles.errorText}>{fieldErrors.senha}</Text>
                        )}
                        {fieldErrors.api && (
                            <Text style={styles.errorText}>{fieldErrors.api}</Text>
                        )}
                        <Text>Senha</Text>
                        <TextInput
                            placeholder="Senha"
                            secureTextEntry
                            style={[FormStyles.input, { width: "100%" }]}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />

                        <Text>Confirmar Senha</Text>
                        <TextInput
                            placeholder="Confirmar nova senha"
                            secureTextEntry
                            style={[FormStyles.input, { width: "100%" }]}
                            value={confirmPassword}
                            onChangeText={(text) => setConfirmPassword(text)}
                        />

                        {/* Botão ou carregamento */}
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
                                style={[FormStyles.button, { marginTop: 20 }]}
                                onPress={handleSubmit}
                            >
                                Concluir
                            </Button>
                        )}
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
        backgroundColor: "#fff", // opcional, caso queira fundo branco
    },
    card: {
        width: "100%",
        maxWidth: 400,
    },
    errorText: {
        color: "red",
        alignSelf: "flex-start",
        marginBottom: 8,
        marginLeft: 2,
        fontSize: 12,
    },
});

export default ForgetPasswordStepThree;
