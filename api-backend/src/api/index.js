const express = require('express');

const { Router } = express;
const router = new Router();
const clientSession = require('client-sessions');
const cors = require('cors');
const whitelist = ['http://localhost:4200', 'http://localhost:3000', '*'];
const {SESSION_SECRET} = require('../../config');

const download = require('./download');
const { handleError } = require('../helpers/errors');

router.get('/', (req, res) => res.sendStatus(200));

router.use(
    clientSession({
      cookieName: 'session',
      secret: SESSION_SECRET,
      duration: 24 * 60 * 60 * 1000,
    }),
);

router.use(function(req, res, next) {
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
  // origin: (origin, callback) => {
  //   if (whitelist.includes(origin)) {
  //     return callback(null, true);
  //   }

  //   callback(new Error('Not allowed by CORS'));
  // },
};

router.use(cors(corsOptions));
router.get('/health', (req, res) => res.sendStatus(200));

router.use('/api/download', download);

router.use('/api/download', (err, req, res, next) => {
  console.log('handling error');
  handleError(err, res);
});

router.use('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

module.exports = router;
