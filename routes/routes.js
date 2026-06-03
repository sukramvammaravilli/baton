const express =
    require('express');

const router =
    express.Router();

const auth =
    require('../middleware/authMiddleware');

const walletController =
    require('../controllers/walletController');

router.post(
    '/deposit',
    auth,
    walletController.deposit
);

router.post(
    '/transfer',
    auth,
    walletController.transfer
);

router.post(
    '/reversal/:id',
    auth,
    walletController.reverseTransaction
);

router.get(
    '/transactions',
    auth,
    walletController.getTransactions
);

module.exports =
    router;