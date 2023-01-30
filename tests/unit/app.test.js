// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

// Testing 404 handler in src/app.js using supertest unit tester
describe('404 Handler test', () => {
  test('Should return HTTP 404 not found response', async () => {
    const res = await request(app).get('/somethingwrong');
    expect(res.statusCode).toBe(404);
  });
});
