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

    describe('DELETE /notes/:id', () => {
        it('should delete a note', async () => {
            const note = { title: 'Test Note', content: 'Test Content' };
            sinon.stub(noteController, 'delete').resolves(note);

            const res = await request.delete('/api/notes/1');

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Note deleted successfully');
            expect(res.body).to.have.property('status', 'success');
        });

        it('should return 404 if note not found', async () => {
            sinon.stub(noteController, 'delete').resolves(null);

            const res = await request.delete('/api/notes/1');

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message', 'Note not found');
        });
    });
});