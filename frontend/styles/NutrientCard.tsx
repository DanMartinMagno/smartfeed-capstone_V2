import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientCardProps {
  title: string;
  value: number | string;
  unit?: string;
  isDeficient?: boolean;
  recommendation?: number;
}

const NutrientCard: React.FC<NutrientCardProps> = ({ title, value, unit, isDeficient, recommendation }) => {
  const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
  const formattedRecommendation = recommendation !== undefined ? recommendation.toFixed(2) : undefined;

  return (
    <View style={[styles.card, isDeficient && styles.deficient]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{formattedValue}{unit}</Text>
      {formattedRecommendation !== undefined && (
        <Text style={styles.recommendation}>Recommended: {formattedRecommendation}{unit}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  deficient: {
    borderColor: 'red',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: 'green',
  },
  recommendation: {
    fontSize: 14,
    color: 'grey',
  },
});

export default NutrientCard;
