let express = require("express");
let app = express.Router();
const authController = require("../controller/authController");

app.post("/login", authController.login);
app.post("/register", authController.register);
app.get("/logout", authenticateToken,authController.logout);

module.exports = app;
