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
      <Text>{formulation.name}</Text>
      <Text>{formulation.description}</Text>

      <Text>Ingredient Ratios</Text>
      {formulation.ingredients && formulation.ingredients.length > 0 ? (
        formulation.ingredients.map(
          (
            ingredient: { ingredient: string; amount: number | undefined },
            index: React.Key | null | undefined
          ) => (
            <NutrientCard
              key={index}
              title={ingredient.ingredient || "Unnamed Ingredient"}
              value={`${(ingredient.amount ?? 0).toFixed(2)} kg`}
            />
          )
        )
      ) : (
        <Text>No ingredients available</Text>
      )}

      <Text>Total Nutrients</Text>
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
