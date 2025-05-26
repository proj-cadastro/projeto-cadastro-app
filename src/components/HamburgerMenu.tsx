import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const menuItems = [
  { label: "Início", route: "Home" },
  { label: "Lista de Professores", route: "ListProfessors" },
  { label: "Cadastrar Professores", route: "RegisterProfessorsIndex" },
  { label: "Lista de Cursos", route: "ListCourses" },
  { label: "Cadastrar Cursos", route: "RegisterCourses" },
];

export default function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = () => {
    setVisible(false);
    // Aqui você pode adicionar lógica de logout se necessário
    navigation.navigate("Login" as never);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.icon}>
        <Text style={{ fontSize: 40 }}>☰</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menu}>
            <View style={styles.menuItemsContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.route}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate(item.route as never);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText} onPress={handleLogout}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    marginTop: 30,
  },
  overlay: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menu: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 0,
    marginLeft: 0,
    borderRadius: 0,
    elevation: 5,
    minWidth: 200,
    height: "100%",
    justifyContent: "space-between",
  },
  menuItemsContainer: {
    flex: 1,
    marginTop: 40,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 18,
  },
  logoutButton: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    fontSize: 18,
    color: "#d00",
    fontWeight: "bold",
  },
});
