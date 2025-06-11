import { View, Image, Text, TextInput, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import { FormStyles } from "../../../style/FormStyles";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

const ForgetPasswordStepOne = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");

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
                    <TextInput
                        placeholder="e-mail"
                        style={[FormStyles.input, { width: "100%" }]}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
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
                        Verificar
                    </Button>
                </Card.Actions>
            </Card>
        </View>
    );
};

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

export default ForgetPasswordStepOne;
