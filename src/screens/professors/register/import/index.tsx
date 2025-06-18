import { SafeAreaView, View, Text, ActivityIndicator, StyleSheet } from "react-native"
import HamburgerMenu from "../../../../components/HamburgerMenu"
import { FormStyles } from "../../../../style/FormStyles"
import { Button, Card, Portal } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"

import LottieView from 'lottie-react-native';
import { DocPicker } from "../../../../components/atoms/DocPicker"
import { downloadProfessorXlsFile, uploadFile } from "../../../../services/file/fileService"
import { useState } from "react"

const ImportProfessors = () => {

    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleDownloadFile = async () => {
        try {
            setLoading(true)
            await new Promise(resolve => setTimeout(resolve, 2000)) // espera 3 segundos
            await downloadProfessorXlsFile()
        } catch (error: any) {
            setError(error)
        } finally {
            setLoading(false)
        }
    }


    return (
        <SafeAreaView style={FormStyles.safeArea}>
            <View style={FormStyles.menuContainer}>
                <HamburgerMenu />
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10 }}>
                <Button
                    onPress={() => navigation.goBack()}
                    style={FormStyles.goBackButton}
                    labelStyle={{ color: "white" }}
                >
                    Voltar
                </Button>
                <Card style={[FormStyles.card]} mode="elevated">
                    <Card.Content>


                        <LottieView
                            source={require("../../../../../assets/animation2.json")}
                            autoPlay
                            loop
                            style={{
                                width: "100%",
                                height: 150,
                                alignSelf: "center",
                                marginBottom: 16,
                            }}
                        />


                        <Text style={FormStyles.title}>Importar Planilha</Text>

                        <Text style={FormStyles.description}>
                            Siga os passos abaixo para importar seus professores usando uma planilha.
                        </Text>

                        <Text style={[FormStyles.description, { marginTop: 20 }]}>
                            Clique no botão de baixar planilha modelo abaixo e preencha os dados.
                        </Text>
                        <Button
                            mode="contained"
                            buttonColor="green"
                            labelStyle={{ color: "white" }}
                            style={[FormStyles.button, { backgroundColor: "#0086FF" }]}
                            onPress={() => handleDownloadFile()}
                        >
                            Baixar Planilha Modelo
                        </Button>


                        <Text style={[FormStyles.description, { marginTop: 30 }]}>
                            Importe a planilha com os dados que você preencheu.
                        </Text>
                        <DocPicker />
                    </Card.Content>

                </Card>
            </View>

            <Portal>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff"
                        />
                    </View>
                )}
            </Portal>

        </SafeAreaView>
    )
}

export default ImportProfessors

const styles = StyleSheet.create({
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // fundo semi-transparente
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
});
