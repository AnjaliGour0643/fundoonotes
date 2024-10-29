import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to: string, token: string) => {
  const mailOptions = {
    from: {
      name: 'fundoonotes',
      address: process.env.EMAIL_USER,
    },
    to: ["anjaligour1306@gmail.com"],
    subject: "Password Reset Token",
    html: `<p>Your password reset token is:</p><p><strong>${token}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { sendEmail };
