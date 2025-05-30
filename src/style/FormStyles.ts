import { StyleSheet, Dimensions } from "react-native";

const screenHeight = Dimensions.get("window").height;

export const FormStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 25,
  },
  description: {
    color: "#757575",
    marginTop: 4,
    marginBottom: 10,
    fontSize: 15,
  },
  container: {
    height: screenHeight * 0.8, // 80% da altura da tela
    width: "95%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    height: "100%",
    flex: 1,
  },
  input: {
    borderColor: "#D9D9D9",
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#444",
    width: "100%",
    borderRadius: 12,
    borderWidth: 0,
  },
  goBackButton: {
    marginLeft: "auto",
    margin: 10,
    backgroundColor: "#444",
  },
});
