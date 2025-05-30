// styles/TableStyle.ts
import { StyleSheet } from "react-native";

export const TableStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  menuContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 100, // ajuste o valor conforme desejar
  },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    gap: 32,
    position: "relative",
    zIndex: 20,
  },
  filterGroup: {
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
  },
  submenuOverlay: {
    position: "absolute",
    top: 32,
    left: "50%",
    transform: [{ translateX: -80 }],
    zIndex: 100,
    width: 160,
    alignItems: "center",
  },
  submenu: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 120,
  },
  checkboxRow: { flexDirection: "row", justifyContent: "space-between" },
  checkboxGroup: { flex: 1, marginRight: 8 },
  subtitle: { fontWeight: "bold", marginBottom: 8 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkbox: { marginRight: 6, fontSize: 16 },
  checked: { color: "#007bff" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  table: { marginTop: 20 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 8,
  },
  headerCell: {
    color: "#fff",
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 2,
    gap: 16,
  },
  cleanOptionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cleanOptionText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "400",
  },
  printButtonContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 24,
    fontSize: 16,
    color: "#888",
  },
});
