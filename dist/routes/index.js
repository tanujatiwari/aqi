"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controllers_1 = __importDefault(require("../controllers"));
const mock_1 = require("../db/mock");
const userControllers = new controllers_1.default(new mock_1.MockDatabaseQueries());
router.get('/', userControllers.home);
router.all('*', userControllers.notFound);
exports.default = router;
