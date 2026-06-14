require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const Routes = require("./routes/index");
const Initialization = require("./dbConnection/dbInit");
const app = express();
const exchangeRates = require("./services/services")

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests. Please try again later.",
});
app.use(limiter);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
Routes(app);
app.use(express.static(path.join(__dirname, "ui")));
const PORT = process.env.PORT || 3000;
async function startServer() {
  try {
    await Initialization.initialize();
    await exchangeRates.updateExchangeRates();
    setInterval(
      async () => {
        await exchangeRates.updateExchangeRates();
      },
      60 * 60 * 1000
    );
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Failed", error);
    process.exit(1);
  }
}
if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;
