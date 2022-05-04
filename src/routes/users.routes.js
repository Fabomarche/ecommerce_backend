import express from 'express';
const router = express.Router();
import usersController from '../controllers/users.controller.js'

router.get('/:pid', usersController.getUserById)