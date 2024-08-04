// __tests__/feedService.test.ts

import { feedFormulation } from '../services/feedService';

describe('Feed Formulation Service', () => {
  it('should calculate the correct ingredient amounts and total nutrients for 5 swine', () => {
    const selectedIngredients = ['Coconut Residue', 'Water Spinach', 'Cassava Leaves'];
    const type = 'starter';
    const numSwine = 5;

    const result = feedFormulation(selectedIngredients, type, numSwine);

    console.log(result); // Debug log

    expect(result.ingredientAmounts).toEqual([
      { ingredient: 'Coconut Residue', amount: expect.any(Number) },
      { ingredient: 'Water Spinach', amount: expect.any(Number) },
      { ingredient: 'Cassava Leaves', amount: expect.any(Number) },
    ]);

    expect(result.totalNutrients).toEqual({
      crudeProtein: expect.any(Number),
      crudeFiber: expect.any(Number),
      crudeFat: expect.any(Number),
      calcium: expect.any(Number),
      moisture: expect.any(Number),
      phosphorus: expect.any(Number),
    });

    // Ensure the total crude protein matches the expected value for the given input
    expect(result.totalNutrients.crudeProtein).toBeCloseTo(15.05, 2);
  });

  it('should recalculate the correct ingredient amounts and total nutrients for 8 swine', () => {
    const selectedIngredients = ['Coconut Residue', 'Water Spinach', 'Cassava Leaves'];
    const type = 'starter';
    const numSwine = 8;

    const result = feedFormulation(selectedIngredients, type, numSwine);

    console.log(result); // Debug log

    expect(result.ingredientAmounts).toEqual([
      { ingredient: 'Coconut Residue', amount: expect.any(Number) },
      { ingredient: 'Water Spinach', amount: expect.any(Number) },
      { ingredient: 'Cassava Leaves', amount: expect.any(Number) },
    ]);

    expect(result.totalNutrients).toEqual({
      crudeProtein: expect.any(Number),
      crudeFiber: expect.any(Number),
      crudeFat: expect.any(Number),
      calcium: expect.any(Number),
      moisture: expect.any(Number),
      phosphorus: expect.any(Number),
    });

    // Ensure the total crude protein is recalculated for 8 swine
    expect(result.totalNutrients.crudeProtein).not.toBeCloseTo(15.05, 2); // Different number of swine should result in different values
  });

  it('should calculate different nutrient values for different feed types', () => {
    const selectedIngredients = ['Coconut Residue', 'Water Spinach', 'Cassava Leaves'];
    const numSwine = 5;

    const starterResult = feedFormulation(selectedIngredients, 'starter', numSwine);
    const growerResult = feedFormulation(selectedIngredients, 'grower', numSwine);
    const finisherResult = feedFormulation(selectedIngredients, 'finisher', numSwine);

    console.log(starterResult, growerResult, finisherResult); // Debug log

    expect(starterResult.totalNutrients.crudeProtein).not.toBeCloseTo(growerResult.totalNutrients.crudeProtein, 2);
    expect(starterResult.totalNutrients.crudeProtein).not.toBeCloseTo(finisherResult.totalNutrients.crudeProtein, 2);
    expect(growerResult.totalNutrients.crudeProtein).not.toBeCloseTo(finisherResult.totalNutrients.crudeProtein, 2);
  });
});
