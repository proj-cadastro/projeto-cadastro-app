import { View, Image, Text, TextInput, StyleSheet } from "react-native";
import { FormStyles } from "../../../style/FormStyles";
import { Card, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";


const ForgetPasswordStepTwo = () => {
    const [code, setCode] = useState("")

    const navigation = useNavigation()

    return (
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
                    <Text style={FormStyles.title}>Recuperar Senha</Text>
                    <Text style={FormStyles.description}>
                        Insira o código enviado no seu e-mail
                    </Text>
                    <TextInput
                        placeholder="Código"
                        style={[FormStyles.input, { width: "100%" }]}
                        value={code}
                        onChangeText={(text) => setCode(text)}
                    />

                    <Button
                        mode="contained"
                        buttonColor="blue"
                        labelStyle={{ color: "white" }}
                        style={FormStyles.button}
                        onPress={() =>
                            navigation.navigate("ForgetPasswordStepTwo" as never)
                        }
                    >
                        Avançar
                    </Button>
                    <Button
                        onPress={() => navigation.goBack()}
                        style={[FormStyles.button, {marginTop: 10}]}
                        labelStyle={{ color: "white" }}
                    >
                        Cancelar
                    </Button>

                </Card.Content>

            </Card>
        </View>
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
});


export default ForgetPasswordStepTwo