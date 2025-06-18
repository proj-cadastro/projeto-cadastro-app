import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function HamburgerMenu() {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    setVisible(false);
    logout();
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
            <ScrollView contentContainerStyle={styles.menuItemsContainer}>

              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/logo_fatec_cor.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>


              {/* Item solto */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setVisible(false);
                  navigation.navigate("Home" as never);
                }}
              >
                <View style={styles.iconRow}>
                  <Icon name="home" size={20} style={styles.iconItem} />
                  <Text style={styles.menuText}>Início</Text>
                </View>
              </TouchableOpacity>

              {/* Separador */}
              <View style={styles.separator} />

              {/* Seção Professor */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Professor</Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("ListProfessors" as never);
                  }}
                >
                  <View style={styles.iconRow}>
                    <Icon name="list" size={20} style={styles.iconItem} />
                    <Text style={styles.menuText}>Lista</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("RegisterProfessorsIndex" as never);
                  }}
                >
                  <View style={styles.iconRow}>
                    <Icon name="person-add" size={20} style={styles.iconItem} />
                    <Text style={styles.menuText}>Cadastro</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Separador */}
              <View style={styles.separator} />

              {/* Seção Curso */}
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryLabel}>Curso</Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("ListCourses" as never);
                  }}
                >
                  <View style={styles.iconRow}>
                    <Icon name="list-alt" size={20} style={styles.iconItem} />
                    <Text style={styles.menuText}>Lista</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setVisible(false);
                    navigation.navigate("RegisterCursosIndex" as never);
                  }}
                >
                  <View style={styles.iconRow}>
                    <Icon name="playlist-add" size={20} style={styles.iconItem} />
                    <Text style={styles.menuText}>Cadastro</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.logoutButton}>
              <TouchableOpacity onPress={() => {
                setVisible(false)
                navigation.navigate("SupportPage" as never)
              }}>
                <View style={[styles.iconRow, { marginBottom: 30 }]}>
                  <Icon name="contact-support" size={20} style={styles.iconItem} />
                  <Text style={styles.menuText}>Falar com Suporte</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleLogout}>
                <View style={styles.iconRow}>
                  <Icon name="logout" size={20} color="#d00" style={styles.iconItem} />
                  <Text style={styles.logoutText}>Sair</Text>
                </View>
              </TouchableOpacity>

            </View>
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
    height: "100%",
    width: 250,
    justifyContent: "space-between",
  },
  menuItemsContainer: {
    paddingBottom: 20,
    paddingTop: 40,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  categoryContainer: {
    marginBottom: 12,
  },
  categoryLabel: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 6,
  },
  menuItem: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  menuText: {
    fontSize: 16,
  },
  logoutButton: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    fontSize: 18,
    color: "#d00",
    fontWeight: "bold",
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconItem: {
    marginRight: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 50,
  },
});
