import { View, Image, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Button, Card } from "react-native-paper";
import { FormStyles } from "../../../style/FormStyles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { getForgetPasswordToken } from "../../../services/users/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../../services/apiService";

import { userEmailSchema } from "../../../validations/usersValidations";

const ForgetPasswordStepOne = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const handleAdvance = async () => {
        setFieldErrors({});
        setLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 500)); // Timeout de 2 segundos

        try {
            // valida os campos
            await userEmailSchema.validate({ email }, { abortEarly: false });

            // tudo certo, chama a API
            const token = await getForgetPasswordToken(email);

            // coloca o token no headers de authorization, (coisa que o back pede)
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
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.fullScreenContainer}>
                <Card style={[FormStyles.card, styles.card]} mode="elevated">
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

                        <Text style={FormStyles.title}>Recuperar Senha</Text>

                        <Text style={FormStyles.description}>
                            Digite seu e-mail para inicializar a recuperação de senha.
                        </Text>
                    </Card.Content>

                    <Card.Actions style={{ flexDirection: "column", marginTop: 10 }}>

                        {/* Erro de email do front */}
                        {fieldErrors.email && (
                            <Text style={styles.errorText}>{fieldErrors.email}</Text>
                        )}

                        {/* Erro geral da API */}
                        {fieldErrors.api && (
                            <Text style={styles.errorText}>{fieldErrors.api}</Text>
                        )}

                        <TextInput
                            placeholder="e-mail"
                            style={[FormStyles.input, { width: "100%" }]}
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
        backgroundColor: "#fff",
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

export default ForgetPasswordStepOne;
