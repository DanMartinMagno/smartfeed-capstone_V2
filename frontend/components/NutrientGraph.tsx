import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Dimensions, Text } from 'react-native';

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
  const screenWidth = Dimensions.get('window').width;

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
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    propsForLabels: {
      fontSize: 10,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
    },
    fillShadowGradient: '#0DA813',
    fillShadowGradientOpacity: 0.2,
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginTop: 12,
          marginBottom: 9,
          color: '#515252',
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
              color: () => `rgba(0, 255, 0, 1)`,
              strokeWidth: 2,
            },
            {
              data: recommendedValues,
              color: () => `rgba(255, 165, 0, 1)`,
              strokeWidth: 2,
            },
          ],
          legend: ['Actual', 'Recommended'],
        }}
        width={screenWidth - 35}
        height={280}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
          paddingRight: 20,
          paddingLeft: 0,
        }}
        fromZero={true}
        xLabelsOffset={-10}
        verticalLabelRotation={35}
        yAxisLabel={''}
        withInnerLines={true}
        withOuterLines={false}
        withHorizontalLabels={false}
      />
    </View>
  );
};

export default NutrientGraph;
