import User from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { Error } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // Importing jwt for token generation
import { sendEmail } from '../utils/user.util';
import { createChannel } from '../utils/rabbitmq';

class UserService {
  // Create new user (Registration) with password hashing
  public newUser = async (body: IUser): Promise<IUser> => {
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hashing the password 
    body.password = await bcrypt.hash(body.password, 10);  // 10 - saltRounds

    const data = await User.create(body);

    // Send message to RabbitMQ after successful registration
    const message = { fname: data.firstname, lname: data.lastname, email: data.email };
    await this.sendMessageToQueue(process.env.REGISTRATION_QUEUE, message);

    return data;
  };

  // Function to send message to RabbitMQ
  private async sendMessageToQueue(queueName: string, message: any) {
    const channel = await createChannel();
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log('Sent message to queue:', queueName, message);
  }

  // Login logic with JWT token generation and password comparison
  public loginUser = async (body: { email: string, password: string }): Promise<{ token: string } | null> => {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      throw new Error('User not found');
    }

    // Password comparison logic 
    const isPasswordMatch = await bcrypt.compare(body.password, user.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid password');
    }

    // Password matches, generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

    // Return the token instead of the user
    return { token };
  };

  //forgot password
  public forgotPassword = async (email: any) => {
    try{
      const temp = await User.findOne({email});
      if(!temp)
        throw new Error("Email not found")
      const token = jwt.sign({userId: temp._id}, process.env.JWT_FORGOTPASSWORD, { expiresIn: '1h' })
      await sendEmail(email, token)
    }catch(error){
      throw new Error("Error occured cannot send email: "+error)
    }
  }

  //reset password
  public resetPassword = async (body: any, userId): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  };
}

export default UserService;