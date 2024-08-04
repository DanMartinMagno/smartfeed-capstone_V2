import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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
  addSwine: (swine: Swine) => void;
  addWeight: (swineId: string, weightEntry: WeightEntry) => Swine | undefined;
  editSwine: (updatedSwine: Swine) => void;
  deleteSwine: (swineId: string) => void;
}

const SwineContext = createContext<SwineContextProps | undefined>(undefined);

export const SwineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [swines, setSwines] = useState<Swine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSwines = () => {
    setLoading(true);
    axios.get('http://192.168.42.108:5000/api/swine')
      .then(response => {
        setSwines(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSwines();
  }, []);

  const addSwine = (newSwine: Swine) => {
    setSwines([...swines, newSwine]);
  };

  const addWeight = (swineId: string, weightEntry: WeightEntry): Swine | undefined => {
    const updatedSwines = swines.map(sw =>
      sw.id === swineId ? { ...sw, weights: [...sw.weights, weightEntry] } : sw
    );
    setSwines(updatedSwines);
    return updatedSwines.find(sw => sw.id === swineId);
  };

  const editSwine = (updatedSwine: Swine) => {
    const updatedSwines = swines.map(sw =>
      sw.id === updatedSwine.id ? updatedSwine : sw
    );
    setSwines(updatedSwines);
  };

  const deleteSwine = (swineId: string) => {
    setSwines(swines.filter(sw => sw.id !== swineId));
  };

  return (
    <SwineContext.Provider value={{ swines, loading, error, fetchSwines, addSwine, addWeight, editSwine, deleteSwine }}>
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
