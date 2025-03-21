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

    describe('POST /notes', () => {
        it('should create a new note', async () => {
            const note = { title: 'Test Note', content: 'Test Content' };
            sinon.stub(noteController, 'create').resolves(note);

            const res = await request.post('/api/notes').send(note);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Note created successfully');
            expect(res.body).to.have.property('note').that.includes(note);
            expect(res.body).to.have.property('status', 'success');
        });
    });
});