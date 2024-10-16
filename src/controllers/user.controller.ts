import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  private userService = new UserService();

  // Register user
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await this.userService.registerUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  // Login user
  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const user = await this.userService.loginUser(email, password);
      res.status(200).json({ message: 'Login successful', user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}

export default UserController;