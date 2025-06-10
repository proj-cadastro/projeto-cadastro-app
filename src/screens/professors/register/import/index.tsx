import { SafeAreaView, View, Text, Image } from "react-native"
import HamburgerMenu from "../../../../components/HamburgerMenu"
import { FormStyles } from "../../../../style/FormStyles"
import { Button, Card } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"


const ImportProfessors = () => {

    const navigation = useNavigation()

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
                        <Image
                            source={require("../../../../../assets/excel.jpg")}
                            style={{ width: "100%", height: 100, alignSelf: "center", marginBottom: 16, borderRadius: 15 }}

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
                            onPress={() => console.log("oi")}
                        >
                            Baixar Planilha Modelo
                        </Button>


                        <Text style={[FormStyles.description, { marginTop: 30 }]}>
                            Importe a planilha com os dados que você preencheu.
                        </Text>
                        <Button
                            mode="contained"
                            buttonColor="green"
                            labelStyle={{ color: "white" }}
                            style={[FormStyles.button, { backgroundColor: "#08A93C" }]}
                            onPress={() => console.log("oi")}
                        >
                            Importar Planilha
                        </Button>
                    </Card.Content>

                </Card>
            </View>

        </SafeAreaView>
    )
}

export default ImportProfessors