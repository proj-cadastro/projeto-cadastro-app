import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

interface RegistroPontoModalProps {
  visible: boolean;
  onClose: () => void;
  monitorNome: string;
  isDarkMode?: boolean;
  onConfirm: (entrada: string, saida: string) => void;
  tipo: "entrada" | "saida";
}

const pad = (n: number) => n.toString().padStart(2, "0");

const RegistroPontoModal: React.FC<RegistroPontoModalProps> = ({
  visible,
  onClose,
  monitorNome,
  isDarkMode = false,
  onConfirm,
  tipo,
}) => {
  const now = new Date();
  const [hora, setHora] = useState<number>(now.getHours());
  const [minuto, setMinuto] = useState<number>(now.getMinutes());

  const incrementHora = () => setHora((prev) => (prev + 1) % 24);
  const decrementHora = () => setHora((prev) => (prev === 0 ? 23 : prev - 1));
  const incrementMinuto = () => setMinuto((prev) => (prev + 1) % 60);
  const decrementMinuto = () => setMinuto((prev) => (prev === 0 ? 59 : prev - 1));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              {tipo === "entrada" ? "REGISTRAR ENTRADA" : "REGISTRAR SAÍDA"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.monitorName,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {monitorNome}
          </Text>

          <Text
            style={{
              color: isDarkMode ? "#fff" : "#000",
              marginBottom: 8,
            }}
          >
            Selecione o horário de {tipo === "entrada" ? "entrada" : "saída"}:
          </Text>

          {/* Campo de hora e minuto com setas */}
          <View style={styles.timeRow}>
            {/* Hora */}
            <TouchableOpacity onPress={decrementHora} style={styles.arrowButton}>
              <Icon name="chevron-left" size={32} color="#28a745" />
            </TouchableOpacity>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{pad(hora)}</Text>
            </View>
            <TouchableOpacity onPress={incrementHora} style={styles.arrowButton}>
              <Icon name="chevron-right" size={32} color="#28a745" />
            </TouchableOpacity>

            <Text style={styles.colon}>:</Text>

            {/* Minuto */}
            <TouchableOpacity onPress={decrementMinuto} style={styles.arrowButton}>
              <Icon name="chevron-left" size={32} color="#28a745" />
            </TouchableOpacity>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{pad(minuto)}</Text>
            </View>
            <TouchableOpacity onPress={incrementMinuto} style={styles.arrowButton}>
              <Icon name="chevron-right" size={32} color="#28a745" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: isDarkMode ? "#fff" : "#000",
              fontSize: 16,
              marginVertical: 16,
              textAlign: "center",
            }}
          >
            Horário selecionado: {pad(hora)}:{pad(minuto)}
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              style={{
                backgroundColor: tipo === "entrada" ? "#28a745" : "#dc3545",
                borderRadius: 8,
              }}
              onPress={() =>
                onConfirm(
                  `${pad(hora)}:${pad(minuto)}`,
                  tipo === "entrada" ? "Não definida" : `${pad(hora)}:${pad(minuto)}`
                )
              }
            >
              {tipo === "entrada" ? "REGISTRAR ENTRADA" : "REGISTRAR SAÍDA"}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  closeButton: {
    padding: 4,
  },
  monitorName: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  arrowButton: {
    padding: 4,
  },
  timeBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  timeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#22223b",
  },
  colon: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 8,
    color: "#22223b",
  },
  buttonContainer: {
    padding: 16,
    width: "100%",
  },
});

export default RegistroPontoModal;