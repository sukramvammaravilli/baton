let express = require('express');
let app = express.Router();
// const customer_controller = require('../controllers/customer_controller');
// const middleware = require('../config/middleware_config');
// const applicationMiddleware = require('../middlewares/application');
const authController = require('../controller/authController');

app.post(
    '/login',
    authController.login
);
app.post(
    '/register',
    authController.register
);

module.exports = app;