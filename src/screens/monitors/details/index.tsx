import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import HamburgerMenu from "../../../components/HamburgerMenu";
import RegistroPontoModal from "../../../screens/monitors/registrar-ponto"; // ADICIONADO: Import do modal
import { TableStyle } from "../../../style/TableStyle";
import { FormStyles } from "../../../style/FormStyles";
import { NavigationProp } from "../../../routes/rootStackParamList ";
import { useThemeMode } from "../../../context/ThemeContext";

const DetailsMonitor = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<{ params: { id: number } }, "params">>();
  const { isDarkMode } = useThemeMode();

  // ADICIONADO: Estado para controlar o modal
  const [modalVisible, setModalVisible] = useState(false);

  const id = route.params?.id;
  
  // Dados mockados do monitor baseados na imagem
  const monitor = {
    id: id,
    nome: "João Silva",
    cronograma: {
      entrada: "08:00",
      saida: "Não definida",
      horarios: {
        segunda: "2h",
        terca: "2h", 
        quarta: "2h",
        quinta: "1h",
        sexta: "1h"
      }
    }
  };

  // ADICIONADO: Função para abrir o modal
  const handleRegistrarPonto = () => {
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#fff" }}>
      <View style={TableStyle.menuContainer}>
        <HamburgerMenu />
      </View>
      
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 10,
        }}
      >
        <Button
          onPress={() => navigation.goBack()}
          style={FormStyles.goBackButton}
          labelStyle={{ color: "white" }}
        >
          Voltar
        </Button>
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
              Horários
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
              onPress={() => {
                // Simular ação de ver registro
                console.log("Ver registro");
              }}
            >
              VER REGISTRO
            </Button>
          </View>
        </View>
      ) : (
        <Text style={[
          TableStyle.emptyText,
          { color: isDarkMode ? "#fff" : "#000" }
        ]}>Monitor não encontrado.</Text>
      )}

      {/* ADICIONADO: Modal de registro de ponto */}
      <RegistroPontoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        monitorNome={monitor?.nome || "Monitor"}
        isDarkMode={isDarkMode}
      />
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