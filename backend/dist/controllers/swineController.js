"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWeight = exports.deleteWeight = exports.updateSwine = exports.deleteSwine = exports.addWeight = exports.getSwineWeights = exports.addSwine = exports.getSwines = void 0;
const swine_1 = __importDefault(require("../models/swine"));
const isError = (error) => {
    return error.message !== undefined;
};
const getSwines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const swines = yield swine_1.default.find();
        res.json(swines);
    }
    catch (err) {
        if (isError(err)) {
            console.error('Error in getSwines:', err.message);
            res.status(500).json({ message: err.message });
        }
        else {
            console.error('Unknown error in getSwines');
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});
exports.getSwines = getSwines;
const addSwine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, weight, age } = req.body;
    const swine = new swine_1.default({
        id,
        weight,
        age,
        weights: [{ weight, date: new Date() }] // Include initial weight
    });
    try {
        const newSwine = yield swine.save();
        res.status(201).json(newSwine);
    }
    catch (err) {
        if (isError(err)) {
            console.error('Error in addSwine:', err.message);
            res.status(400).json({ message: err.message });
        }
        else {
            console.error('Unknown error in addSwine');
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.addSwine = addSwine;
const getSwineWeights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { swineId } = req.params;
        const swine = yield swine_1.default.findOne({ id: swineId }); // Find by id field
        if (!swine) {
            console.error(`Swine with id ${swineId} not found`);
            res.status(404).json({ message: 'Swine not found' });
        }
        else {
            res.json(swine.weights);
        }
    }
    catch (err) {
        if (isError(err)) {
            console.error('Error in getSwineWeights:', err.message);
            res.status(500).json({ message: err.message });
        }
        else {
            console.error('Unknown error in getSwineWeights');
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});
exports.getSwineWeights = getSwineWeights;
const addWeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { swineId } = req.params;
    const { date, weight } = req.body;
    if (!date || !weight) {
        res.status(400).json({ message: 'Date and weight are required' });
        return;
    }
    try {
        const swine = yield swine_1.default.findOne({ id: swineId.trim() });
        if (!swine) {
            res.status(404).json({ message: 'Swine not found' });
            return;
        }
        swine.weights.push({ date, weight });
        yield swine.save();
        res.json(swine);
    }
    catch (err) {
        if (isError(err)) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.addWeight = addWeight;
const deleteSwine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { swineId } = req.params;
    try {
        const swine = yield swine_1.default.findOneAndDelete({ id: swineId });
        if (!swine) {
            res.status(404).json({ message: 'Swine not found' });
        }
        else {
            res.json({ message: 'Swine deleted' });
        }
    }
    catch (err) {
        if (isError(err)) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.deleteSwine = deleteSwine;
const updateSwine = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { swineId } = req.params;
    const { weight, age } = req.body;
    try {
        const swine = yield swine_1.default.findOneAndUpdate({ id: swineId.trim() }, // Ensure there's no trailing whitespace
        { weight, age }, { new: true, runValidators: true });
        if (!swine) {
            res.status(404).json({ message: 'Swine not found' });
        }
        else {
            res.json(swine);
        }
    }
    catch (err) {
        if (isError(err)) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.updateSwine = updateSwine;
const deleteWeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { swineId } = req.params;
    const { date } = req.body;
    if (!date) {
        res.status(400).json({ message: 'Date is required' });
        return;
    }
    try {
        const swine = yield swine_1.default.findOne({ id: swineId.trim() });
        if (!swine) {
            res.status(404).json({ message: 'Swine not found' });
            return;
        }
        const weightDate = new Date(date);
        const weightIndex = swine.weights.findIndex(weightEntry => weightEntry.date.toISOString() === weightDate.toISOString());
        if (weightIndex === -1) {
            res.status(404).json({ message: 'Weight entry not found' });
            return;
        }
        swine.weights.splice(weightIndex, 1);
        yield swine.save();
        res.json(swine);
    }
    catch (err) {
        console.error('Error deleting weight entry:', err);
        if (isError(err)) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.deleteWeight = deleteWeight;
const updateWeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { swineId, weightId } = req.params;
    const { weight } = req.body;
    try {
        const swine = yield swine_1.default.findOne({ id: swineId.trim() });
        if (!swine) {
            res.status(404).json({ message: 'Swine not found' });
            return;
        }
        const weightEntry = swine.weights.id(weightId);
        if (!weightEntry) {
            res.status(404).json({ message: 'Weight entry not found' });
            return;
        }
        weightEntry.weight = weight;
        yield swine.save();
        res.json(swine);
    }
    catch (err) {
        if (isError(err)) {
            res.status(400).json({ message: err.message });
        }
        else {
            res.status(400).json({ message: 'Unknown error' });
        }
    }
});
exports.updateWeight = updateWeight;
