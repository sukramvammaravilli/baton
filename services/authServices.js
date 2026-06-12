const ms = require("ms");
const BaseMySQLProvider = require("../dbConnection/connection");

module.exports = {
  register: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
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
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  getCountries: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [];
      let query = ` SELECT currency_code,currency_symbol FROM currency`;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  login: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.username];
      let query = ` SELECT * FROM users WHERE username=? `;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  logout: async (token) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = ["LOGGED_OUT", new Date(), token, "ACTIVE"];
      let query = ` UPDATE user_sessions SET status = ? , logout_time = ? WHERE session_token = ? AND status = ? `;
      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  insertSession: async (params, token) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      const expiryTime = new Date(Date.now() + ms(params.session_time));
      let qParams = [params.username, token, expiryTime, "ACTIVE"];
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
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },
};
