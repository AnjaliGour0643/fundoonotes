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

  // Update a note by noteId
  public updateNoteById = async (noteId: string, updateData: Partial<INote>): Promise<INote | null> => {
    try {
      const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, { new: true });
      if (!updatedNote) {
        throw new Error('Note not found');
      }
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  // Delete a note by noteId
  public deleteNoteById = async (noteId: string): Promise<INote | null> => {
    try {
      const deletedNote = await Note.findByIdAndDelete(noteId);
      if (!deletedNote) {
        throw new Error('Note not found');
      }
      return deletedNote;
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };
  
}

export default NoteService;
