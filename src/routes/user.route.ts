import express, { IRouter } from 'express';
import UserController from '../controllers/user.controller';
import UserValidator from '../validators/user.validator';

class UserRoutes {
  private router = express.Router();
  private userController = new UserController();
  private userValidator = new UserValidator();


  constructor() {
    this.routes();
  }

  private routes = () => {
    // Route for user registration
    this.router.post(
      '/register',
      this.userValidator.newUser,
      this.userController.newUser
    );
    
    // Route for user login
    this.router.post(
      '/login',
      this.userValidator.loginUser,
      this.userController.loginUser
    );
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;