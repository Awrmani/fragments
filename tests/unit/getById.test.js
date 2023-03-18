// tests/unit/getById.test.js

const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

beforeAll(async () => {
  await request(app)
    .post('/v1/fragments')
    .auth('user1@email.com', 'password1')
    .set({ 'content-type': 'text/plain' })
    .send('test');
});

describe('GET /v1/fragments/:id', () => {
  test('fragments/:id returns an existing fragment', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'content-type': 'text/html' })
      .send('test');

    const id = fragment.header.location.split('/')[3];
    logger.debug({ id }, 'Id Jest');
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.text).toBe('test');
    expect(res.statusCode).toBe(200);
  });
});
