const { ErrorHandler } = require('../helpers/errors');
const { Download } = require('../models/download');
const query = { text: 'SELECT * FROM downloaddata' };
const text = `INSERT INTO 
              downloaddata(latitude, longitude, app_id, downloaded_at) 
              VALUES($1, $2, $3, $4) RETURNING *`;

class DownloadService {
  constructor(client) {
    this.client = client;
  }

  async createDownloadData(body) {
    const {latitude, longitude, appId, downloadedAt} = body.data;
    const download = this._validateData(
        new Download(latitude, longitude, appId, downloadedAt),
    );
    const values = [
      download.latitude,
      download.longitude,
      download.appId,
      download.downloadedAt,
    ];

    try {
      return this.client.query(text, values);
    } catch (error) {
      console.error(error);
      return new ErrorHandler(500, 'The message could not be saved');
    }
  }

  getDownloadDataPromise() {
    return this.client.query(query);
  }

  _validateData(data) {
    if (!data.latitude || !data.longitude ||
        !data.appId || !data.downloadedAt) {
      throw new ErrorHandler(403, 'All fields are mandatory');
    }

    if (!this._isCoordinate(data.latitude) ||
        !this._isCoordinate(data.longitude)) {
      throw new ErrorHandler(403, 'Please send valid coordinates');
    }

    if (!this._isValidDate(data.downloadedAt)) {
      throw new ErrorHandler(403, 'Download date is invalid');
    }

    data.downloadedAt = new Date(data.downloadedAt);
    return data;
  }

  _isCoordinate(lat) {
    return lat.match(/^([1-8]?[1-9]|[1-9]0)\,{1}\d{1,6}/);
  }

  _isValidDate(value) {
    console.log(value);
    const timestamp = Date.parse(value);
    console.log(timestamp);
    return !isNaN(timestamp);
  }
}

module.exports = DownloadService;
