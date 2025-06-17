import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card, Modal, Portal, ActivityIndicator, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { gerarProfessorIA } from "../../../services/ia/iaService";

const RegisterProfessorScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme(); // <-- Hook do tema

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingMsg, setLoadingMsg] = React.useState("Gerando professor...");

  const handleGerarIA = async () => {
    setLoading(true);
    setErrorMsg(null);
    setLoadingMsg("Gerando professor...");
    let timeout: NodeJS.Timeout | null = null;
    timeout = setTimeout(() => setLoadingMsg("Treinando IA..."), 2500);

    try {
      const resposta = await gerarProfessorIA();
      if (timeout) clearTimeout(timeout);
      setLoading(false);
      setModalVisible(false);

      navigation.navigate("RegisterProfessorsStepOne", {
        iaData: resposta,
      });
    } catch (e) {
      if (timeout) clearTimeout(timeout);
      setLoading(false);
      setLoadingMsg("Gerando professor...");
      setErrorMsg("Não foi possível gerar o professor. Tente novamente.");
      console.error("Erro ao gerar professor com IA:", e);
    }
  };

  return (
    <SafeAreaView style={[FormStyles.safeArea, { backgroundColor: colors.background }]}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      <View style={[FormStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Card style={[FormStyles.card, { width: "90%", backgroundColor: colors.elevation.level1 }]} mode="elevated">
              <Card.Content>
                <Image
                  source={require("../../../../assets/professor.jpg")}
                  style={{ width: 300, height: 200, alignSelf: "center", marginBottom: 16 }}
                  resizeMode="contain"
                />
                <Text style={[FormStyles.title, { color: colors.onBackground }]}>Cadastro de Professor</Text>
                <Text style={[FormStyles.description, { color: colors.onBackground }]}>
                  Escolha como deseja cadastrar.
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ flexDirection: "column", gap: 10, marginTop: 10 }}
              >
                <Button
                  mode="contained"
                  buttonColor={colors.primary}
                  labelStyle={{ color: colors.onPrimary }}
                  style={FormStyles.button}
                  onPress={() =>
                    navigation.navigate("RegisterProfessorsStepOne" as never)
                  }
                >
                  Cadastrar Manualmente
                </Button>
                <Button
                  mode="contained"
                  buttonColor={colors.secondary}
                  labelStyle={{ color: colors.onSecondary }}
                  style={FormStyles.button}
                  onPress={() => navigation.navigate("ImportProfessors" as never)}
                >
                  Importar Planilha
                </Button>
                <Button
                  mode="contained"
                  buttonColor={colors.tertiary || "#FF9800"}
                  labelStyle={{ color: colors.onTertiary || "#fff" }}
                  style={FormStyles.button}
                  onPress={() => setModalVisible(true)}
                >
                  Gerar com IA
                </Button>
              </Card.Actions>
            </Card>
          </View>
        </ScrollView>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              setErrorMsg(null);
            }}
            contentContainerStyle={[styles.modalContainer, { backgroundColor: colors.elevation.level2 }]}
          >
            {loading ? (
              <View style={{ alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 16, color: colors.onBackground }}>{loadingMsg}</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.modalTitle, { color: colors.onBackground }]}>Gerar Professor com IA</Text>
                <Text style={[styles.modalDescription, { color: colors.onBackground }]}>
                  A IA irá preencher automaticamente os campos:{" "}
                  <Text style={styles.bold}>Nome</Text>,{" "}
                  <Text style={styles.bold}>Titulação</Text>,{" "}
                  <Text style={styles.bold}>Referência</Text>,{" "}
                  <Text style={styles.bold}>Status de Atividade</Text> e{" "}
                  <Text style={styles.bold}>Lattes</Text>. Você poderá revisar e completar os demais campos.
                </Text>
                {errorMsg && (
                  <Text style={{ color: colors.error, marginBottom: 10 }}>{errorMsg}</Text>
                )}
                <View style={styles.modalButtonRow}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setErrorMsg(null);
                    }}
                    style={[styles.cancelButton, { borderColor: colors.outline }]}
                    labelStyle={[styles.cancelButtonLabel, { color: colors.onBackground }]}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor={colors.primary}
                    labelStyle={[styles.confirmButtonLabel, { color: colors.onPrimary }]}
                    style={styles.confirmButton}
                    onPress={handleGerarIA}
                  >
                    Gerar com IA
                  </Button>
                </View>
              </>
            )}
          </Modal>
        </Portal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // backgroundColor: "white", // agora vem do tema
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: "left",
    fontSize: 15,
  },
  bold: {
    fontWeight: "bold",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginRight: 8,
  },
  cancelButtonLabel: {
    // color: "black", // agora vem do tema
  },
  confirmButton: {
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonLabel: {
    // color: "white", // agora vem do tema
  },
});

export default RegisterProfessorScreen;