import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';

import app from '../../src/index';

let token: string;

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].deleteOne(() => {});
      }
    };

    const mongooseConnect = async () => {
      const dbUri = process.env.DATABASE_TEST;
      if (!dbUri) {
        throw new Error('DATABASE_TEST environment variable is not set');
      }
      await mongoose.connect(dbUri);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  const userData = {
    firstname: 'Demo',
    lastname: 'Testing',
    email: 'demotesting@gmail.com',
    password: 'Preethambs',
  };

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).to.equal(HttpStatus.CREATED);
      expect(res.body).to.have.property('email', userData.email);
    });
  });

  describe('User Login', () => {
    it('should login an existing user successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/login')
        .send({ email: userData.email, password: userData.password });

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.user).to.have.property('token');
      token = res.body.user.token; // retrieve token for further tests
    });
  });
});

export { token };

  // describe('Forgot Password', () => {
  //   it('should send a reset token to the user\'s email', async () => {
  //     const res = await request(app.getApp())
  //       .post('/api/v1/users/forgot-password')
  //       .send({ email: userData.email });

  //     expect(res.status).to.equal(HttpStatus.CREATED);
  //     expect(res.body).to.have.property('message', 'Reset password token sent to registered email id');
  //     resetToken = res.body.token; // store resetToken for the reset password test
  //   });
  // });

  // describe('Reset Password', () => {
  //   it('should reset the user\'s password with a valid reset token', async () => {
  //     const res = await request(app.getApp())
  //       .post('/api/v1/users/reset-password')
  //       .set('Authorization', `Bearer ${resetToken}`)
  //       .send({ newPassword: 'NewSecurePassword123!' });

  //     expect(res.status).to.equal(HttpStatus.OK);
  //     expect(res.body).to.have.property('message', 'Password reset successfully');
  //   });
  // });
