const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactions.controller');
const authenticateToken = require('../middlewares/auth.middleware');

router.get('/transactions', authenticateToken, transactionController.getTransactionById);
router.post('/transactions/topup', authenticateToken, transactionController.topup);
router.post('/transactions/transfer', authenticateToken, transactionController.transfer);

module.exports = router;

