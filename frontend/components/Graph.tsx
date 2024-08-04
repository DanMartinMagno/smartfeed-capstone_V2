// frontend/src/components/Graph.tsx
import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

interface WeightEntry {
  date: string;
  weight: number;
}

interface Props {
  weightEntries: WeightEntry[];
}

const Graph: React.FC<Props> = ({ weightEntries }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // Adjust width for padding

  // Extract dates and weights from weightEntries
  const dates = weightEntries.map(entry => new Date(entry.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
  }));
  const weights = weightEntries.map(entry => entry.weight);

  // Define label interval based on the number of entries
  const labelInterval = Math.ceil(dates.length / 5);

  // Define the data object for the chart
  const data = {
    labels: dates.map((date, index) => (index % labelInterval === 0 ? date : '')),
    datasets: [
      {
        data: weights,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>
      <LineChart
        data={data}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 0, // Set decimal places to 0
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
          propsForBackgroundLines: {
            strokeDasharray: "", // Make the grid lines solid
            stroke: '#FFB03C',
            strokeWidth: 1, // Adjust the width for better visibility
          },
        }}
        style={styles.chart}
        xLabelsOffset={-5}
        yLabelsOffset={5}
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
    marginRight: 0, // Adjust margin to avoid overlap
  },
});

export default Graph;
