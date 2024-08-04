import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

interface NutrientData {
  name: string;
  value: number;
}

interface Props {
  data: NutrientData[];
  recommendations: { [key: string]: number };
}

const NutrientGraph: React.FC<Props> = ({ data, recommendations }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Adjust width for padding

  // Extract names and values from data
  const names = data.map(entry => entry.name);
  const values = data.map(entry => (isNaN(entry.value) ? 0 : entry.value));
  const recommendedValues = data.map(entry => recommendations[entry.name.replace(' ', '')] || 0);

  // Define the data object for the chart
  const chartData = {
    labels: names.map(name => name.replace('Crude ', '')),
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Bar color
      },
      {
        data: recommendedValues,
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Recommended value color
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrient Composition</Text>
      <BarChart
        data={chartData}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="%"
        fromZero
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: "", // Make the grid lines solid
          },
          propsForHorizontalLabels: {
            fontSize: 10, // Adjust font size for better readability
          },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});

export default NutrientGraph;
