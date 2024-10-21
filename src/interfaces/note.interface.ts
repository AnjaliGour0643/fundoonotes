import { Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  color?: string; // Optional field
  isArchive: boolean;
  isTrash: boolean;
  createdBy: string; // Assuming it's an ObjectId (from mongoose)
}
