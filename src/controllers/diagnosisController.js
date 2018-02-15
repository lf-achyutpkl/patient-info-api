import { Router } from 'express';
import * as diagnosisService from '../services/diagnosisService';

const router = Router();

/**
 * GET /api/diagnosis
 */
router.get('/', (req, res, next) => {
  diagnosisService
    .getAllDiagnosis()
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

export default router;
