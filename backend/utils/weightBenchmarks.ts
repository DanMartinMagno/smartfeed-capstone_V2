// backend/utils/weightBenchmarks.ts

// Function to determine weight benchmarks based on age
export const getWeightBenchmark = (
  age: number
): { min: number; max: number } | null => {
  if (age >= 14 && age <= 28) {
    return { min: 5, max: 35 }; // Starter stage benchmark
  } else if (age >= 29 && age <= 84) {
    return { min: 5, max: 75 }; // Grower stage benchmark
  } else if (age >= 85 && age <= 1000) {
    return { min: 5, max: 1000 }; // Finisher stage benchmark
  }
  return null; // Return null if age is outside expected ranges
};
