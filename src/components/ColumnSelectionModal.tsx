import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TableStyle } from "../style/TableStyle";
import { professorLabels } from "../utils/translateObject";

interface ColumnSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  columnOptions: string[];
  selectedColumns: string[];
  setSelectedColumns: (columns: string[]) => void;
  onConfirm: () => void;
}

const ColumnSelectionModal: React.FC<ColumnSelectionModalProps> = ({
  isVisible,
  onClose,
  columnOptions,
  selectedColumns,
  setSelectedColumns,
  onConfirm,
}) => {
  const renderColumnCheckbox = (label: string) => (
    <TouchableOpacity
      key={label}
      style={TableStyle.checkboxContainer}
      onPress={() => {
        const updatedColumns = selectedColumns.includes(label)
          ? selectedColumns.filter((col) => col !== label)
          : [...selectedColumns, label];
        setSelectedColumns(updatedColumns);
      }}
      activeOpacity={0.7}
    >
      <Text
        style={[
          TableStyle.checkbox,
          selectedColumns.includes(label) && TableStyle.checked,
        ]}
      >
        {selectedColumns.includes(label) ? "☑" : "☐"}
      </Text>
      <Text>{professorLabels[label] || label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Selecionar colunas</Text>
          <View style={styles.filterGroup}>
            {columnOptions.length > 0 ? (
              columnOptions.map((col) => renderColumnCheckbox(col))
            ) : (
              <Text style={styles.emptyText}>Nenhuma coluna disponível</Text>
            )}
          </View>
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    overflow: "scroll",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterGroup: {
    width: "100%",
    maxHeight: "100%",
    overflow: "scroll",
    padding: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  cancelText: {
    color: "black",
    fontWeight: "bold",
  },
  emptyText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default ColumnSelectionModal;
