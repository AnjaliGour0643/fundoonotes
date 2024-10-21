import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import NoteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Route for creating a note
    this.router.post(
      '/create',
      this.noteValidator.createNote,    
      userAuth,                         
      this.noteController.createNote    
    );

    // Route for getting note by poviding noteID
    this.router.get(
      '/:id',
      userAuth,                         
      this.noteController.getNote      
    );
    
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
