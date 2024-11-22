import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#f2f6f9",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0, // Reduced shadow opacity for softer effect
    shadowOffset: { width: 0, height: 0 }, // Slightly reduced shadow offset
    shadowRadius: 0, // Adjusted radius for less intense shadow
    elevation: 1, // Reduced elevation for softer shadow on Android
  },
  cardPressed: {
    opacity: 0.9, // Reduced opacity for pressed effect
    elevation: 2, // Lower elevation when pressed
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBackground: {
    backgroundColor: "rgba(0, 128, 0, 0.2)", // Greenish background for icons
    borderRadius: 50,
    padding: 8,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    fontSize: 15,
    backgroundColor: "#f2f6f9",
  },

  ingredientCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    backgroundColor: "#28a745", // Same green color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "100%", // Full width
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
    padding: 15,
  },
  buttonText: {
    color: "#F6FDF8",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
