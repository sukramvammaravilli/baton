const jwt = require("jsonwebtoken");
const BaseMySQLProvider = require("../dbConnection/connection")
let connection = require("mysql");

const authenticateToken = async (req, res, next) => {
  let is_external_connection = true;
  try {
    if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token missing",
      });
    }
    const token = authHeader.split(" ")[1];
    let qParams = [token];
    let query = `
        SELECT *
        FROM user_sessions
        WHERE session_token = ?
    `;
    let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    if(result.length){
      result = result[0];
      if(result.status === "LOGGED_OUT") {
        return res.status(401).json({
        message: "User already logged out"
      })
      }
      if(new Date( result.expiry_time ) < new Date()) {
        qParams = ['EXPIRED',token]
        query = `
        UPDATE user_sessions
        SET status = ?
        WHERE session_token = ?
    `;
await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
        return res.status(401).json({
        message: "Session Expired"
      })
      }
      const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );
    req.user = decoded;
    next();
    } else {
      return res.status(401).json({
        message: "Session Not found"
      })
    }     
  } catch (error) {

     if (!is_external_connection) {
       await BaseMySQLProvider.rollbackTransaction(connection);
      }

    return res.status(401).json({
      message: "Internal Server Error",
    });
  } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        await BaseMySQLProvider.commitTransaction(connection);
      }
    }
};

module.exports = authenticateToken;