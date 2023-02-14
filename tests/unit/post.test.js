// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

const logger = require('../../src/logger');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using valid credentials, but wrong type should return error 415 (wrong data type)
  test('unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'image/png')
      .send(Buffer.from('test'))
      .auth('user1@email.com', 'password1');
    logger.debug(async () => {
      const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
      res;
    }, 'Check user posting fragment');
    expect(res.statusCode).toBe(415);
  });

  // Using valid credentials and supported type should return 201 (record created)
  test('authenticated users create text/plain fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('content-type', 'text/plain')
      .send(Buffer.from('test'))
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toBeDefined();
  });
});
