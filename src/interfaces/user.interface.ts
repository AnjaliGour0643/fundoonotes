import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string | number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
