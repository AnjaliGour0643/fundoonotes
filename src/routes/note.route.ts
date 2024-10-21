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

    // Route for getting all notes for the authenticated user
    this.router.get(
      '/',
      userAuth,                        
      this.noteController.getUserNotes 
    );
    
    // Route for updating a note by providing noteID
    this.router.put(
      '/:id',
      this.noteValidator.updateNote, 
      userAuth,
      this.noteController.updateNote    
    );

    // Route for deleting a note by noteID
    this.router.delete(
      '/:id', 
      userAuth, 
      this.noteController.deleteNote
    );
    
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
