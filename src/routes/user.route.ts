import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller';

class UserRoutes {
  private router = express.Router();
  private userController = new UserController();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Route for user registration
    this.router.post('/register', this.userController.register);

    // Route for user login
    this.router.post('/login', this.userController.login);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;