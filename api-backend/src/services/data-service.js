const wc = require('which-country');
const connString = process.env.DATABASE_URL;
const pg = require('pg');
const pgClient = new pg.Client(connString);
pgClient.connect();

const { ErrorHandler } = require('../helpers/errors');
const { Download } = require('../models/download');
const query = { text: 'SELECT * FROM downloaddata' };
const text = `INSERT INTO 
              downloaddata(latitude, longitude, app_id, downloaded_at, country) 
              VALUES($1, $2, $3, $4, $5) RETURNING *`;

class DataService {
  constructor() {}

  async createDownloadData(body) {
    const { latitude, longitude, appId, downloadedAt } = body.data;
    const download = this._validateData(
        new Download(latitude, longitude, appId, downloadedAt),
    );
    const country = this._retrieveCountry(latitude, longitude);
    const values = [
      download.latitude,
      download.longitude,
      download.appId,
      download.downloadedAt,
      country,
    ];

    try {
      return pgClient.query(text, values);
    } catch (error) {
      console.error(error);
      return new ErrorHandler(500, 'The message could not be saved');
    }
  }

  getDownloadDataPromise() {
    return pgClient.query(query);
  }

  _retrieveCountry(latitude, longitude) {
    return (
      wc([Number.parseFloat(latitude), Number.parseFloat(longitude)]) ||
      'UNKNOWN'
    );
  }

  _validateData(data) {
    if (
      !data.latitude ||
      !data.longitude ||
      !data.appId ||
      !data.downloadedAt
    ) {
      throw new ErrorHandler(403, 'All fields are mandatory');
    }

    if (
      !this._isCoordinate(data.latitude) ||
      !this._isCoordinate(data.longitude)
    ) {
      throw new ErrorHandler(403, 'Please send valid coordinates');
    }

    if (!this._isValidDate(data.downloadedAt)) {
      throw new ErrorHandler(403, 'Download date is invalid');
    }

    data.downloadedAt = new Date(data.downloadedAt);
    return data;
  }

  _isCoordinate(lat) {
    const latCheck = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const longCheck = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    return latCheck.test(lat) || longCheck.test(lat);
  }

  _isValidDate(value) {
    if (!value) return false;
    const parms = value.split(/[\.\-\/]/);
    const yyyy = parseInt(parms[2], 10);
    const mm = parseInt(parms[1], 10);
    const dd = parseInt(parms[0], 10);
    const date = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
    return (
      mm === date.getMonth() + 1 &&
      dd === date.getDate() &&
      yyyy === date.getFullYear()
    );
  }
}

module.exports = DataService;
