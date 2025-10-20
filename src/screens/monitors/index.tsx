import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import {
  Card,
  Button,
  ActivityIndicator,
  Chip,
  Portal,
  DataTable,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import HamburgerMenu from "../../components/HamburgerMenu";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../utils/useToast";
import Toast from "../../components/atoms/Toast";
import RegistroPontoModal from "./registrar-ponto";
import {
  registrarEntrada,
  registrarSaida,
  getPontoAberto,
  getPontosByUser,
} from "../../services/pontos/pontoService";
import { Ponto } from "../../types/ponto";

const MonitorsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useThemeMode();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [pontoAberto, setPontoAberto] = useState<Ponto | null>(null);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"entrada" | "saida">("entrada");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const [pontoAbertoData, pontosData] = await Promise.all([
        getPontoAberto(user.id),
        getPontosByUser(user.id),
      ]);

      setPontoAberto(pontoAbertoData);
      setPontos(pontosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      showError("Erro ao carregar dados do ponto");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleOpenModal = (tipo: "entrada" | "saida") => {
    setModalType(tipo);
    setShowModal(true);
  };

  const handleConfirmPonto = async (entrada: string, saida: string) => {
    if (!user?.id) return;

    try {
      setLoading(true);

      if (modalType === "entrada") {
        const novoPonto = await registrarEntrada(user.id);
        setPontoAberto(novoPonto);
        showSuccess("Entrada registrada com sucesso!");
      } else if (pontoAberto) {
        await registrarSaida(pontoAberto.id);
        setPontoAberto(null);
        showSuccess("Saída registrada com sucesso!");
      }

      setShowModal(false);
      await loadData();
    } catch (error: any) {
      console.error("❌ Erro ao registrar ponto:", error);
      let errorMessage = `Erro ao registrar ${modalType}`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString || dateString === "Invalid Date") {
      return "Data inválida";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return "Data inválida";
    }

    return date.toLocaleString("pt-BR");
  };

  const formatTime = (dateString: string) => {
    if (!dateString || dateString === "Invalid Date") {
      return "--:--";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime()) || date.getFullYear() < 1900) {
      return "--:--";
    }

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calcularHorasTrabalhadas = (entrada: string, saida?: string) => {
    if (!saida) return "Em andamento";

    // Validar se as datas são válidas
    if (
      !entrada ||
      entrada === "Invalid Date" ||
      !saida ||
      saida === "Invalid Date"
    ) {
      return "Data inválida";
    }

    const entradaDate = new Date(entrada);
    const saidaDate = new Date(saida);

    if (isNaN(entradaDate.getTime()) || isNaN(saidaDate.getTime())) {
      return "Data inválida";
    }

    const diff = saidaDate.getTime() - entradaDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "#181818" : "#fff" },
        ]}
      >
        <View style={styles.header}>
          <HamburgerMenu />
          <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
            Registro de Ponto
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Carregando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#181818" : "#fff" },
      ]}
    >
      <View style={styles.header}>
        <HamburgerMenu />
        <Text style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}>
          Registro de Ponto
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Atual */}
        <Card
          style={[
            styles.statusCard,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Status Atual
            </Text>

            {pontoAberto ? (
              <View style={styles.statusContent}>
                <Chip
                  mode="flat"
                  style={{ backgroundColor: theme.colors.primary }}
                  textStyle={{ color: "#fff" }}
                >
                  TRABALHANDO
                </Chip>
                <Text
                  style={[
                    styles.statusText,
                    { color: isDarkMode ? "#ccc" : "#666" },
                  ]}
                >
                  Entrada: {formatTime(pontoAberto.entrada)}
                </Text>
                <Text
                  style={[
                    styles.statusText,
                    { color: isDarkMode ? "#ccc" : "#666" },
                  ]}
                >
                  Tempo trabalhado:{" "}
                  {calcularHorasTrabalhadas(pontoAberto.entrada)}
                </Text>

                <Button
                  mode="contained"
                  onPress={() => handleOpenModal("saida")}
                  style={[styles.actionButton, { backgroundColor: "#f44336" }]}
                  disabled={loading}
                >
                  Registrar Saída
                </Button>
              </View>
            ) : (
              <View style={styles.statusContent}>
                <Chip
                  mode="flat"
                  style={{ backgroundColor: "#757575" }}
                  textStyle={{ color: "#fff" }}
                >
                  FORA DO EXPEDIENTE
                </Chip>
                <Text
                  style={[
                    styles.statusText,
                    { color: isDarkMode ? "#ccc" : "#666" },
                  ]}
                >
                  Você não possui ponto em aberto
                </Text>

                <Button
                  mode="contained"
                  onPress={() => handleOpenModal("entrada")}
                  style={[
                    styles.actionButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  disabled={loading}
                >
                  Registrar Entrada
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Histórico */}
        <Card
          style={[
            styles.historyCard,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <Card.Content>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              Histórico de Pontos
            </Text>

            {pontos.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Data</DataTable.Title>
                  <DataTable.Title>Entrada</DataTable.Title>
                  <DataTable.Title>Saída</DataTable.Title>
                  <DataTable.Title>Total</DataTable.Title>
                </DataTable.Header>

                {pontos.slice(0, 10).map((ponto) => (
                  <DataTable.Row key={ponto.id}>
                    <DataTable.Cell>
                      {new Date(ponto.entrada).toLocaleDateString("pt-BR")}
                    </DataTable.Cell>
                    <DataTable.Cell>{formatTime(ponto.entrada)}</DataTable.Cell>
                    <DataTable.Cell>
                      {ponto.saida ? formatTime(ponto.saida) : "-"}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      {calcularHorasTrabalhadas(ponto.entrada, ponto.saida)}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <Text
                style={[
                  styles.emptyText,
                  { color: isDarkMode ? "#ccc" : "#666" },
                ]}
              >
                Nenhum registro de ponto encontrado
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <RegistroPontoModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          monitorNome={user?.nome || "Monitor"}
          isDarkMode={isDarkMode}
          onConfirm={handleConfirmPonto}
          tipo={modalType}
        />
      </Portal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  statusCard: {
    marginBottom: 16,
    elevation: 4,
  },
  historyCard: {
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statusContent: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: "center",
  },
  actionButton: {
    marginTop: 16,
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default MonitorsScreen;
