import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import { FormStyles } from "../../../style/FormStyles";
import { Button, Card, Modal, Portal, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { gerarProfessorIA } from "../../../services/ia/iaService";
import LottieView from "lottie-react-native";
import { AnimatedGradientButton } from "../../../components/atoms/AnimatedLinearGradient";
import ProximityNotification from "../../../components/ProximityNotification";
import { buscarOuCacheUnidadeProxima } from "../../../services/unit-location/unitService";

const RegisterProfessorScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingMsg, setLoadingMsg] = React.useState("Gerando professor...");
  const [unidadeNome, setUnidadeNome] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUnidade = async () => {
      try {
        const unidade = await buscarOuCacheUnidadeProxima();
        setUnidadeNome(unidade?.nome ?? null);
      } catch {
        setUnidadeNome(null);
      }
    };
    fetchUnidade();
    const interval = setInterval(fetchUnidade, 180000);
    return () => clearInterval(interval);
  }, []);

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
    <SafeAreaView style={FormStyles.safeArea}>
      <View style={FormStyles.menuContainer}>
        <HamburgerMenu />
      </View>
      {unidadeNome && <ProximityNotification unidadeNome={unidadeNome} />}
      <View style={FormStyles.container}>
        <ScrollView
          contentContainerStyle={FormStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Card style={[FormStyles.card, { width: "90%" }]} mode="elevated">
              <Card.Content>
                <LottieView
                  source={require("../../../../assets/register.json")}
                  autoPlay
                  loop
                  speed={0.3}
                  style={{
                    width: "100%",
                    height: 150
                  }}
                />
                <Text style={FormStyles.title}>Cadastro de Professor</Text>
                <Text style={FormStyles.description}>
                  Escolha como deseja cadastrar.
                </Text>
              </Card.Content>
              <Card.Actions
                style={{ flexDirection: "column", gap: 10, marginTop: 10 }}
              >
                <Button
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  style={FormStyles.button}
                  onPress={() =>
                    navigation.navigate("RegisterProfessorsStepOne" as never)
                  }
                >
                  Cadastrar Manualmente
                </Button>
                <Button
                  mode="contained"
                  labelStyle={{ color: "white" }}
                  style={[FormStyles.button]}
                  onPress={() => navigation.navigate("ImportProfessors" as never)}
                >
                  Importar Planilha
                </Button>
                <View style={{ alignItems: "center", width: "100%" }}>
                  <AnimatedGradientButton onPress={() => setModalVisible(true)}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 48,
                        minWidth: 150,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Gerar com IA
                      </Text>
                      <LottieView
                        source={require("../../../../assets/bot.json")}
                        autoPlay
                        loop
                        style={{
                          width: 40,
                          height: 38
                        }}
                      />
                    </View>
                  </AnimatedGradientButton>
                </View>
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
            contentContainerStyle={styles.modalContainer}
          >
            {loading ? (
              <View style={{ alignItems: "center" }}>
                <ActivityIndicator size="large" color="#D32719" />
                <Text style={{ marginTop: 16 }}>{loadingMsg}</Text>
              </View>
            ) : (
              <>
                <Text style={styles.modalTitle}>Gerar Professor com IA</Text>
                <Text style={styles.modalDescription}>
                  A IA irá preencher automaticamente os campos:{" "}
                  <Text style={styles.bold}>Nome</Text>,{" "}
                  <Text style={styles.bold}>Titulação</Text>,{" "}
                  <Text style={styles.bold}>Referência</Text>,{" "}
                  <Text style={styles.bold}>Status de Atividade</Text> e{" "}
                  <Text style={styles.bold}>Lattes</Text>. Você poderá revisar e completar os demais campos.
                </Text>
                {errorMsg && (
                  <Text style={{ color: "red", marginBottom: 10 }}>{errorMsg}</Text>
                )}
                <View style={styles.modalButtonRow}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setErrorMsg(null);
                    }}
                    style={styles.cancelButton}
                    labelStyle={styles.cancelButtonLabel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor={FormStyles.button.backgroundColor}
                    labelStyle={styles.confirmButtonLabel}
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
    backgroundColor: "white",
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
    borderColor: "black",
    flex: 1,
    marginRight: 8,
  },
  cancelButtonLabel: {
    color: "black",
  },
  confirmButton: {
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  confirmButtonLabel: {
    color: "white",
  },
});

export default RegisterProfessorScreen;