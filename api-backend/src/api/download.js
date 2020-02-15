const {Router} = require('express');
const DownloadService = require('../services/download-service');

const router = new Router();

const connString = process.env.DATABASE_URL;
const pg = require('pg');
const pgClient = new pg.Client(connString);
pgClient.connect();
const downloadService = new DownloadService(pgClient);

router.post('/', async (req, res, next) => {
  try {
    const result = await downloadService.createDownloadData(req.body);
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/', (req, res, next) => {
  console.log('BIIITCH');
  downloadService.getDownloadDataPromise()
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        next(error);
      });
});

module.exports = router;
