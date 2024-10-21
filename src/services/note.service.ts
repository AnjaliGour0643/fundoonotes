import Note from '../models/note.model'; 
import { INote } from '../interfaces/note.interface'; 
import { Error } from 'mongoose';

class NoteService {
  // Create a new note
  public createNote = async (body: INote): Promise<INote> => {
    try {
      // Save the note to the database
      const note = await Note.create(body);
      return note;
    } catch (error) {
      throw new Error('Error creating note');
    }
  };
  
  // Fetch specific note for a specific user
  public getNoteById = async (noteId: string): Promise<INote | null> => {
    try {
      const note = await Note.findById(noteId); 
      if (!note) {
        throw new Error('Note not found'); 
      }
      return note;
    } catch (error) {
      console.error('Error in getNoteById:', error); // Log for debugging
      throw error; // Re-throw the error to be caught in the controller
    }
  };

  // Fetch all notes for a specific user
  public getNotesByUserId = async (userId: string): Promise<INote[]> => {
    try {
      const notes = await Note.find({ createdBy: userId }); // Find all notes created by this user
      if (!notes || notes.length === 0) {
        throw new Error('No notes found for this user');
      }
      return notes;
    } catch (error) {
      console.error('Error retrieving notes:', error); // Log for debugging
      throw error; // Re-throw the error to be caught in the controller
    }
  };
  
}

export default NoteService;
