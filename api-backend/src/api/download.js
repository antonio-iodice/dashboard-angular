const {Router} = require('express');
const DownloadService = require('../services/download-service');

const router = new Router();
const downloadService = new DownloadService();

router.post('/', async (req, res, next) => {
  try {
    const result = await downloadService.createDownloadData(req.body);
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/', (req, res, next) => {
  downloadService.getDownloadDataPromise()
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        next(error);
      });
});

module.exports = router;
