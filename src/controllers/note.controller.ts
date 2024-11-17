import { Request, Response, NextFunction } from 'express';
import NoteService from '../services/note.service';
import HttpStatus from 'http-status-codes';

class NoteController {
  private noteService = new NoteService();

  // Create a new note
  public createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.createNote(req.body);
      if(note){
        res.status(HttpStatus.CREATED).json({
          code: HttpStatus.CREATED,
          message: 'Note created successfully',
          note
        });
      }
    } catch (error) {
      next(error); 
    }
  };
  
  // Get specific note for a user
  public getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id; 
      const userId = req.body.createdBy;
      const note = await this.noteService.getNoteById(noteId,userId); 
      if (note) {
        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          note
        });
      }
    } catch (error) {
      next({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found', 
      });
    }
  };

  // Get all notes for the authenticated user
  public getUserNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.body.createdBy; 
      const { data: notes, source } = await this.noteService.getNotesByUserId(userId); // Fetch notes with source info
  
      // Send notes along with source message
      res.status(HttpStatus.OK).json({ message: source, notes });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message : error.message
      });
    }
  };

  // Update a note by noteID
  public updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id;
      const userId = req.body.createdBy;
      const updateData = req.body;
      const updatedNote = await this.noteService.updateNoteById(noteId,userId, updateData);

      if (!updatedNote) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found or unauthorized user',
        });
      }

      res.status(HttpStatus.OK).json({
        code : HttpStatus.OK,
        updatedNote
      }); // Send the updated note back to the client
    } catch (error) {
      next({
        code: HttpStatus.NOT_FOUND,
        message: 'Error updating note'
      });
    }
  };

  // Permanently delete a note (only if it's in the trash)
  public deletePermanently = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id; // Get the noteId from URL
      const userId = req.body.createdBy; // Get userId from the request body

      const deletedNote = await this.noteService.deletePermanently(noteId, userId); // Call service to delete

      if (!deletedNote) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found, not in trash, or not authorized',
        });
      }

      res.status(HttpStatus.OK).json({
        code : HttpStatus.OK,
        message: 'Note permanently deleted',
        deletedNoteId: noteId
      });
    } catch (error) {
      res.status(HttpStatus.FORBIDDEN).send({
        code: HttpStatus.FORBIDDEN,
        message: 'Error deleting note permanently',
      })
    }
  };


  // Toggle trash status for a note (move to trash or restore from trash)
  public toggleTrash = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id; // Get the noteId from URL
      const userId = req.body.createdBy; // Get userId from the request body

      const note = await this.noteService.toggleTrash(noteId, userId); // Toggle trash

      if (note) {
        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: note.isTrash ? 'Note moved to trash' : 'Note restored from trash',
          trashedNote: note
        });
      }
    } catch (error) {
      next({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Error toggling trash status',
        error: error.message
      });
    }
  };
  
  // Toggle archive status for a note
  public toggleArchive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const noteId = req.params.id; // Get the noteId from URL
      const userId = req.body.createdBy; // Get userId from the request body
      
      const note = await this.noteService.toggleArchive(noteId, userId); // Toggle archive
      
      if (!note) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Note not found or not authorized',
        });
      }
      // Return the updated note with the toggled archive status
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: note.isArchive ? 'Note archived' : 'Note unarchived',
        archivedNote: note
      });
    } catch (error) {
      console.error('Error toggling archive status:', error); 
      next({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error toggling archive status',
        error: error.message
      });
    }
  };  

}

export default NoteController;
