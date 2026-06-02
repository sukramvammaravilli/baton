const express = require('express');
const router = express.Router();

const walletController = require('../controllers/walletController');

router.post('/deposit', walletController.deposit);
router.post('/transfer', walletController.transfer);
router.get('/transactions', walletController.getTransactions);

module.exports = router;