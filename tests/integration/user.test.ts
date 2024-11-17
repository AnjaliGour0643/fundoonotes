import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import HttpStatus from 'http-status-codes';

describe('UserController API Tests', () => {
  const mockUser = {
    firstname: 'Test',
    lastname: 'User',
    email: 'testuser@example.com',
    password: 'TestPassword123!',
  };

  const invalidUser = {
    email: 'invaliduser@example.com',
    password: 'wrongpassword',
  };

  let token: string;

  // User Registration
  describe('POST /api/v1/users (User Registration)', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app.getApp()).post('/api/v1/users').send(mockUser);
      expect(res.status).to.equal(HttpStatus.CREATED);
      expect(res.body.message).to.equal('User registered successfully');
    });

    it('should fail to register if email already exists', async () => {
      const res = await request(app.getApp()).post('/api/v1/users').send(mockUser);
      expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.body.message).to.include('User already exist');
    });
  });

  // User Login
  describe('POST /api/v1/users/login (User Login)', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/login')
        .send({ email: mockUser.email, password: mockUser.password });

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body.message).to.equal('Login successful');
      expect(res.body.user).to.have.property('token');
      token = res.body.user.token; // Save token for further tests
    });

    it('should fail to login with invalid credentials', async () => {
      const res = await request(app.getApp()).post('/api/v1/users/login').send(invalidUser);
      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).to.include('User not found');
    });
  });

  // Forgot Password
  describe('POST /api/v1/users/forgot-password', () => {
    it('should send a reset password token to a registered email', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/forgot-password')
        .send({ email: mockUser.email });

      expect(res.status).to.equal(HttpStatus.CREATED);
      expect(res.body.message).to.equal('Reset password token sent to registered email id');
    });

    it('should fail for an unregistered email', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/users/forgot-password')
        .send({ email: invalidUser.email });

      expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body.message).to.include('User not found');
    });
  });

  // -----------------------------------------------
  // NoteController API Tests
  describe('NoteController API Tests', () => {
    let noteId: string;

    // Create a new note
    describe('POST /api/v1/notes (Create Note)', () => {
      it('should create a new note successfully', async () => {
        const res = await request(app.getApp())
          .post('/api/v1/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Test Note',
            description: 'This is a test note',
            color: 'yellow',
            isArchive: false,
            isTrash: false,
          });

        expect(res.status).to.equal(HttpStatus.CREATED);
        expect(res.body.message).to.equal('Note created successfully');
        expect(res.body.note).to.have.property('title', 'Test Note');
        noteId = res.body.note._id; // Save noteId for further tests
      });

      it('should fail to create a note if the title is missing', async () => {
        const res = await request(app.getApp())
          .post('/api/v1/notes')
          .set('Authorization', `Bearer ${token}`)
          .send({
            description: 'This is a test note without title',
          });

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('\"title\" is required');
      });
    });

    // Get all notes for the user
    describe('GET /api/v1/notes (Get All Notes)', () => {
      it('should fetch all notes for the authenticated user', async () => {
        const res = await request(app.getApp())
          .get('/api/v1/notes')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body.notes).to.be.an('array');
      });
    });

    // Get a specific note by ID
    describe('GET /api/v1/notes/:id (Get Note By ID)', () => {
      it('should fetch the specific note by ID', async () => {
        const res = await request(app.getApp())
          .get(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body.note).to.have.property('_id', noteId);
      });

      it('should fail to fetch a non-existent note', async () => {
        const res = await request(app.getApp())
          .get('/api/v1/notes/invalidnoteid')
          .set('Authorization', `Bearer ${token}`);

        expect(res.status).to.equal(HttpStatus.NOT_FOUND);
        expect(res.body.message).to.include('Note not found');
      });
    });

    // Update a note by ID
    describe('PUT /api/v1/notes/:id (Update Note)', () => {
      it('should update a note successfully', async () => {
        const res = await request(app.getApp())
          .put(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: 'Updated Test Note',
            description: 'Updated description for the test note',
          });

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body.updatedNote).to.have.property('title', 'Updated Test Note');
      });

      it('should fail to update a note with invalid data', async () => {
        const res = await request(app.getApp())
          .put(`/api/v1/notes/${noteId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            title: '',
            description: 'Updated description for the test note with invalid title',
          });

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);
        expect(res.body.message).to.include('\"title\" is not allowed to be empty');
      });
    });
    
  });
});
