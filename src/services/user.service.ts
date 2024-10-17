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

  // Compare the entered password with the hashed password
  private async comparePassword(enteredPassword: string, storedPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, storedPassword);
  }

  // Login logic
  public loginUser = async (body: { email: string, password: string }): Promise<IUser | null> => {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordMatch = await this.comparePassword(body.password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid password');
    }

    // Password matches, return the user
    return user;
  };
}

export default UserService;