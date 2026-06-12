const jwt = require("jsonwebtoken");
const BaseMySQLProvider = require("../dbConnection/connection");
const errorCodes = require("../config/errorCode");

const authenticateToken = async (req, res, next) => {
  let connection;
  try {
    connection = await BaseMySQLProvider.getPoolConnectionTransaction();
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(errorCodes.MISSING_TOKEN.status).json({
        error: errorCodes.MISSING_TOKEN.message,
      });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(errorCodes.MISSING_TOKEN.status).json({
        error: errorCodes.MISSING_TOKEN.message,
      });
    }
    let qParams = [token];
    let query = ` SELECT * FROM user_sessions WHERE session_token = ?`;
    let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
      connection,
      query,
      qParams,
    );
    if (result.length) {
      result = result[0];
      if (result.status === "LOGGED_OUT") {
        return res.status(errorCodes.LOGGED_OUT_ALREADY.status).json({
          message: errorCodes.LOGGED_OUT_ALREADY.message,
        });
      }
      if (new Date(result.expiry_time) < new Date()) {
        qParams = ["EXPIRED", token];
        query = ` UPDATE user_sessions SET status = ? WHERE session_token = ? `;
        await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        return res.status(errorCodes.SESSION_EXPIRED.status).json({
          message: errorCodes.SESSION_EXPIRED.message,
        });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } else {
      return res.status(errorCodes.SESSION_NOT_FOUND.status).json({
        message: errorCodes.SESSION_NOT_FOUND.message,
      });
    }
  } catch (error) {
    await BaseMySQLProvider.rollbackTransaction(connection);
    return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
      message: errorCodes.INTERNAL_SERVER_ERROR.message,
    });
  } finally {
    await BaseMySQLProvider.commitTransaction(connection);
  }
};

module.exports = authenticateToken;
