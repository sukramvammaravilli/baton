const ms = require("ms");
const BaseMySQLProvider = require("../dbConnection/connection");
let connection = require("mysql");

module.exports = {
  register: async (params) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [
        params.username,
        params.fullname,
        params.email,
        params.currency_code,
        params.mobile,
        params.identityNumber,
        params.password,
      ];
      let query = ` INSERT INTO users ( username, fullname, email, currency_code, mobile_number, identity_number, password ) VALUES (?,?,?,?,?,?,?) `;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      // appLogger.error(null, null, "Error in Repo: userRepo, Method: getUserId", err);
      if (!is_external_connection) {
        BaseMySQLProvider.rollbackTransaction(connection);
      }
      throw error;
    } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        BaseMySQLProvider.commitTransaction(connection);
      }
    }
  },

  getCountries: async (params) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [];
      let query = ` SELECT currency_code,currency_symbol FROM currency`;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      // appLogger.error(null, null, "Error in Repo: userRepo, Method: getUserId", err);
      if (!is_external_connection) {
        BaseMySQLProvider.rollbackTransaction(connection);
      }
      throw error;
    } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        BaseMySQLProvider.commitTransaction(connection);
      }
    }
  },

  login: async (params) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [params.username];
      let query = ` SELECT * FROM users WHERE username=? `;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      // appLogger.error(null, null, "Error in Repo: userRepo, Method: getUserId", err);
      if (!is_external_connection) {
        BaseMySQLProvider.rollbackTransaction(connection);
      }
      throw error;
    } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        BaseMySQLProvider.commitTransaction(connection);
      }
    }
  },

  logout: async (token) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = ['LOGGED_OUT', new Date(),token , 'ACTIVE'];
      let query = ` UPDATE user_sessions SET status = ? , logout_time = ? WHERE session_token = ? AND status = ? `;
      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      // appLogger.error(null, null, "Error in Repo: userRepo, Method: getUserId", err);
      if (!is_external_connection) {
        BaseMySQLProvider.rollbackTransaction(connection);
      }
      throw error;
    } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        BaseMySQLProvider.commitTransaction(connection);
      }
    }
  },

  insertSession: async (params, token) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      const expiryTime = new Date( Date.now() + ms(params.session_time) );
      let qParams = [params.username,token,expiryTime,'ACTIVE'];
      let query = `INSERT INTO user_sessions
    (
        username,
        session_token,
        expiry_time,
        status
    )
    VALUES
    (
        ?, ?, ?, ?
    ) `;
      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      // appLogger.error(null, null, "Error in Repo: userRepo, Method: getUserId", err);
      if (!is_external_connection) {
        BaseMySQLProvider.rollbackTransaction(connection);
      }
      throw error;
    } finally {
      // appLogger.info(null, "End of Repo: UserRepo, Method: getUserId");
      if (!is_external_connection) {
        BaseMySQLProvider.commitTransaction(connection);
      }
    }
  },
};
