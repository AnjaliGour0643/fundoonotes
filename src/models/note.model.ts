import mongoose, { Schema, model } from 'mongoose';
import { INote } from '../interfaces/note.interface';

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, default: '#ffffff' }, // Optional field with default
  isArchive: { type: Boolean, default: false },
  isTrash: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User collection
}, {
  timestamps: true, 
});

export default model<INote>('Note', NoteSchema);
