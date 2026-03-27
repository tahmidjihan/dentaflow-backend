import express from 'express';
import controller from './doctors.controller';

const router = express.Router();

router.get('/', controller.get);

export default router;
