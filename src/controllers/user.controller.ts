import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import HttpStatus from 'http-status-codes';

class UserController {
  private userService = new UserService();

  // Registration
  public newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.newUser(req.body);
      // Successful registration response
      res.status(HttpStatus.CREATED).json(user); // Using status code from http-status-codes
    } catch (error) {
      next(error); // Pass the error to the middleware for handling
    }
  };

  // Login
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.loginUser(req.body);
      // Successful login response
      res.status(HttpStatus.OK).json({ message: 'Login successful', user }); // Using status code from http-status-codes
    } catch (error) {
      next(error); // Pass the error to the middleware for handling
    }
  };
}

export default UserController;
