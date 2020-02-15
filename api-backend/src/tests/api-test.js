// Import the dependencies for testing
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../server');
// Configure chai
chai.use(chaiHttp);
chai.should();
describe('Download', () => {
  describe('GET /', () => {
    // Test to get all students record
    it('should get all download records', (done) => {
      chai.request(server)
          .get('/api/download')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('Array');
            res.body.length.should.be.above(0);
            res.body[1].app_id.length.should.be.above(0);
            done();
          });
    });
  });
});

describe('Download', () => {
  describe('POST /', () => {
    it('should not create a new download record', (done) => {
      chai.request(app)
          .post(`/api/download`)
          .send({app_id: 'test'})
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.have.length.above(0);
            done();
          });
    });

    it('should not create a new download record for wrong input', (done) => {
      const reqBody = {
        latitude: '9,100',
        longitude: '5,2100', 
        appId: 'APP_ID', 
        downloadedAt: '10/10/2020'
      };

      chai.request(app)
          .post(`/api/download`)
          .send(reqBody)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.message.should.have.length.above(0);
            done();
          });
    });
  });
});
