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

    describe('GET /notes/:id', () => {
        it('should fetch a single note', async () => {
            const note = { title: 'Test Note', content: 'Test Content' };
            sinon.stub(noteController, 'findOne').resolves(note);

            const res = await request.get('/api/notes/1');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Note fetched successfully');
            expect(res.body).to.have.property('note').that.includes(note);
            expect(res.body).to.have.property('status', 'success');
        });

        it('should return 404 if note not found', async () => {
            sinon.stub(noteController, 'findOne').resolves(null);

            const res = await request.get('/api/notes/1');

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message', 'Note not found');
        });
    });
});