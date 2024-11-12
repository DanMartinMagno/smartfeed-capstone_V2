import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import axiosInstance from "../api/axiosInstance"; // Use axiosInstance for authenticated requests
import {
  GraphScreenNavigationProp,
  GraphScreenRouteProp,
} from "../types/navigation";
import Graph from "../components/Graph";

type Props = {
  navigation: GraphScreenNavigationProp;
  route: GraphScreenRouteProp;
};

interface WeightEntry {
  date: string;
  weight: number;
}

const GraphScreen: React.FC<Props> = ({ route }) => {
  const { swineId } = route.params;
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch weight entries for the selected swine
    axiosInstance
      .get(`/swine/${swineId}/weights`)
      .then((response) => {
        setWeightEntries(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  }, [swineId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#18BD18" />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Graph
        weightEntries={weightEntries}
        swineAgeInWeeks={0}
        swineID={swineId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: "#f5f5f5",
  },
});

export default GraphScreen;
