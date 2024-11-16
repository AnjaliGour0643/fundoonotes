import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import HttpStatus from 'http-status-codes';

class UserController {
  private userService = new UserService();

  // Registration
  public newUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.newUser(req.body);
  
      // Check if the user creation succeeded
      if (user) {
        res.status(HttpStatus.CREATED).json({
          code: HttpStatus.CREATED,
          message: 'User registered successfully',
        });
      }
    } catch (error) {
      next(error); // Pass the error to the middleware for handling
    }
  };

  // Login
  public loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.loginUser(req.body);
      
      // Check if the login succeeded
      if (user) {
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: 'Login successful',
          user,
        });
      } 
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message : error.message
      });
    }
  };

  // Forgot password
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try { 
      await this.userService.forgotPassword(req.body.email);
      res.status(HttpStatus.CREATED).json({
        code : HttpStatus.CREATED,
        message: "Reset password token sent to registered email id"
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).send({
        code: HttpStatus.NOT_FOUND,
        message : error.message
      });
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
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message : error.message
      });
    }
  };
  
}

export default UserController;
