
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  itemContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
  },
  activeItem: {
    backgroundColor: "#E8F5E9", // Light green background when expanded
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Ensure text and icon are aligned properly
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 5,
  },
  activeQuestion: {
    color: "#4CAF50",
  },
  answer: {
    paddingTop: 10,
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 25,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 2,
  },
});
