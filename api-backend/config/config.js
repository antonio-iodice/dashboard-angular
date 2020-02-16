const express = require('express');

module.exports.setUpServer = () => {
  const app = express();
  const morgan = require('morgan');
  const helmet = require('helmet');

  const api = require('../src/api');

  app.use(express.json());
  app.use(helmet());
  app.use(api);

  app.use(morgan('short'));

  return app;
};
