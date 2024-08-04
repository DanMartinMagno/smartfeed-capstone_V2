"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swineController_1 = require("../controllers/swineController");
const router = (0, express_1.Router)();
router.get('/', swineController_1.getSwines);
router.post('/', swineController_1.addSwine);
router.get('/:swineId/weights', swineController_1.getSwineWeights);
router.post('/:swineId/weights', swineController_1.addWeight);
router.put('/:swineId', swineController_1.updateSwine);
router.delete('/:swineId', swineController_1.deleteSwine);
router.delete('/:swineId/weights', swineController_1.deleteWeight);
router.put('/:swineId/weights/:weightId', swineController_1.updateWeight); // Add this route for updating a weight entry
exports.default = router;
