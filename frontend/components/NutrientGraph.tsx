import React from "react";
import { LineChart } from "react-native-chart-kit";
import { View, Dimensions, Text } from "react-native";

type NutrientData = {
  name: string;
  value: number;
};

type NutrientGraphProps = {
  data: NutrientData[];
  recommendations: {
    crudeProtein: number;
    crudeFiber: number;
    crudeFat: number;
    calcium: number;
    moisture: number;
    phosphorus: number;
  };
};

const NutrientGraph: React.FC<NutrientGraphProps> = ({
  data,
  recommendations,
}) => {
  const screenWidth = Dimensions.get("window").width;

  const labels = data.map((item) => item.name);
  const nutrientValues = data.map((item) => item.value);
  const recommendedValues = [
    recommendations.crudeProtein,
    recommendations.crudeFiber,
    recommendations.crudeFat,
    recommendations.calcium,
    recommendations.moisture,
    recommendations.phosphorus,
  ];

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
    propsForLabels: {
      fontSize: 10, // Adjust the font size for labels
    },
    propsForBackgroundLines: {
      strokeDasharray: "", // solid lines for grid
    },
    fillShadowGradient: "#0DA813", // Custom color (Green in this case)
    fillShadowGradientOpacity: 0.2, // Adjust opacity of the fill
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 12,
          marginBottom: 9,
          color: "#515252",
        }}
      >
        Nutrient Analysis
      </Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: nutrientValues,
              color: () => `rgba(0, 255, 0, 1)`, // Green line for actual values
              strokeWidth: 2, // Solid line
            },
            {
              data: recommendedValues,
              color: () => `rgba(255, 165, 0, 1)`, // Orange line for recommended values
              strokeWidth: 2, // Solid line
            },
          ],
          legend: ["Actual", "Recommended"],
        }}
        width={screenWidth - 35} // Slightly increase the width to utilize space
        height={280}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 20, // Add some padding to the right to balance the chart
          paddingLeft: 0, // Remove left padding to compensate for no Y-axis labels
        }}
        fromZero={true} // Start the graph from zero
        xLabelsOffset={-10} // Adjust label position slightly
        verticalLabelRotation={35} // Rotate x-axis labels by 45 degrees
        yAxisLabel={""} // Remove Y-axis label
        withInnerLines={true} // Keep inner grid lines
        withOuterLines={false} // Remove outer grid lines
        withHorizontalLabels={false} // Remove Y-axis labels
      />
    </View>
  );
};

export default NutrientGraph;
