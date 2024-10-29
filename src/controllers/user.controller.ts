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

  // Forgot password
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      await this.userService.forgotPassword(req.body.email);
      res.status(HttpStatus.CREATED).send("Reset password token sent to registered email id");
    } catch (error) {
        next(error);
    }
  };

  //Reset Password
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      await this.userService.resetPassword(req.body, res.locals.id);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Password reset successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  
}

export default UserController;
