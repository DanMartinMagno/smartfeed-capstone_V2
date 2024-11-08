import React from "react";
import { View, Text, ScrollView } from "react-native";
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
  console.log("Formulation Data:", formulation);

  return (
    <ScrollView>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {formulation.name}
      </Text>
      <Text style={{ marginVertical: 4 }}>{formulation.description}</Text>

      {/* Display Type and Expiration Date */}
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Type:{" "}
        {formulation.type.charAt(0).toUpperCase() + formulation.type.slice(1)}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Expiration Date:{" "}
        {formulation.expirationDate
          ? new Date(formulation.expirationDate).toLocaleDateString()
          : "N/A"}
      </Text>

      <Text style={{ fontSize: 16, fontWeight: "600" }}>
        Number of Swine: {formulation.numSwine}
      </Text>
      <Text style={{ marginVertical: 10, fontSize: 18, fontWeight: "600" }}>
        Ingredient Ratios
      </Text>
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
            />
          )
        )
      ) : (
        <Text>No ingredients available</Text>
      )}

      <Text style={{ marginVertical: 10, fontSize: 18, fontWeight: "600" }}>
        Total Nutrients
      </Text>
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
    </ScrollView>
  );
};

export default SavedFormulationDetailScreen;
