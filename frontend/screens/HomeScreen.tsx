import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import axios from "axios";
import {
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
} from "../types/navigation";
import { useSwineContext } from "../context/SwineContext";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

const SwineCard = ({ item, onPress, confirmDeleteSwine }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[styles.cardStyle, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.idText}>{item.id}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        <TouchableOpacity onPress={() => confirmDeleteSwine(item.id)}>
          <MaterialIcons name="delete-outline" size={24} color="black" />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { swines, loading, error, deleteSwine } = useSwineContext();

  const confirmDeleteSwine = (swineId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this swine?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteSwine(swineId),
        },
      ]
    );
  };

  const handleDeleteSwine = (swineId: string) => {
    axios
      .delete(`http://192.168.42.9:5000/api/swine/${swineId}`)
      .then(() => {
        deleteSwine(swineId);
      })
      .catch((error) => console.error("Error deleting swine", error));
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  const renderSwineItem = ({ item }: any) => (
    <SwineCard
      item={item}
      onPress={() => navigation.navigate("Swine Detail", { swineId: item.id })}
      confirmDeleteSwine={confirmDeleteSwine}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={swines}
        keyExtractor={(item) => item.id}
        renderItem={renderSwineItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No swine data available.</Text>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Add Swine")}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F5F5",
  },
  cardStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 3,
  },
  infoContainer: {
    flex: 1,
  },
  idText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#28a745",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});

export default HomeScreen;
