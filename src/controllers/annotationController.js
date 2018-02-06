import qs from 'qs';
import { Router } from 'express';
import HttpStatus from 'http-status-codes';

import * as annotationService from '../services/annotationService';

const router = Router();

router.get('/', (req, res, next) => {
  let queryParams = qs.parse(req.url.split('?')[1]);
  annotationService
    .getAllAnnotation(queryParams)
    .then(data => res.status(HttpStatus.OK).json({ data, pagination: data.pagination }))
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  annotationService
    .getAnnotation(req.params.id)
    .then(data => res.status(HttpStatus.OK).json({ data }))
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  annotationService
    .updateAnnotation(req.params.id, req.body)
    .then(data => {
      res.status(HttpStatus.OK).json({ data });
    })
    .catch(err => next(err));
});

export default router;
