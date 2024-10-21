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
  
}

export default NoteService;
