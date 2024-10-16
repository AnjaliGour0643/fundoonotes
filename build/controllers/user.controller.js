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
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
        // Register user
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield this.userService.registerUser(req.body);
                res.status(201).json({ message: 'User registered successfully', user: newUser });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
        // Login user
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const user = yield this.userService.loginUser(email, password);
                res.status(200).json({ message: 'Login successful', user });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = UserController;
