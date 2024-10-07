// frontend/src/screens/GraphScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
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
    axios.get(`http://192.168.42.9:5000/api/swine/${swineId}/weights`)
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
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Graph weightEntries={weightEntries} swineAgeInWeeks={0} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});

export default GraphScreen;
