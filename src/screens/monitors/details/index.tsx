import React, { useState } from "react";
import { View, Text, SafeAreaView, Modal } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import RegistroPontoModal from "../../../screens/monitors/registrar-ponto";
import { TableStyle } from "../../../style/TableStyle";
import { FormStyles } from "../../../style/FormStyles";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../context/ThemeContext";

const diasSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
];

const registrosSemanaMock = [
  { dia: "Segunda-feira", entrada: "08:00", saida: "12:00" },
  { dia: "Terça-feira", entrada: "08:15", saida: "12:10" },
  { dia: "Quarta-feira", entrada: "", saida: "" },
  { dia: "Quinta-feira", entrada: "08:30", saida: "" },
  { dia: "Sexta-feira", entrada: "", saida: "" },
];

const DetailsMonitor = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ params: { id: number } }, "params">>();
  const { isDarkMode } = useThemeMode();

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [horaSelecionada, setHoraSelecionada] = useState<string>("");

  // ESTADO PARA ENTRADA E SAÍDA
  const [entrada, setEntrada] = useState("Não definida");
  const [saida, setSaida] = useState("Não definida");

  const [modalTipo, setModalTipo] = useState<"entrada" | "saida">("entrada");
  const [modalRegistrosVisible, setModalRegistrosVisible] = useState(false);

  const id = route.params?.id;

  const monitor = {
    id: id,
    nome: "João Silva",
    cronograma: {
      entrada,
      saida,
      horarios: {
        segunda: "2h",
        terca: "2h", 
        quarta: "2h",
        quinta: "1h",
        sexta: "1h"
      }
    }
  };

  // Função chamada ao registrar ponto
  const handleRegistrarPonto = () => {
    if (entrada !== "Não definida" && entrada !== "") {
      setModalTipo("saida");
    } else {
      setModalTipo("entrada");
    }
    setModalVisible(true);
  };

  // Função para atualizar entrada e saída
  const handleConfirmarPonto = (novaEntrada: string, novaSaida: string) => {
    if (modalTipo === "entrada") {
      setEntrada(novaEntrada);
    }
    if (modalTipo === "saida") {
      setSaida(novaSaida);
    }
    setModalVisible(false);
  };

  // No DetailsMonitor
  const handleRegistrarPontoModal = (hora: string) => {
    setHoraSelecionada(hora);
    setConfirmVisible(true);
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isDarkMode ? "#181818" : "#fff",
      justifyContent: "center",
      alignItems: "center"
    }}>
     
      
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
       
      </View>

      <Text
        style={[
          TableStyle.title,
          {
            marginBottom: 20,
            marginTop: 20,
            textAlign: "center",
            paddingHorizontal: 18,
            color: isDarkMode ? "#fff" : "#000",
          },
        ]}
      >
        Detalhes do Monitor
      </Text>

      {monitor ? (
        <View
          style={{
            marginTop: 10,
            marginHorizontal: 8,
            padding: 24,
            borderRadius: 20,
            backgroundColor: isDarkMode ? "#232323" : "#fff",
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: isDarkMode ? "#fff" : "#22223b",
              marginBottom: 20,
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            {monitor.nome}
          </Text>

          {/* Cronograma Semanal */}
          <View
            style={{
              marginBottom: 20,
              padding: 16,
              backgroundColor: isDarkMode ? "#181818" : "#f8f9fa",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDarkMode ? "#fff" : "#22223b",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Cronograma Semanal
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              <HorarioItem label="Segunda" value={monitor.cronograma.horarios.segunda} isDarkMode={isDarkMode} />
              <HorarioItem label="Terça" value={monitor.cronograma.horarios.terca} isDarkMode={isDarkMode} />
              <HorarioItem label="Quarta" value={monitor.cronograma.horarios.quarta} isDarkMode={isDarkMode} />
              <HorarioItem label="Quinta" value={monitor.cronograma.horarios.quinta} isDarkMode={isDarkMode} />
              <HorarioItem label="Sexta" value={monitor.cronograma.horarios.sexta} isDarkMode={isDarkMode} />
            </View>
          </View>

          {/* Horários de Entrada e Saída */}
          <View
            style={{
              marginBottom: 16,
              padding: 16,
              backgroundColor: isDarkMode ? "#181818" : "#f1f3f6",
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: "#28a745",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 12,
                color: isDarkMode ? "#fff" : "#22223b",
                fontSize: 16,
              }}
            >
              Horário de hoje:
            </Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "600",
                    color: "#28a745",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  Entrada: {monitor.cronograma.entrada}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontWeight: "600",
                    color: isDarkMode ? "#ccc" : "#6c757d",
                    fontSize: 14,
                    textAlign: "right",
                  }}
                >
                  Saída: {monitor.cronograma.saida}
                </Text>
              </View>
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={{ marginTop: 20 }}>
            <Button
              mode="contained"
              style={{
                backgroundColor: "#dc3545",
                marginBottom: 12,
                borderRadius: 8,
              }}
              labelStyle={{ color: "white", fontWeight: "bold" }}
              onPress={handleRegistrarPonto} // MODIFICADO: Chama a função para abrir o modal
            >
              REGISTRAR PONTO
            </Button>

            <Button
              mode="contained"
              style={{
                backgroundColor: "#343a40",
                borderRadius: 8,
              }}
              labelStyle={{ color: "white", fontWeight: "bold" }}
              onPress={() => setModalRegistrosVisible(true)}
            >
              VER REGISTROS
            </Button>
          </View>
        </View>
      ) : (
        <Text style={[
          TableStyle.emptyText,
          { color: isDarkMode ? "#fff" : "#000" }
        ]}>Monitor não encontrado.</Text>
      )}

      {/* MODIFICADO: Passa função para atualizar entrada/saída */}
      <RegistroPontoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        monitorNome={monitor?.nome || "Monitor"}
        isDarkMode={isDarkMode}
        onConfirm={handleConfirmarPonto}
        tipo={modalTipo}
      />

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)"
        }}>
          <View style={{
            backgroundColor: isDarkMode ? "#232323" : "#fff",
            padding: 24,
            borderRadius: 12,
            alignItems: "center",
            width: "80%"
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: "bold",
              color: isDarkMode ? "#fff" : "#000",
              marginBottom: 16
            }}>
              Tem certeza que deseja registrar?
            </Text>
            <Text style={{
              fontSize: 16,
              color: "#28a745",
              marginBottom: 24
            }}>
              Horário: {horaSelecionada}
            </Text>
            <Button
              mode="contained"
              style={{ backgroundColor: "#dc3545", marginBottom: 8 }}
              onPress={() => {
                if (modalTipo === "entrada") setEntrada(horaSelecionada);
                if (modalTipo === "saida") setSaida(horaSelecionada);
                setConfirmVisible(false);
                setModalVisible(false);
              }}
            >
              Confirmar
            </Button>
            <Button
              mode="outlined"
              onPress={() => setConfirmVisible(false)}
            >
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>

      {/* MODAL DE REGISTROS DA SEMANA */}
      <Modal
        visible={modalRegistrosVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalRegistrosVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.4)"
        }}>
          <View style={{
            backgroundColor: isDarkMode ? "#232323" : "#fff",
            padding: 24,
            borderRadius: 12,
            width: "90%",
            maxHeight: "80%",
          }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: "bold",
                color: isDarkMode ? "#fff" : "#000",
              }}>
                REGISTROS DA SEMANA
              </Text>
              <Button
                mode="text"
                onPress={() => setModalRegistrosVisible(false)}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000", fontSize: 18 }}
              >
                X
              </Button>
            </View>
            {registrosSemanaMock.map((registro, idx) => (
              <View key={registro.dia} style={{
                padding: 12,
                marginBottom: 8,
                backgroundColor: isDarkMode ? "#181818" : "#f8f9fa",
                borderRadius: 8,
                borderLeftWidth: 3,
                borderLeftColor: registro.entrada ? "#007bff" : "#ccc",
              }}>
                <Text style={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                  fontSize: 15,
                }}>
                  {registro.dia}
                </Text>
                <Text style={{
                  color: registro.entrada ? "#28a745" : "#dc3545",
                  fontSize: 14,
                  marginTop: 4,
                }}>
                  Entrada: {registro.entrada || "—"}
                </Text>
                <Text style={{
                  color: registro.saida ? "#007bff" : "#dc3545",
                  fontSize: 14,
                }}>
                  Saída: {registro.saida || "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const HorarioItem = ({
  label,
  value,
  isDarkMode,
}: {
  label: string;
  value: string;
  isDarkMode?: boolean;
}) => (
  <View style={{ 
    width: "30%", 
    marginBottom: 8,
    alignItems: "center",
  }}>
    <Text
      style={{
        fontWeight: "600",
        color: isDarkMode ? "#ccc" : "#495057",
        fontSize: 12,
        marginBottom: 2,
      }}
    >
      {label}:
    </Text>
    <Text
      style={{
        color: isDarkMode ? "#fff" : "#22223b",
        fontWeight: "bold",
        fontSize: 14,
      }}
    >
      {value}
    </Text>
  </View>
);

export default DetailsMonitor;