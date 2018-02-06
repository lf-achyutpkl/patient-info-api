import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as tagService from '../services/tagService';

const router = Router();

/**
 * GET /api/tags
 */
router.get('/', (req, res, next) => {
  tagService
    .getAllTags()
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * POST /api/users
 */
router.post('/', (req, res, next) => {
  tagService
    .createTag(req.body)
    .then(data => res.status(HttpStatus.CREATED).json({ data }))
    .catch(err => next(err));
});

export default router;
