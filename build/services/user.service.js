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
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = require("mongoose");
class UserService {
    constructor() {
        // Register a new user
        this.registerUser = (body) => __awaiter(this, void 0, void 0, function* () {
            // Check if user already exists
            const existingUser = yield user_model_1.default.findOne({ email: body.email });
            if (existingUser) {
                throw new mongoose_1.Error('User already exists'); // Throw error if user exists
            }
            // Create new user
            const newUser = yield user_model_1.default.create(body);
            return newUser;
        });
        // Login user
        this.loginUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            // Check if user exists and password matches
            if (!user || user.password !== password) {
                throw new mongoose_1.Error('Invalid email or password'); // Throw error if login fails
            }
            return user;
        });
    }
}
exports.default = UserService;
