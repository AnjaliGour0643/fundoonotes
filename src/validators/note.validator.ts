import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

class NoteValidator {
  // Validation for creating a new note
  public createNote = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      title: Joi.string().min(1).required(), 
      description: Joi.string().min(1).required(), 
      color: Joi.string().optional(), 
      isArchive: Joi.boolean().required(), 
      isTrash: Joi.boolean().required(), 
      createdBy: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

export default NoteValidator;
