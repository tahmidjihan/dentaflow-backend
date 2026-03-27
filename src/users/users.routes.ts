import express from 'express';
import controller from './users.controller';

const router = express.Router();

router.get('/', controller.get);
router.get('/:id', controller.getById);

export default router;
