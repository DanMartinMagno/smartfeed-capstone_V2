"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedController_1 = require("../controllers/feedController");
const swineRoutes_1 = __importDefault(require("./swineRoutes"));
const router = (0, express_1.Router)();
router.post('/calculate-feed', feedController_1.calculateFeed);
router.use('/swine', swineRoutes_1.default); // Add this line
exports.default = router;
