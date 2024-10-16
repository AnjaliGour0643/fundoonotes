import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensuring unique email
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>('User', userSchema);
