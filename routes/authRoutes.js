let express = require("express");
let app = express.Router();
const authController = require("../controller/authController");
const authenticateToken = require("../middleware/authMiddleware");

app.post("/login", authController.login);
app.post("/register", authController.register);
app.get("/countries", authController.getCountries);
app.get("/logout", authenticateToken,authController.logout);

module.exports = app;