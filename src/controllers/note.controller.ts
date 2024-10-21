import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/note.service';
import HttpStatus from 'http-status-codes';

class NoteController {
  private noteService = new NoteService();

  // Create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.createNote(req.body);
      // Successful creation response
      res.status(HttpStatus.CREATED).json(note); 
    } catch (error) {
      next(error); 
    }
  };
  
  // Get specific note for a user
  public getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id; 
      const note = await this.noteService.getNoteById(noteId); 
  
      if (!note) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found',
        });
      }
  
      res.status(HttpStatus.OK).json(note); // Send the found note back to the client
    } catch (error) {
      console.error('Error retrieving note:', error); 
      next({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving note',
        error: error.message, 
      });
    }
  };

}

export default NoteController;
