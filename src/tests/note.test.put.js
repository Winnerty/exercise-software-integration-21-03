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

    describe('PUT /notes/:id', () => {
        it('should update a note', async () => {
            const note = { title: 'Updated Note', content: 'Updated Content' };
            sinon.stub(noteController, 'update').resolves(note);

            const res = await request.put('/api/notes/1').send(note);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('message', 'Note updated successfully');
            expect(res.body).to.have.property('note').that.includes(note);
            expect(res.body).to.have.property('status', 'success');
        });

        it('should return 404 if note not found', async () => {
            sinon.stub(noteController, 'update').resolves(null);

            const res = await request.put('/api/notes/1').send({ title: 'Updated Note', content: 'Updated Content' });

            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('message', 'Note not found');
        });
    });
});