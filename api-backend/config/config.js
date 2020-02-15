const express = require('express');

module.exports.setUpServer = () => {
  const app = express();
  const cors = require('cors');
  const morgan = require('morgan');
  const clientSession = require('client-sessions');
  const helmet = require('helmet');
  const whitelist = ['http://localhost:4200', 'http://localhost:3000'];
  const {SESSION_SECRET} = require('../config');

  const api = require('../src/api');

  app.use(express.json());
  app.use(helmet());
  app.use(api);

  app.use(morgan('short'));

  app.use(
      clientSession({
        cookieName: 'session',
        secret: SESSION_SECRET,
        duration: 24 * 60 * 60 * 1000,
      }),
  );

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
  });

  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      if (whitelist.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
  };

  app.use(cors(corsOptions));

  return app;
};
