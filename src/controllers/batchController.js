import { Router } from 'express';
import HttpStatus from 'http-status-codes';

import * as batchService from '../services/batchesService';

const router = Router();

router.get('/:id', (req, res, next) => {
  batchService
    .getBatch(req.params.id)
    .then(data => res.status(HttpStatus.OK).json({ data }))
    .catch(err => next(err));
});

export default router;
