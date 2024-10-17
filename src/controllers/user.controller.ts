import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService = new UserService();

  // Registration
  public newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.newUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  // Login
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.loginUser(req.body);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;