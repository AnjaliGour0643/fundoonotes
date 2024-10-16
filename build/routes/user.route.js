"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.userController = new user_controller_1.default();
        this.routes = () => {
            // Route for user registration
            this.router.post('/register', this.userController.register);
            // Route for user login
            this.router.post('/login', this.userController.login);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = UserRoutes;
