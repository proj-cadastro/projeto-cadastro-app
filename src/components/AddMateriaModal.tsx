import React, { useState } from "react";
import {
  Modal,
  TextInput,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { Button, Card } from "react-native-paper";
import ListPicker from "./atoms/ListPicker";
import { Materia } from "../types/materia";
import { useThemeMode } from "../context/ThemeContext";

interface AddMateriaModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMateria: (materia: Materia) => void;
  professors: any[];
}

const AddMateriaModal: React.FC<AddMateriaModalProps> = ({
  visible,
  onClose,
  onAddMateria,
  professors,
}) => {
  const [newMateria, setNewMateria] = useState<Materia>({
    nome: "",
    cargaHoraria: 0,
    professorId: null,
  });

  const { isDarkMode } = useThemeMode();

  const handleAddMateria = () => {
    if (newMateria.nome.trim() === "") return;
    onAddMateria(newMateria);
    setNewMateria({ nome: "", cargaHoraria: 0, professorId: null });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Card
            style={[
              styles.modalCard,
              { backgroundColor: isDarkMode ? "#232323" : "#fff" },
            ]}
          >
            <Card.Content>
              <Text
                style={[styles.title, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Adicionar Matéria
              </Text>

              <Button mode="text" onPress={onClose} style={styles.closeButton}>
                Fechar
              </Button>

              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Nome da Matéria
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                  },
                ]}
                placeholder="Digite o nome da matéria"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={newMateria.nome}
                onChangeText={(text) =>
                  setNewMateria({ ...newMateria, nome: text })
                }
              />

              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Carga Horária
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#444" : "#ccc",
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                  },
                ]}
                placeholder="Digite a carga horária"
                placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
                value={newMateria.cargaHoraria.toString()}
                onChangeText={(text) =>
                  setNewMateria({
                    ...newMateria,
                    cargaHoraria: parseInt(text, 10) || 0,
                  })
                }
                keyboardType="numeric"
              />

              <Text
                style={[styles.label, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                Professor
              </Text>
              <ListPicker
                items={professors}
                onSelect={(id) =>
                  setNewMateria({ ...newMateria, professorId: id })
                }
                getLabel={(prof) => prof.nome}
                getValue={(prof) => prof.id}
              />

              <Button
                mode="outlined"
                onPress={handleAddMateria}
                labelStyle={{ color: isDarkMode ? "#fff" : "#000" }}
              >
                Adicionar
              </Button>
            </Card.Content>
          </Card>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    width: "90%",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
});

export default AddMateriaModal;
