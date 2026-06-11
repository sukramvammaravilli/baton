let express = require("express");
let app = express.Router();
const walletController = require("../controller/controller");
const authenticateToken = require("../middleware/authMiddleware");

// app.get("/",authenticateToken,walletController.dashboard);
app.post("/deposit",authenticateToken, walletController.deposit);
// app.post("/transfer", authenticateToken,walletController.transfer);
app.get("/profile",authenticateToken,walletController.getProfile);
app.put("/updateProfile", authenticateToken,walletController.updateProfile);
// app.get("/getCurrencies",authenticateToken,walletController.getCurrencies);
// app.post("/exchange", authenticateToken,walletController.exchange);
// app.get("/transactions", authenticateToken,walletController.getTransactions);
app.post("/addAccount", authenticateToken,walletController.addAccount);
app.put("/removeAccount", authenticateToken,walletController.removeAccount);
// app.post("/reverseTransaction", authenticateToken,walletController.reverseTransaction);
module.exports = app;
