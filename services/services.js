const BaseMySQLProvider = require("../dbConnection/connection");
let connection = require("mysql");

module.exports = {

  addAccount: async (username, account) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [username, account, 0.0, 0.0, 0.0, "ACTIVE"];
      let query = ` INSERT INTO accounts (username,account_no,total_balance,total_deposit,total_transfer,status) VALUES (?,?,?,?,?,?)`;
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

  removeAccount: async (username, account) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = ["INACTIVE", username, account];
      let query = ` UPDATE accounts SET status = ? WHERE username = ? AND account_no = ? AND status = 'ACTIVE'`;
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

  getProfile: async (username) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [username];
      let query = ` SELECT * FROM users WHERE username = ? `;
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

  deposit: async (params) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      let qParams = [params.accountNo, "ACTIVE"];
      let query = ` SELECT * FROM users u INNER JOIN accounts a ON u.username = a.username WHERE a.account_no = ? AND a.status = ? `;
      let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (result.length > 0) {
        result = result[0];
        let depositedAmount = await module.exports.exchange({
          fromCurrency: params.currency,
          toCurrency: result.currency_code,
          amount: params.amount,
        });
        qParams = [depositedAmount, depositedAmount, params.accountNo];
        query = ` UPDATE accounts SET total_balance = total_balance + ?, total_deposit = total_deposit + ? WHERE account_no = ?`;
        await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        const transactionId =
          "TXN" + Date.now() + Math.floor(Math.random() * 1000);
        qParams = [
          transactionId,
          params.username,
          "DEPOSIT",
          "NULL",
          params.accountNo,
          params.currency,
          params.amount,
          depositedAmount,
        ];
        query = `INSERT INTO transactions (
    transaction_id,
    username,
    type,
    from_account,
    to_account,
    currency, 
    amount,
    converted_amount
)
VALUES
(?,?,?,?,?,?,?,?)`;
        let final = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        if (final.affectedRows === 1) {
          qParams = ["SUCCESS", transactionId];
          query = ` UPDATE transactions SET status = ? WHERE transaction_id = ? `;
          return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
            connection,
            query,
            qParams,
          );
        }
      } else {
        throw error;
      }
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

  updateProfile: async (params) => {
    let is_external_connection = true;
    try {
      // appLogger.info(null, "Start of Repo: UserRepo, Method: getUserId");
      if (!connection) {
        is_external_connection = false;
        connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      }
      const qParams = [
        params.email,
        params.mobile,
        params.identityNumber,
        params.fullname,
        params.username,
      ];
      const query = ` UPDATE users SET email = ?  , mobile_number = ? , identity_number = ? , fullname = ?  WHERE username = ? `;

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
};
