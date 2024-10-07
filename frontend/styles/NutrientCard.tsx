import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NutrientCardProps {
  title: string;
  value: number | string;
  unit?: string;
  isDeficient?: boolean;
  recommendation?: number;
  isRatioCard?: boolean;
}

const NutrientCard: React.FC<NutrientCardProps> = ({
  title,
  value,
  unit = "",
  isDeficient,
  recommendation,
  isRatioCard,
}) => {
  // Format value and recommendation
  const formattedValue = typeof value === "number" ? value.toFixed(2) : value;
  const formattedRecommendation =
    recommendation !== undefined ? recommendation.toFixed(2) : undefined;

  return (
    <View
      style={[
        styles.card,
        isDeficient && styles.deficient, // Highlight if deficient
      ]}
      accessible={true} // Accessible for screen readers
      accessibilityLabel={`${title} ${formattedValue} ${unit} ${
        isDeficient ? "deficient" : ""
      }`} // Custom label for better context
    >
      {/* Nutrient Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Nutrient Value with optional ratio pill design */}
      <View style={isRatioCard ? styles.ratioContainer : undefined}>
        <Text style={isRatioCard ? styles.ratioValue : styles.value}>
          {formattedValue}
          {unit}
        </Text>
      </View>

      {/* Deficiency recommendation if applicable */}
      {isDeficient && formattedRecommendation && (
        <Text style={styles.recommendation}>
          Recommended: {formattedRecommendation}
          {unit}
        </Text>
      )}

      {/* Deficient label */}
      {isDeficient && <Text style={styles.deficientText}>Deficient</Text>}
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
    flexDirection: "row",
    justifyContent: "space-between", // Align text on left and right
    alignItems: "center", // Center the text vertically
  },
  deficient: {
    borderColor: "red",
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
    marginTop: 5,
  },
  ratioContainer: {
    backgroundColor: "#28a745", // Green background for ingredient ratios
    paddingVertical: 5, // Vertical padding for pill design
    paddingHorizontal: 10, // Horizontal padding for pill design
    borderRadius: 15, // Rounded corners for pill-like appearance
  },
  ratioValue: {
    color: "white", // White text for contrast inside the green pill
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default NutrientCard;
