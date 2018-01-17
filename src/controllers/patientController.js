import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import multer from 'multer';
import uuid from 'uuid/v4';

import * as patientService from '../services/patientService';

const MAX_FILES_TO_UPLOAD = 10;

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // console.log(file.mimetype)
    cb(null, uuid() + getExtension(file));
  }
});

let getExtension = file => {
  // this function gets the filename extension by determining mimetype. To be exanded to support others, for example .jpeg or .tiff
  let res = '';
  if (file.mimetype === 'image/jpeg') {
    res = '.jpg';
  }
  if (file.mimetype === 'image/png') {
    res = '.png';
  }

  return res;
};

let upload = multer({
  storage: storage,
  limits: { fileSize: 6048576 } // limit file size to 1048576 bytes or 1 MB
  // ,fileFilter:
});

const router = Router();

/**
 * POST /api/users
 */
router.post('/images', upload.array('files', MAX_FILES_TO_UPLOAD), (req, res, next) => {
  res.status(HttpStatus.OK).json({ data: res.req.files });
});

router.post('/', (req, res, next) => {
  patientService
    .createPatient(req.body)
    .then(data => res.status(HttpStatus.CREATED).json({ data }))
    .catch(err => next(err));
});

router.get('/', (req, res, next) => {
  patientService
    .getAllPatients()
    .then(data => res.json(data))
    .catch(err => next(err));
});

export default router;
