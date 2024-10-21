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
  
}

export default NoteController;
