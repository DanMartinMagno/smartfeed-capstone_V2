import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, View, Text, StyleSheet } from "react-native";

interface WeightEntry {
  date: string;
  weight: number;
}

interface Props {
  weightEntries: WeightEntry[];
  swineID: string;
  swineAgeInWeeks: number;
}

const calculateStats = (weights: number[], rawDates: string[]) => {
  if (weights.length === 0)
    return { average: 0, max: 0, min: 0, growthRate: 0 };

  const total = weights.reduce((sum, w) => sum + w, 0);
  const average = total / weights.length;
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  // Use raw, unformatted dates for calculations
  const firstDate = new Date(rawDates[0]).getTime();
  const lastDate = new Date(rawDates[rawDates.length - 1]).getTime();
  const daysBetween = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

  const growthRate =
    weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0;

  const weeklyGrowthRate = daysBetween > 0 ? (growthRate / daysBetween) * 7 : 0;

  return { average, max, min, growthRate: weeklyGrowthRate };
};

const Graph: React.FC<Props> = ({ weightEntries, swineID }) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32;

  // Separate raw dates and formatted dates
  const rawDates = weightEntries.map((entry) => entry.date); // Unformatted dates for calculations
  const formattedDates = weightEntries.map((entry) =>
    new Date(entry.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    })
  );

  const weights = weightEntries.map((entry) => entry.weight);
  const labelInterval = Math.ceil(formattedDates.length / 5);

  const data = {
    labels: formattedDates.map((date, index) =>
      index % labelInterval === 0 ? date : ""
    ),
    datasets: [{ data: weights }],
  };

  const { average, max, min, growthRate } = calculateStats(weights, rawDates);

  if (weightEntries.length === 0) {
    return (
      <View>
        <Text style={styles.noDataText}>No weight data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      {/* Swine Info and Graph */}
      <View style={styles.graphContainer}>
        <View style={styles.swineInfoContainer}>
          <Text style={styles.swineID}>Weight progress</Text>
          <Text style={styles.date}>
            Date: {formattedDates[formattedDates.length - 1]}
          </Text>
        </View>

        <LineChart
          data={data}
          width={chartWidth}
          height={220}
          yAxisSuffix=" kg"
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 225, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
            propsForBackgroundLines: {
              strokeDasharray: "",
              stroke: "#FFB03C",
              strokeWidth: 1,
            },
          }}
          style={styles.chart}
        />
      </View>

      <Text style={styles.summaryText}>Weight Summary</Text>

      {/* Statistical Insights - Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <Text style={styles.statText}>Max Weight</Text>
          <Text style={styles.statValue}>{max} kg</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.statText}>Min Weight</Text>
          <Text style={styles.statValue}>{min} kg</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.statText}>Average Weight</Text>
          <Text style={styles.statValue}>{average.toFixed(2)} kg</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.statText}>Growth Rate</Text>
          <Text style={styles.statValue}>
            {growthRate > 0 ? "+" : ""}
            {growthRate.toFixed(2)} kg/week
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 2,
    backgroundColor: "#f2f6f9", // Updated background color
  },
  graphContainer: {
    padding: 5,
    marginTop: 1,
    backgroundColor: "#f2f6f9",
    borderRadius: 16,
    marginVertical: 8,
    alignItems: "center",
    paddingTop: 1,
  },
  swineInfoContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 1,
  },
  swineID: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 1,
    paddingTop: 1,
  },
  date: {
    fontSize: 16,
    color: "#666",
    marginTop: 1,
    paddingTop: 1,
  },
  chart: {
    borderRadius: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 16,
    marginBottom: 1,
    marginTop: 1,
  },
  statsContainer: {
    marginTop: 10,
    paddingHorizontal: 1,
    marginHorizontal: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between", // Label and value in a row
    alignItems: "center",
    marginBottom: 10, // Space between cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2, // Shadow for Android
  },
  statText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28a745", // Green color for value
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Graph;
