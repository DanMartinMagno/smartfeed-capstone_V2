import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import NutrientCard from "../styles/NutrientCard";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type SavedFormulationDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "SavedFormulationDetail"
>;

interface Props {
  route: SavedFormulationDetailScreenRouteProp;
}

const SavedFormulationDetailScreen: React.FC<Props> = ({ route }) => {
  const { formulation } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>{formulation.name}</Text>

        <View style={styles.cardContent}>
          <Text style={styles.description}>{formulation.description}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>
              {formulation.type.charAt(0).toUpperCase() +
                formulation.type.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Number of Swine</Text>
            <Text style={styles.detailValue}>{formulation.numSwine}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiration Date</Text>
            <Text style={styles.detailValue}>
              {formulation.expirationDate
                ? new Date(formulation.expirationDate).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Ingredient Ratios</Text>
        {formulation.ingredients && formulation.ingredients.length > 0 ? (
          formulation.ingredients.map(
            (
              ingredient: { name: string; amount: number | undefined },
              index: number
            ) => (
              <NutrientCard
                key={index}
                title={ingredient.name || "Unnamed Ingredient"}
                value={`${(ingredient.amount ?? 0).toFixed(2)} kg`}
                isRatioCard // Pass this prop to apply pill styling inside the card
              />
            )
          )
        ) : (
          <Text style={styles.noIngredientsText}>No ingredients available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subHeader}>Total Nutrients</Text>
        <NutrientCard
          title="Crude Protein"
          value={`${(formulation.totalNutrients?.crudeProtein ?? "N/A").toFixed(2)}`}
          unit="%"
        />
        <NutrientCard
          title="Crude Fiber"
          value={`${(formulation.totalNutrients?.crudeFiber ?? "N/A").toFixed(2)}`}
          unit="%"
        />
        <NutrientCard
          title="Crude Fat"
          value={`${(formulation.totalNutrients?.crudeFat ?? "N/A").toFixed(2)}`}
          unit="%"
        />
        <NutrientCard
          title="Calcium"
          value={`${(formulation.totalNutrients?.calcium ?? "N/A").toFixed(2)}`}
          unit="%"
        />
        <NutrientCard
          title="Moisture"
          value={`${(formulation.totalNutrients?.moisture ?? "N/A").toFixed(2)}`}
          unit="%"
        />
        <NutrientCard
          title="Phosphorus"
          value={`${(formulation.totalNutrients?.phosphorus ?? "N/A").toFixed(2)}`}
          unit="%"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f2f6f9",
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#39AD3D",
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardContent: {},
  description: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    color: "#fff",
  },
  section: {
    marginVertical: 10,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#4C4C4C",
    marginTop: 1,
  },
  noIngredientsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default SavedFormulationDetailScreen;
