import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Alert } from "react-native";

interface WeightEntry {
  date: string;
  weight: number;
  _id: string;
}

interface Swine {
  id: string;
  weight: number;
  age: number;
  date: string;
  weights: WeightEntry[];
}

interface SwineContextProps {
  swines: Swine[];
  loading: boolean;
  error: string;
  fetchSwines: () => void;
  addSwine: (newSwine: Swine) => void;
  deleteSwine: (swineId: string) => void;
  addWeight: (swineId: string, weightEntry: WeightEntry) => void;
  editWeight: (swineId: string, weightId: string, newWeight: number) => void;
  deleteWeight: (swineId: string, weightId: string) => void;
}

const SwineContext = createContext<SwineContextProps | undefined>(undefined);

export const SwineProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [swines, setSwines] = useState<Swine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSwines = () => {
    setLoading(true);
    axios
      .get("http://192.168.42.9:5000/api/swine")
      .then((response) => {
        setSwines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSwines();
  }, []);

  // Function to add a new swine
  const addSwine = (newSwine: Swine) => {
    setSwines([...swines, newSwine]);
  };

  const addWeight = (swineId: string, weightEntry: WeightEntry) => {
    const updatedSwines = swines.map((swine) =>
      swine.id === swineId
        ? {
            ...swine,
            weights: [...swine.weights, weightEntry],
          }
        : swine
    );
    setSwines(updatedSwines);
  };

  const editWeight = (swineId: string, weightId: string, newWeight: number) => {
    const updatedSwines = swines.map((swine) =>
      swine.id === swineId
        ? {
            ...swine,
            weights: swine.weights.map((entry) =>
              entry._id === weightId ? { ...entry, weight: newWeight } : entry
            ),
          }
        : swine
    );
    setSwines(updatedSwines);
  };

  const deleteWeight = async (swineId: string, weightId: string) => {
    try {
      // Find the swine and check if it has more than one weight
      const swine = swines.find((sw) => sw.id === swineId);
      if (!swine) {
        Alert.alert("Error", "Swine not found.");
        return;
      }

      if (swine.weights.length === 1) {
        // Prevent deletion if it's the last weight
        Alert.alert("Error", "Cannot delete the last weight entry.");
        return;
      }

      // Send DELETE request to the backend
      await axios.delete(
        `http://192.168.42.9:5000/api/swine/${swineId}/weights/${weightId}`
      );

      // Update the frontend state by removing the weight
      const updatedSwines = swines.map((swine) =>
        swine.id === swineId
          ? {
              ...swine,
              weights: swine.weights.filter((entry) => entry._id !== weightId),
            }
          : swine
      );
      setSwines(updatedSwines);

      // Optionally refetch swines from backend to ensure frontend state syncs with backend
      await fetchSwines();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "Unknown error occurred";
        Alert.alert("Error", errorMessage);
      } else {
        console.error("Error deleting weight entry", error);
        Alert.alert("Error", "Failed to delete the weight entry.");
      }
    }
  };

  const deleteSwine = (swineId: string) => {
    setSwines(swines.filter((swine) => swine.id !== swineId));
  };

  return (
    <SwineContext.Provider
      value={{
        swines,
        loading,
        error,
        fetchSwines,
        addSwine, // Ensure addSwine is provided here
        addWeight,
        editWeight,
        deleteWeight,
        deleteSwine,
      }}
    >
      {children}
    </SwineContext.Provider>
  );
};

export const useSwineContext = () => {
  const context = useContext(SwineContext);
  if (!context) {
    throw new Error("useSwineContext must be used within a SwineProvider");
  }
  return context;
};
