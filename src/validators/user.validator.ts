import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

class UserValidator {
  // Validation for new user registration
  public newUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      firstname: Joi.string().min(2).required(),
      lastname: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(HttpStatus.BAD_REQUEST).send({
        code: HttpStatus.BAD_REQUEST,
        message : error.message
      });
    }
    next();
  };

  // Validation for user login
  public loginUser = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message : error.message
      });
    }
    next();
  };

  // Validation for forgot password
  public validateForgotPassword = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); // Return to stop further execution
    }
    next();
  };

  // Validation for reset password
  public validateResetPassword = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      newPassword: Joi.string().min(6).required(), // Ensure the new password meets criteria
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return next(error); // Return to stop further execution
    }
    next();
  };

}

export default UserValidator;
