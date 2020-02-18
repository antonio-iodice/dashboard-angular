process.env.NODE_ENV = 'test';
const assert = require('assert');
const expect = require('chai').expect;
const DataService = require('../services/data-service');
let dataService;

describe('Download Service', function() {
  before(function() {
    dataService = new DataService();
  });

  describe('Data Creation', function() {
    it('should create data', async function() {
      const data = {};
      data.latitude = '9.185924';
      data.longitude = '45.4654219';
      data.appId = 'APP_ID';
      data.downloadedAt = '12/10/2019';
      const res = await dataService.createDownloadData({ data });
      assert.equal(res.rows.length, 1);
      assert.equal(res.rows[0].latitude, '9.185924');
      assert.equal(res.rows[0].longitude, '45.4654219');
      assert.equal(res.rows[0].app_id, 'APP_ID');
      assert.equal(Date.parse(res.rows[0].downloaded_at),
          Date.parse('2019-12-10T00:00:00.000Z'));
    });
  });

  describe('States', function() {
    it('should return correct country for coordinates', function() {
      const countryIta = dataService._retrieveCountry('9.185924', '45.4654219');
      const countryGbr = dataService._retrieveCountry('-0.127758', '51.507351');
      const countrySom = dataService._retrieveCountry('45', '9');
      const countryUnk = dataService._retrieveCountry('-450', '-9');
      assert.equal(countryIta, 'ITA');
      assert.equal(countryGbr, 'GBR');
      assert.equal(countrySom, 'SOM');
      assert.equal(countryUnk, 'UNKNOWN');
    });
  });

  describe('Validations', function() {
    it('should throw if fields are not defined', function() {
      const data = {};
      data.latitude = '';
      data.longitude = '';
      data.appId = '';
      data.downloadedAt = '';
      expect(dataService._validateData.bind(dataService, data))
          .to.throw('All fields are mandatory');
    });

    it('should throw if coordinates are invalid', function() {
      const data = {};
      data.latitude = 'invalid';
      data.longitude = 'invalid';
      data.appId = 'APP_ID';
      data.downloadedAt = '12/10/10';
      expect(dataService._validateData.bind(dataService, data))
          .to.throw('Please send valid coordinates');
    });

    it('should throw if is invalid', function() {
      const data = {};
      data.latitude = '40.100';
      data.longitude = '9.100';
      data.appId = 'APP_ID';
      data.downloadedAt = 'inoaoas';
      expect(dataService._validateData.bind(dataService, data))
          .to.throw('Download date is invalid');
    });

    it('should check valid date', function() {
      assert.equal(dataService._isValidDate('12/10/2012'), true);
      assert.equal(dataService._isValidDate('12-10-2012'), true);
      assert.equal(dataService._isValidDate('120/10/12'), false);
      assert.equal(dataService._isValidDate('120-10-12'), false);
      assert.equal(dataService._isValidDate('1200012'), false);
      assert.equal(dataService._isValidDate('DATA'), false);
      assert.equal(dataService._isValidDate(''), false);
      assert.equal(dataService._isValidDate(undefined), false);
    });

    it('should check valid coordinates', function() {
      assert.equal(dataService._isCoordinate('9.185924', '45.4654219'), true);
    });
  });
});

