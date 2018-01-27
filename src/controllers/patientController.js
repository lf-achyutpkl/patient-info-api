import qs from 'qs';
import { Router } from 'express';
import HttpStatus from 'http-status-codes';

import upload from '../middlewares/imageUpload';
import * as patientService from '../services/patientService';

const router = Router();

/**
 * POST /api/patients
 * Upload image
 */
router.post('/images', upload, (req, res, next) => {
  res.status(HttpStatus.OK).json({ data: res.req.files });
});

/**
 * Create patient and annotation
 */
router.post('/', (req, res, next) => {
  patientService
    .createPatient(req.body)
    .then(data => res.status(HttpStatus.CREATED).json({ data }))
    .catch(err => next(err));
});

/**
 * Get patient info and annotation
 */
router.get('/', (req, res, next) => {
  let queryParams = qs.parse(req.url.split('?')[1]);
  patientService
    .getAllPatients(queryParams)
    .then(data => res.json({ data, pagination: data.pagination }))
    .catch(err => next(err));
});

/**
 * Batch upload
 */
router.post('/batch-upload', upload, (req, res, next) => {
  patientService
    .saveBatchUpload(res.req.files)
    .then(() => res.status(HttpStatus.CREATED))
    .catch(err => next(err));
});

export default router;
