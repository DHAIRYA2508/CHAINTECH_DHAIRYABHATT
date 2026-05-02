const request = require('supertest');
const app = require('../src/app');

describe('Task API Endpoints', () => {
    it('should fetch the home route message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('Task Manager API is running!');
    });

    it('should fetch all tasks', async () => {
        const res = await request(app).get('/tasks');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
