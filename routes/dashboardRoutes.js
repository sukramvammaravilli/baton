let express = require('express');
let app = express.Router();
// const customer_controller = require('../controllers/customer_controller');
// const middleware = require('../config/middleware_config');
// const applicationMiddleware = require('../middlewares/application');


// const auth =
    // require('../middleware/authMiddleware');

const walletController =
    require('../controller/controller');

app.post(
    '/deposit',
    // auth,
    walletController.deposit
);

app.post(
    '/transfer',
    // auth,
    walletController.transfer
);

// app.post(
//     '/reversal/:id',
//     // auth,
//     walletController.reverseTransaction
// );

app.get(
    '/transactions',
    // auth,
    walletController.getTransactions
);

module.exports = app;




//     const express =
//     require('express');

// const router =
//     express.Router();

// const authController =
//     require('../controllers/authController');

// router.post(

//     '/login',

//     authController.login

// );

// module.exports =
//     router;