import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { Error } from 'mongoose';

class UserService {

  // Register a new user
  public registerUser = async (body: IUser): Promise<IUser | null> => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists');  // Throw error if user exists
    }

    // Create new user
    const newUser = await User.create(body);
    return newUser;
  };

  // Login user
  public loginUser = async (email: string, password: string): Promise<IUser | null> => {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');  // Throw error if login fails
    }

    return user;
  };
}

export default UserService;