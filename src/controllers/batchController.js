import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import qs from 'qs';

import * as batchService from '../services/batchesService';

const router = Router();

router.get('/', (req, res, next) => {
  let queryParams = qs.parse(req.url.split('?')[1]);
  batchService
    .getAllBatch(queryParams)
    .then(data => res.status(HttpStatus.OK).json({ data, pagination: data.pagination }))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  batchService
    .getBatch(req.params.id)
    .then(data => res.status(HttpStatus.OK).json({ data }))
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  batchService
    .updateBatch(req.params.id, req.body)
    .then(data => {
      res.status(HttpStatus.OK).json({ data });
    })
    .catch(err => next(err));
});

export default router;
