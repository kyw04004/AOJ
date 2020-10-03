import express from 'express';
const router =  express.Router();
import { UserController } from '../controller/user.controller.js';

router.post('/login', UserController.login);
router.post('/signup', UserController.signup);


module.exports = router;