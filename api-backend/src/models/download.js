const Download = class Download {
  constructor(latitude, longitude, appId, downloadedAt) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.appId = appId;
    this.downloadedAt = downloadedAt;
  }
};

module.exports = { Download };
