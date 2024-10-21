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

  // Get all notes for the authenticated user
  public getUserNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.createdBy; // Get the userId from the authenticated user (set in auth middleware)
      const notes = await this.noteService.getNotesByUserId(userId); // Fetch notes for this user

      res.status(HttpStatus.OK).json(notes); 
    } catch (error) {
      next({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error retrieving user notes',
        error: error.message
      });
    }
  };

  // Update a note by noteID
  public updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id;
      const updateData = req.body;
      const updatedNote = await this.noteService.updateNoteById(noteId, updateData);

      if (!updatedNote) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found',
        });
      }

      res.status(HttpStatus.OK).json(updatedNote); // Send the updated note back to the client
    } catch (error) {
      console.error('Error updating note:', error);
      next({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error updating note',
        error: error.message,
      });
    }
  };

}

export default NoteController;
