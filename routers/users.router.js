const express = require('express');
const router = express.Router();

const userController = require ('../controllers/users.controller');

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.post('/login', userController.login); //kenapa ini ga pakai rest api convention

module.exports = router;

