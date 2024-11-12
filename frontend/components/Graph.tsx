import React from "react";
import { ScrollView, Dimensions, View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface WeightEntry {
  date: string;
  weight: number;
}

interface Props {
  weightEntries: WeightEntry[];
  swineID: string;
  swineAgeInWeeks: number;
}

// Define expected weekly growth rates for each stage (these values are examples)
const expectedGrowthRates = {
  starter: { min: 0.8, max: 1.2 }, // in kg/week
  grower: { min: 1.3, max: 1.7 },
  finisher: { min: 1.8, max: 2.2 },
};

const calculateStats = (weights: number[], rawDates: string[]) => {
  if (weights.length === 0)
    return { average: 0, max: 0, min: 0, growthRate: 0, hasWeightDrop: false };

  const total = weights.reduce((sum, w) => sum + w, 0);
  const average = total / weights.length;
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  const firstDate = new Date(rawDates[0]).getTime();
  const lastDate = new Date(rawDates[rawDates.length - 1]).getTime();
  const daysBetween = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

  const growthRate =
    weights.length > 1 ? weights[weights.length - 1] - weights[0] : 0;

  const weeklyGrowthRate = daysBetween > 0 ? (growthRate / daysBetween) * 7 : 0;

  // Check for any weight drop
  let hasWeightDrop = false;
  for (let i = 1; i < weights.length; i++) {
    if (weights[i] < weights[i - 1]) {
      hasWeightDrop = true;
      break;
    }
  }

  return { average, max, min, growthRate: weeklyGrowthRate, hasWeightDrop };
};

const getGrowthInsights = (
  growthRate: number,
  ageInWeeks: number,
  hasWeightDrop: boolean
): string => {
  let stage = "";
  let expectedRange = { min: 0, max: 0 };

  if (ageInWeeks >= 2 && ageInWeeks <= 4) {
    stage = "starter";
    expectedRange = expectedGrowthRates.starter;
  } else if (ageInWeeks >= 5 && ageInWeeks <= 12) {
    stage = "grower";
    expectedRange = expectedGrowthRates.grower;
  } else if (ageInWeeks > 12) {
    stage = "finisher";
    expectedRange = expectedGrowthRates.finisher;
  }

  if (hasWeightDrop) {
    return `Alert: Weight has decreased in a recent entry. This could indicate a health issue or other factors affecting growth. Please monitor this swine closely.`;
  } else if (growthRate < expectedRange.min) {
    return `Growth rate is below the expected range for the ${stage} stage. Consider checking the health or diet of the swine.`;
  } else if (growthRate > expectedRange.max) {
    return `Growth rate is above the expected range for the ${stage} stage. Monitor the swine for any potential health concerns.`;
  } else {
    return `Growth rate is within the expected range for the ${stage} stage. The swine is growing as expected.`;
  }
};

const Graph: React.FC<Props> = ({
  weightEntries,
  swineID,
  swineAgeInWeeks,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32;

  const rawDates = weightEntries.map((entry) => entry.date);
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

  const { average, max, min, growthRate, hasWeightDrop } = calculateStats(
    weights,
    rawDates
  );

  const growthInsights = getGrowthInsights(
    growthRate,
    swineAgeInWeeks,
    hasWeightDrop
  );

  if (weightEntries.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No weight data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.pageContainer}>
      <View style={styles.graphContainer}>
        <View style={styles.swineInfoContainer}>
          <Text style={styles.swineID}>Weight Progress</Text>
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

      {/* Growth Insights Message */}
      <View style={styles.insightContainer}>
        <Text style={styles.insightText}>{growthInsights}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f6f9", // Updated background color
  },
  graphContainer: {
    padding: 3,
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

  insightText: {
    fontSize: 16,

    color: "#333",
    backgroundColor: "#E7E7FD",
    padding: 10,
    borderRadius: 8,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  insightContainer: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
    textAlign: "center",
    backgroundColor: "#E7E7FD",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default Graph;
