import { Router } from 'express';
import * as annotationLabelsService from '../services/annotationLabelsService';

const router = Router();

/**
 * GET /api/annotationlabels/type
 */
router.get('/:type', (req, res, next) => {
  annotationLabelsService
    .getLabelByType(req.params.type)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

export default router;
