// faqScreen_styles.ts
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f6f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 1,
    marginBottom: 20,
    color: "#515252",
  },
  searchInput: {
    height: 45,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  groupContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    marginVertical: 10,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    marginBottom: 10,
    borderRadius: 10,
  },
  activeItem: {
    backgroundColor: "#E8F5E9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 5,
    marginLeft: 15,
  },
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1, // Ensure text doesn't overlap with arrow
  },
  activeQuestion: {
    color: "#4CAF50",
  },
  answer: {
    paddingTop: 10,
    fontSize: 14,
    color: "#666",
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noResultsText: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    marginTop: 50,
  },
  arrow: {
    marginLeft: 10, // Add spacing between the question and arrow
  },
});
