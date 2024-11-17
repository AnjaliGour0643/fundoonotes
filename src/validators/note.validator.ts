import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import HttpStatus from 'http-status-codes';

class NoteValidator {
  // Validation for creating a new note
  public createNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(1).required(), 
      description: Joi.string().min(1).required(), 
      color: Joi.string().optional(), 
      isArchive: Joi.boolean().optional(), 
      isTrash: Joi.boolean().optional() 
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

  // Validation for updating an existing note
  public updateNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(1).optional(), 
      description: Joi.string().min(1).optional(), 
      color: Joi.string().optional(), 
      isArchive: Joi.boolean().optional(), 
      isTrash: Joi.boolean().optional(), 
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

}

export default NoteValidator;
