"use strict";
// feedService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedFormulation = void 0;
const ingredients = [
    {
        name: 'Coconut Residue',
        nutrients: { crudeProtein: 5.1, crudeFiber: 31.9, crudeFat: 38.3, calcium: 0.6, moisture: 4.8, phosphorus: 0.6, maxInclusionRate: 40 }
    },
    {
        name: 'Water Spinach',
        nutrients: { crudeProtein: 28, crudeFiber: 12, crudeFat: 3.8, calcium: 1.24, moisture: 5.32, phosphorus: 0.41, maxInclusionRate: -1 }
    },
    {
        name: 'Sweet Potato Leaves',
        nutrients: { crudeProtein: 19.4, crudeFiber: 10.2, crudeFat: 3.07, calcium: 1.79, moisture: 4.97, phosphorus: 0.24, maxInclusionRate: 50 }
    },
    {
        name: 'Cassava Leaves',
        nutrients: { crudeProtein: 14.7, crudeFiber: 10.7, crudeFat: 0.8, calcium: 0.84, moisture: 10, phosphorus: 0.76, maxInclusionRate: 40 }
    },
    {
        name: 'Banana Pseudostem',
        nutrients: { crudeProtein: 12.3, crudeFiber: 20.5, crudeFat: 0.5, calcium: 1.16, moisture: 5, phosphorus: 0.01, maxInclusionRate: -1 }
    },
    {
        name: 'Duckweed Fern',
        nutrients: { crudeProtein: 24, crudeFiber: 9.1, crudeFat: 3.3, calcium: 0.4, moisture: 14, phosphorus: 0.9, maxInclusionRate: -1 }
    },
    {
        name: 'Lead Tree Leaves',
        nutrients: { crudeProtein: 27.8, crudeFiber: 10.4, crudeFat: 4.4, calcium: 0.54, moisture: 10, phosphorus: 0.29, maxInclusionRate: 10 }
    },
    {
        name: 'Taro Leaves',
        nutrients: { crudeProtein: 7.67, crudeFiber: 20, crudeFat: 3, calcium: 2, moisture: 14, phosphorus: 0.8, maxInclusionRate: 80 }
    },
    {
        name: 'Madre De Agua Leaves',
        nutrients: { crudeProtein: 18.21, crudeFiber: 12.5, crudeFat: 2.66, calcium: 5, moisture: 11.56, phosphorus: 0.41, maxInclusionRate: -1 }
    },
    {
        name: 'Water Hyacinth Leaves',
        nutrients: { crudeProtein: 21.6, crudeFiber: 17.1, crudeFat: 2.1, calcium: 1.6, moisture: 10.5, phosphorus: 0.5, maxInclusionRate: -1 }
    },
    {
        name: 'Rice Bran',
        nutrients: { crudeProtein: 13, crudeFiber: 13, crudeFat: 12, calcium: 0.11, moisture: 9.5, phosphorus: 1.57, maxInclusionRate: -1 }
    },
];
const nutrientRequirements = {
    starter: 18,
    grower: 16,
    finisher: 14,
};
const dailyFeedIntake = {
    starter: (0.61 + 0.95) / 2,
    grower: (1 + 2) / 2,
    finisher: (2 + 2.5) / 2,
};
const calculateNutrients = (selectedIngredients, numSwine, feedType) => {
    const totalDailyFeed = dailyFeedIntake[feedType] * numSwine;
    const desiredNutrientLevel = nutrientRequirements[feedType];
    const totalCrudeProtein = selectedIngredients.reduce((acc, ingredient) => acc + ingredient.nutrients.crudeProtein, 0);
    const ingredientProportions = selectedIngredients.map(ingredient => ({
        ingredient,
        proportion: ingredient.nutrients.crudeProtein / totalCrudeProtein,
    }));
    const totalNutrients = selectedIngredients.reduce((acc, ingredient) => {
        const proportion = ingredient.nutrients.crudeProtein / totalCrudeProtein;
        const totalAmount = totalDailyFeed * proportion;
        return {
            crudeProtein: acc.crudeProtein + (ingredient.nutrients.crudeProtein * totalAmount / totalDailyFeed),
            crudeFiber: acc.crudeFiber + (ingredient.nutrients.crudeFiber * totalAmount / totalDailyFeed),
            crudeFat: acc.crudeFat + (ingredient.nutrients.crudeFat * totalAmount / totalDailyFeed),
            calcium: acc.calcium + (ingredient.nutrients.calcium * totalAmount / totalDailyFeed),
            moisture: acc.moisture + (ingredient.nutrients.moisture * totalAmount / totalDailyFeed),
            phosphorus: acc.phosphorus + (ingredient.nutrients.phosphorus * totalAmount / totalDailyFeed),
        };
    }, {
        crudeProtein: 0,
        crudeFiber: 0,
        crudeFat: 0,
        calcium: 0,
        moisture: 0,
        phosphorus: 0,
    });
    const ingredientAmounts = ingredientProportions.map(p => ({
        ingredient: p.ingredient.name,
        amount: dailyFeedIntake[feedType] * p.proportion * numSwine,
    }));
    // Ensure total nutrients scale correctly with the number of swine
    totalNutrients.crudeProtein *= numSwine;
    totalNutrients.crudeFiber *= numSwine;
    totalNutrients.crudeFat *= numSwine;
    totalNutrients.calcium *= numSwine;
    totalNutrients.moisture *= numSwine;
    totalNutrients.phosphorus *= numSwine;
    return {
        ingredientAmounts,
        totalNutrients
    };
};
const feedFormulation = (selectedIngredients, type, numSwine) => {
    const selectedIngredientObjects = selectedIngredients.map(ingredientName => ingredients.find(i => i.name === ingredientName));
    if (selectedIngredientObjects.includes(undefined)) {
        throw new Error('Selected ingredients not found.');
    }
    return calculateNutrients(selectedIngredientObjects, numSwine, type);
};
exports.feedFormulation = feedFormulation;
