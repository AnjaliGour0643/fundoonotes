import express, { IRouter } from 'express';
import NoteController from '../controllers/note.controller';
import NoteValidator from '../validators/note.validator';
import { userAuth } from '../middlewares/auth.middleware';
import { cacheNotesByUserId } from '../middlewares/redis.middleware';

class NoteRoutes {
  private router = express.Router();
  private noteController = new NoteController();
  private noteValidator = new NoteValidator();

  constructor() {
    this.routes();
  }

  private routes = () => {
    // Route for creating a note
    this.router.post('', this.noteValidator.createNote, userAuth('auth'), this.noteController.createNote);

    // Route for getting all notes for the authenticated user
    this.router.get('/', userAuth('auth'), cacheNotesByUserId, this.noteController.getUserNotes);
    
    // Route for getting note by poviding noteID
    this.router.get('/:id', userAuth('auth'), this.noteController.getNote);

    // Route for updating a note by providing noteID
    this.router.put('/:id', this.noteValidator.updateNote, userAuth('auth'), this.noteController.updateNote);

    // Route to permanently delete a note (only if it's in trash)
    this.router.delete('/:id', userAuth('auth'), this.noteController.deletePermanently);

    // Route for toggling archive status by providing noteID
    this.router.put('/:id/archive', userAuth('auth'), this.noteController.toggleArchive); // Toggle archive status here

    // Route to toggle trash status (move to trash or restore)
    this.router.put('/:id/trash', userAuth('auth'), this.noteController.toggleTrash);
    
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default NoteRoutes;
