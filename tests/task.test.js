const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

// Mock the Mongoose model to avoid database hanging during tests
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual('mongoose');
    return {
        ...actualMongoose,
        connect: jest.fn().mockResolvedValue(true),
        model: (name, schema) => {
            if (name === 'Task') {
                return {
                    find: jest.fn().mockReturnThis(),
                    sort: jest.fn().mockResolvedValue([]),
                    findById: jest.fn(),
                    save: jest.fn(),
                };
            }
            return actualMongoose.model(name, schema);
        },
    };
});

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

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
