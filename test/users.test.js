const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const fs = require('fs');

describe('Users', () => {
    const deleteUsers = () => {
        fs.readdir('data/users', (err, files) => {
            if (files) files.forEach(file => fs.rmSync(`data/users/${file}`));
        });
    };
    beforeEach(() => {
        deleteUsers();
    });
    afterEach(() => {
        deleteUsers();
    });
    describe('POST /users', () => {
        it('returns new UUID', async () => {
            const res = await request(app)
                .post('/users')
                .expect(201);
            expect(res.body.id).to.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/);
        });
        it('returns different UUIDs for each new user', async () => {
            const res1 = await request(app).post('/users');
            const res2 = await request(app).post('/users');
            expect(res1.body.id).to.not.equal(res2.body.id);
        });
    });
    describe('GET /users/:id', () => {
        it('returns 400 bad request when user not found', async () => {
            await request(app)
                .get('/users/589b1964-9e17-11eb-a8b3-0242ac130003')
                .expect(400);
        });
        it('returns 200 when user found', async () => {
            const res = await request(app)
                .post('/users');
            await request(app)
                .get(`/users/${res.body.id}`)
                .expect(200);
        });
    });
});