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
  }
}