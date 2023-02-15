// tests/unit/get.test.js

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

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    logger.debug({ res }, 'fragments list by user in test.js');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // Using a valid username/password pair should give a success result with a .fragments array with length 1
  test('authenticated users get a fragments array with certain length (not expanded', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    logger.debug(res.body.fragments, 'Returned fragment using get method');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(typeof res.body.fragments[0] === 'string').toBe(true);
  });

  test('authenticated users get a fragments array with certain length (expand)', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .query({ expand: '1' })
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments.length).toBe(1);
    expect(typeof res.body.fragments[0] === 'object').toBe(true);
  });

  test('fragments/:id returns an existing fragment', async () => {
    const fragment = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set({ 'content-type': 'text/plain' })
      .send('test');
    const id = fragment.header.location.split('/')[3];
    logger.debug({ id }, 'Id');
    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
