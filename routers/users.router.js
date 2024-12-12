const express = require('express');
const router = express.Router();

const userController = require ('../controllers/users.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.post('/users', userController.createUser);
router.get('/profile', authenticateToken, userController.getUserById);
router.post('/login', userController.login); //kenapa ini ga pakai rest api convention

module.exports = router;

