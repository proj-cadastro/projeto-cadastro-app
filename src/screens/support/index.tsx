import React from "react";
import { SafeAreaView, Text, StyleSheet, View, ScrollView, Linking, Alert } from "react-native";
import HamburgerMenu from "../../components/HamburgerMenu";
import { SUPPORT_EMAIL } from "@env";

import { Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";


const SupportPage = () => {

    const navigation = useNavigation()

    const sendEmail = async () => {
        const email = SUPPORT_EMAIL
        const subject = "Chamado de Suporte";
        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

        const canOpen = await Linking.canOpenURL(url)

        if (canOpen) {
            Linking.openURL(url)
        } else {
            Alert.alert("Não foi possível abrir o app de E-mail")
        }
    }

    return (
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >
            <SafeAreaView style={styles.container}>
                {/* Deixe o menu no fluxo normal */}
                <View style={styles.menuWrapper}>
                    <HamburgerMenu />
                </View>

                <View style={styles.headerr}>
                    <View style={styles.header}>

                        <Text style={styles.title}>Central de Suporte</Text>
                        <Text style={styles.subtitle}>
                            Possui dúvidas ou notou algum bug? Nosso time está aqui para ajudar!
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>

                    <Text style={[{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginBottom: 12,
                        color: "#333",
                    }]}>
                        Tópicos</Text>

                    <Card style={styles.card} mode="elevated" onPress={sendEmail}>
                        <Card.Content style={[{ alignItems: "center" }]}>
                            <View style={styles.icon}>
                                <Icon name="email" size={40} />
                            </View>
                            <Text style={styles.cardTitle}>E-mail</Text>
                            <Text style={styles.cardSubtitle}>Entre em contato através do e-mail</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.card} mode="elevated" onPress={() => console.log("Chatbox")}>
                        <Card.Content style={[{ alignItems: "center" }]}>
                            <View style={styles.icon}>
                                <Icon name="chat" size={40} />
                            </View>
                            <Text style={styles.cardTitle}>Chatbox</Text>
                            <Text style={styles.cardSubtitle}>Tire suas dúvidas de forma instantânea com nosso chatbox!</Text>
                        </Card.Content>
                    </Card>
                </View>
            </SafeAreaView>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        backgroundColor: 'black',
        padding: 30,
        height: 250,
        borderRadius: 25,
        marginBottom: 30,
    },
    headerr: {
        paddingHorizontal: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    menuWrapper: {
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 25,

    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: "gray",
        marginTop: 20,
        textAlign: "center"
    },
    card: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: "#fff",
        padding: 10,
    },
    cardTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
        textAlign: "center"
    },
    cardSubtitle: {
        textAlign: "center"
    },
    icon: {
        padding: 8,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 8, // arredondado
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2, // Android
        alignItems: "center",
        justifyContent: "center",
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
});



export default SupportPage