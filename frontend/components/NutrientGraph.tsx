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
  const chartWidth = screenWidth - 40; // Chart width with some padding

  const names = data.map(entry => entry.name);
  const values = data.map(entry => (isNaN(entry.value) ? 0 : parseFloat(entry.value.toFixed(2))));
  const recommendedValues = data.map(entry => parseFloat((recommendations[entry.name.replace(' ', '')] || 0).toFixed(2)));

  const chartData = {
    labels: names.map(name => name.replace('Crude ', '')),
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Bar color for actual feed
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
        width={chartWidth} // Chart width adjusted to fit better
        height={230}
        yAxisLabel=""
        yAxisSuffix="%"
        fromZero
        showValuesOnTopOfBars
        verticalLabelRotation={-45} // Adjusted rotation for better alignment
        withHorizontalLabels={false} // Hide y-axis labels
        xLabelsOffset={14} // Fine-tuned label offset for better alignment
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.3, // Adjust the bar width percentage for better alignment
          style: {
            borderRadius: 16,
          },
          propsForLabels: {
            fontSize: 11, // Adjust label font size
          },
          propsForBackgroundLines: {
            strokeWidth: 0, // Remove grid lines
          },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
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
    paddingLeft: 8, // Reduce the padding on the left-hand side of the chart
    paddingRight: 8, // Adjust right padding if necessary
  },
});

export default NutrientGraph;
