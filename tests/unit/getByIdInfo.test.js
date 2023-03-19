// tests/unit/getByIdInfo.test.js

const request = require('supertest');

const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /v1/fragments/:id/info', () => {
  test('fragments/:id/info returns an existing fragment metadata', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'content-type': 'text/html' })
      .send('test');

    const id = fragment.header.location.split('/')[3];
    logger.debug({ id }, 'Id Jest');
    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(res.body.fragment).toBe('test');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
