"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFeed = void 0;
const feedService_1 = require("../services/feedService");
const calculateFeed = (req, res) => {
    const { selectedIngredients, type, numSwine } = req.body;
    try {
        if (!selectedIngredients || !type || !numSwine) {
            throw new Error('Missing required fields: selectedIngredients, type, and numSwine');
        }
        const result = (0, feedService_1.feedFormulation)(selectedIngredients, type, numSwine);
        res.json(result);
    }
    catch (error) {
        const err = error;
        console.error('Error calculating feed formulation:', err.message, err.stack);
        res.status(500).json({ error: 'An error occurred while calculating the feed formulation.', details: err.message });
    }
};
exports.calculateFeed = calculateFeed;
