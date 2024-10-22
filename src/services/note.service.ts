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
  
  // Fetch specific note for a specific user by providing noteId
  public getNoteById = async (noteId: string, userId:any): Promise<INote | null> => {
    try {
      const note = await Note.findOne({$and: [{_id:noteId}, {createdBy:userId }]}); 
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

  // Update specific note for a specific user by providing noteId
  public updateNoteById = async (noteId: string, userId: any, updatedData: any): Promise<INote | null> => {
    try {
      const note = await Note.findOneAndUpdate(
        { _id: noteId, createdBy: userId }, // Ensure the note belongs to the user
        { $set: updatedData }, // Update the note with new data
        { new: true } // Return the updated document
      );
      
      if (!note) {
        throw new Error('Note not found or unauthorized'); 
      }
      
      return note;
    } catch (error) {
      console.error('Error in updateNoteById:', error); 
      throw error; 
    }
  };

  // Delete a note by noteId
  public deleteNoteById = async (noteId: string, userId: any): Promise<INote | null> => {
    try {
      const note = await Note.findOneAndDelete({ _id: noteId, createdBy: userId }); // Ensure the note belongs to the user
      if (!note) {
        throw new Error('Note not found or unauthorized'); 
      }
      
      return note; // Return the deleted note
    } catch (error) {
      console.error('Error in deleteNoteById:', error); 
      throw error; 
    }
  };
  
}

export default NoteService;
