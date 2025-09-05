import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import axiosInstance from '../api/axiosInstance';

interface WeightEntry {
  date: string;
  weight: number;
  _id: string;
}

interface Swine {
  ageInWeeks: any;
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
  clearSwines: () => void;
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
  const [error, setError] = useState('');

  const fetchSwines = () => {
    setError('');
    setLoading(true); // Show loading while retrying

    axiosInstance
      .get('/swine')
      .then((response) => {
        setSwines(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching swine data. Please try again.');
        setLoading(false);
      });
  };

  // Function to clear swine data, used on logout
  const clearSwines = () => {
    setSwines([]);
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
      // Find the specific swine by ID in the current context state
      const swine = swines.find((sw) => sw.id === swineId);
      if (!swine) {
        Alert.alert('Error', 'Swine not found.');
        return;
      }

      // Check if this is the last weight entry to prevent deletion
      if (swine.weights.length === 1) {
        Alert.alert('Error', 'Cannot delete the last weight entry.');
        return;
      }

      // Send DELETE request to the backend to remove the weight entry for this swine
      await axiosInstance.delete(`/swine/${swineId}/weights/${weightId}`);

      // Update the local state by removing the specified weight entry
      const updatedSwines = swines.map((swine) =>
        swine.id === swineId
          ? {
              ...swine,
              weights: swine.weights.filter((entry) => entry._id !== weightId),
            }
          : swine
      );
      setSwines(updatedSwines);

      // Optionally refetch all swine data to sync the frontend state with the backend
      await fetchSwines();
    } catch (error) {
      // Handle Axios-specific errors and show appropriate alerts
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || 'Unknown error occurred';
        Alert.alert('Error', errorMessage);
      } else {
        // Log unexpected errors and show a generic alert
        console.error('Error deleting weight entry', error);
        Alert.alert('Error', 'Failed to delete the weight entry.');
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
        clearSwines,
        addSwine,
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
    throw new Error('useSwineContext must be used within a SwineProvider');
  }
  return context;
};
