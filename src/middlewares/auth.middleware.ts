/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate if user has a valid Authorization token.
 * Takes a token type to allow different verification types for general auth and reset password.
 *
 * @param {string} tokenType - Type of token ('auth' for JWT_SECRET or 'reset' for JWT_FORGOTPASSWORD).
 */
export const userAuth = (tokenType: 'auth' | 'reset') => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let bearerToken = req.header('Authorization');
    if (!bearerToken) {
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required',
      };
    }
    bearerToken = bearerToken.split(' ')[1];

    // Choose the appropriate secret based on token type
    const secret = tokenType === 'auth' ? process.env.JWT_SECRET : process.env.JWT_FORGOTPASSWORD;
    const decoded: any = await jwt.verify(bearerToken, secret);

    // Store user info in request based on token type
    if (tokenType === 'auth') {
      req.body.createdBy = decoded.id; // For general auth
    } else if (tokenType === 'reset') {
      res.locals.id = decoded.userId; // For reset password
    }
    next();
  } catch (error) {
    next(error);
  }
};
