const request = require('supertest');
const app = require('../app');
describe('Get /metrics', () => {

  it('respond with 200', (done) => {
    request(app)
      .get('/metrics')
      .then( (response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});