import Note from '../models/note.model'; 
import { INote } from '../interfaces/note.interface'; 
import { Error } from 'mongoose';
import redisClient from '../config/redis';

class NoteService {
  // Create a new note and invalidate related cache
  public createNote = async (body: INote): Promise<INote> => {
    try {
      const note = await Note.create(body);
      await redisClient.del(`notes:${body.createdBy}`);  // Clear cache for all notes of this user
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
  public getNotesByUserId = async (userId: string): Promise<{ data: INote[], source: string }> => {
    try {
      const notes = await Note.find({ createdBy: userId });
      if (!notes || notes.length === 0) {
        throw new Error('No notes found for this user');
      }
  
      // Cache the notes in Redis for future requests
      await redisClient.setEx(`notes:${userId}`, 60, JSON.stringify(notes));
  
      // Return notes with a source message
      return { data: notes, source: 'Data retrieved from database' };
    } catch (error) {
      console.error('Error retrieving notes:', error);
      throw error;
    }
  };

  // Update specific note for a specific user by providing noteId
  public updateNoteById = async (noteId: string, userId: any, updatedData: any): Promise<INote | null> => {
    try {
      const note = await Note.findOneAndUpdate(
        { _id: noteId, createdBy: userId, isTrash: false }, // Ensure the note belongs to the user
        { $set: updatedData }, // Update the note with new data
        { new: true } // Return the updated document
      );
      
      if (!note) {
        throw new Error('Note not found or unauthorized'); 
      }

      // Clear cache for specific note and all notes
      await redisClient.del(`notes:${userId}`);
      
      return note;
    } catch (error) {
      console.error('Error in updateNoteById:', error); 
      throw error; 
    }
  };

  // Toggle archive status for a note
  public toggleArchive = async (noteId: string, userId: any): Promise<INote | null> => {
    try {
      // Find the note by ID and userId (createdBy)
      const note = await Note.findOne({$and: [{ _id: noteId }, { createdBy: userId }, { isTrash: false }]}); 
      
      if (!note) {
        throw new Error('Note not found or user not authorized'); 
      }
      
      // Toggle the isArchive field
      note.isArchive = !note.isArchive; 
      await note.save();

      // Invalidate cache
      await redisClient.del(`notes:${userId}`);

      return note;
    } catch (error) {
      console.error('Error in toggleArchive:', error); 
      throw error; // Re-throw the error to be caught in the controller
    }
  };


  // Toggle trash status for a note (move to trash or restore)
  public toggleTrash = async (noteId: string, userId: any): Promise<INote | null> => {
    try {
      const note = await Note.findOne({ $and: [{ _id: noteId }, { createdBy: userId }]});

      if (!note) {
        throw new Error('Note not found or user not authorized');
      }
      note.isTrash = !note.isTrash;  // Toggle the isTrash field

      // If the note is moved to trash, set isArchive to false
      if (note.isTrash) {
        note.isArchive = false;
      }
      await note.save(); // Save the updated note

      // Invalidate cache
      await redisClient.del(`notes:${userId}`);

      return note;
    } catch (error) {
      console.error('Error in toggleTrash:', error);
      throw error; // Re-throw the error to be caught in the controller
    }
  };

  // Permanently delete a note (only if it's in trash)
  public deletePermanently = async (noteId: string, userId: any): Promise<boolean> => {
    try {
      const note = await Note.findOne({$and: [{ _id: noteId }, { createdBy: userId }, { isTrash: true }]}); // Only allow delete if in trash

      if (!note) {
        throw new Error('Note not found or not authorized');
      }

      await Note.findByIdAndDelete(noteId); // Delete the note from the database
      
      // Invalidate the cached notes for this user in Redis
      await redisClient.del(`notes:${userId}`);
      
      return true; // Successfully deleted
    } catch (error) {
      console.error('Error in deletePermanently:', error);
      throw error; // Re-throw the error to be caught in the controller
    }
  };
  
}

export default NoteService;
