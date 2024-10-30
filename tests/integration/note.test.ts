import { expect } from 'chai';
import request from 'supertest';
import HttpStatus from 'http-status-codes';

import app from '../../src/index';
import { token } from './user.test';

let createdNoteId: string;

describe('Note APIs Test', () => {
  const noteData = {
    title: 'Testing database',
    description: 'This is a sample test note.',
    color: 'white',
    isArchive: false,
    isTrash: false,
  };

  describe('Create Note', () => {
    it('should create a new note successfully', async () => {
      const res = await request(app.getApp())
        .post('/api/v1/notes/create')
        .set('Authorization', `Bearer ${token}`)
        .send(noteData);

      expect(res.status).to.equal(HttpStatus.CREATED);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('title', noteData.title);
      expect(res.body).to.have.property('description', noteData.description);
      createdNoteId = res.body._id;
    });
  });

  describe('Get All Notes', () => {
    it('should return all notes of the user', async () => {
      const res = await request(app.getApp())
        .get('/api/v1/notes/')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.be.an('array');
    });
  });

  describe('Get Note by ID', () => {
    it('should return a note by its ID', async () => {
      const res = await request(app.getApp())
        .get(`/api/v1/notes/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('_id', createdNoteId);
    });
  });

  describe('Update Note', () => {
    it('should update a note successfully', async () => {
      const updatedNoteData = {
        title: 'Updated sample test Note',
        description: 'This is an updated sample test note.',
        color: 'blue',
        isArchive: true,
        isTrash: false,
      };

      const res = await request(app.getApp())
        .put(`/api/v1/notes/update/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedNoteData);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.be.an('object');
    });
  });

  describe('Archive Note', () => {
    it('should archive a note successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/archive/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.be.an('object');
    });
  });

  describe('Trash Note', () => {
    it('should move a note to trash successfully', async () => {
      const res = await request(app.getApp())
        .put(`/api/v1/notes/trash/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.have.property('message', 'Note moved to trash');
    });
  });

  describe('Delete Note Permanently', () => {
    it('should delete a note permanently', async () => {
      const res = await request(app.getApp())
        .delete(`/api/v1/notes/delete/${createdNoteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(HttpStatus.NOT_FOUND);
      expect(res.body).to.be.an('object');
    });
  });
});
