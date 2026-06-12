require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Routes = require("./routes/index");
const Initialization = require("./dbConnection/dbInit");
const app = express();
app.use(cors());
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
