import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NutrientCardProps {
  title: string;
  value: number | string;
  unit?: string;
  isDeficient?: boolean;
  recommendation?: number;
}

const NutrientAnalysisScreen_style: React.FC<NutrientCardProps> = ({
  title,
  value,
  unit = "",
  isDeficient,
  recommendation,
}) => {
  const formattedValue = typeof value === "number" ? value.toFixed(2) : value;
  const formattedRecommendation =
    recommendation !== undefined ? recommendation.toFixed(2) : undefined;

  return (
    <View style={[styles.card, isDeficient && styles.deficient]}>
      {/* First Row: Nutrient title and value */}
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {formattedValue}
          {unit}
        </Text>
      </View>

      {/* Second Row: Deficient and Recommended Percentage */}
      {isDeficient && (
        <View style={styles.row}>
          <Text style={styles.deficientText}>Deficient</Text>
          {formattedRecommendation !== undefined && (
            <Text style={styles.recommendation}>
              Recommended: {formattedRecommendation}
              {unit}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  deficient: {
    borderColor: "red",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Align items left and right
    width: "100%", // Full width row
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "green",
  },
  recommendation: {
    fontSize: 14,
    color: "grey",
  },
  deficientText: {
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});

export default NutrientAnalysisScreen_style;
