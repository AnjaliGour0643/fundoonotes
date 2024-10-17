import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { Error } from 'mongoose';
import bcrypt from 'bcrypt'

class UserService {
  // Encrypt the password using bcrypt
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Create new user (Registration)
  public newUser = async (body: IUser): Promise<IUser> => {
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    body.password = await this.hashPassword(body.password); // Hash the password
    const data = await User.create(body);
    return data;
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