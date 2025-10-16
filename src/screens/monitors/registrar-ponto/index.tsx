import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

interface RegistroPontoModalProps {
  visible: boolean;
  onClose: () => void;
  monitorNome: string;
  isDarkMode?: boolean;
}

const RegistroPontoModal: React.FC<RegistroPontoModalProps> = ({
  visible,
  onClose,
  monitorNome,
  isDarkMode = false,
}) => {
  // Dados mockados dos registros baseados na imagem
  const registros = [
    {
      dia: "Quarta-feira",
      entrada: "08:00",
      saida: "12:00",
      entrada2: "09:00",
      saida2: "13:00"
    },
    {
      dia: "Terça-feira",
      entrada: "9a",
      saida: "13:00"
    },
    {
      dia: "Segunda",
      entrada: "08:30",
      saida: "12:30"
    }
  ];

  const handleRegistrarPonto = () => {
    // Lógica para registrar ponto
    console.log("Ponto registrado!");
    // Pode adicionar aqui a lógica de API
    onClose();
  };

  const handleVerRegistro = () => {
    // Lógica para ver registros completos
    console.log("Ver registros completos");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContainer,
          { backgroundColor: isDarkMode ? "#232323" : "#fff" }
        ]}>
          {/* Header com botão fechar */}
          <View style={styles.modalHeader}>
            <Text style={[
              styles.modalTitle,
              { color: isDarkMode ? "#fff" : "#000" }
            ]}>
              REGISTRO DE PONTO
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={isDarkMode ? "#fff" : "#000"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Nome do monitor */}
            <Text style={[
              styles.monitorName,
              { color: isDarkMode ? "#fff" : "#000" }
            ]}>
              {monitorNome}
            </Text>

            {/* Lista de registros */}
            <View style={styles.registrosContainer}>
              {registros.map((registro, index) => (
                <View key={index} style={[
                  styles.registroItem,
                  { backgroundColor: isDarkMode ? "#181818" : "#f8f9fa" }
                ]}>
                  <Text style={[
                    styles.diaText,
                    { color: isDarkMode ? "#fff" : "#000" }
                  ]}>
                    <Text style={styles.diaBold}>{registro.dia}</Text>
                    {registro.entrada && registro.saida && (
                      <Text> - {registro.entrada}, Saída: {registro.saida}</Text>
                    )}
                  </Text>
                  
                  {/* Segundo horário se existir */}
                  {registro.entrada2 && registro.saida2 && (
                    <Text style={[
                      styles.horarioExtra,
                      { color: isDarkMode ? "#ccc" : "#666" }
                    ]}>
                      Entrada: {registro.entrada2}, Saída: {registro.saida2}
                    </Text>
                  )}
                  
                  {/* Caso especial para terça-feira */}
                  {registro.dia === "Terça-feira" && (
                    <Text style={[
                      styles.horarioExtra,
                      { color: isDarkMode ? "#ccc" : "#666" }
                    ]}>
                      Entrada: {registro.entrada}: {registro.saida}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Botões de ação */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={styles.registrarButton}
              labelStyle={{ color: "white", fontWeight: "bold" }}
              onPress={handleRegistrarPonto}
            >
              REGISTRAR PONTO
            </Button>

            <Button
              mode="contained"
              style={styles.verRegistroButton}
              labelStyle={{ color: "white", fontWeight: "bold" }}
              onPress={handleVerRegistro}
            >
              VER REGISTRO
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: 400,
  },
  monitorName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  registrosContainer: {
    marginBottom: 16,
  },
  registroItem: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#007bff",
  },
  diaText: {
    fontSize: 14,
    color: "#000",
    lineHeight: 20,
  },
  diaBold: {
    fontWeight: "bold",
  },
  horarioExtra: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    paddingLeft: 8,
  },
  buttonContainer: {
    padding: 16,
    gap: 12,
  },
  registrarButton: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
  },
  verRegistroButton: {
    backgroundColor: "#343a40",
    borderRadius: 8,
  },
});

export default RegistroPontoModal;