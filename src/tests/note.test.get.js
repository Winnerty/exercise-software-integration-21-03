const chai = require('chai');
const sinon = require('sinon');
const supertest = require('supertest');
const express = require('express');
const noteRoutes = require('../routes/note.routes');
const noteController = require('../controllers/note.controller');

const { expect } = chai;
const app = express();
app.use(express.json());
app.use('/api', noteRoutes);

describe('Note Routes', () => {
    let request;

    beforeEach(() => {
        request = supertest(app);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /notes', () => {
        it('should fetch all notes', async () => {
            const notes = [{ title: 'Test Note', content: 'Test Content' }];
            sinon.stub(noteController, 'findAll').resolves(notes);

            const res = await request.get('/api/notes');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Notes fetched successfully');
            expect(res.body).to.have.property('notes').that.is.an('array').that.deep.equals(notes);
            expect(res.body).to.have.property('status', 'success');
        });
    });
});