const {Router} = require('express');
const DataService = require('../services/data-service');

const router = new Router();
const dataService = new DataService();

router.post('/', async (req, res, next) => {
  try {
    const result = await dataService.createDownloadData(req.body);
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/', (req, res, next) => {
  dataService.getDownloadDataPromise()
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        next(error);
      });
});

module.exports = router;
