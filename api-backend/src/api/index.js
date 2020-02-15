const express = require('express');

const {Router} = express;
const router = new Router();

const download = require('./download');
const { handleError } = require('../helpers/errors');

router.use('/api/download', download);

router.use('/api/download', (err, req, res, next) => {
  console.log('handling error');
  handleError(err, res);
});

router.use('*', (req, res) => {
  res.status(404).send('Page Not Found');
});

module.exports = router;
