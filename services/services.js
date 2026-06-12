const BaseMySQLProvider = require("../dbConnection/connection");
const errorCodes = require("../config/errorCode");
module.exports = {
  dashboard: async (username) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username, "ACTIVE"];
      let query = ` SELECT * FROM accounts a INNER JOIN users u ON a.username = u.username WHERE a.username = ? AND a.status = ?`;
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

  addAccount: async (username, account) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username, account, 0.0, 0.0, 0.0, "ACTIVE"];
      let query = ` INSERT INTO accounts (username,account_no,total_balance,total_deposit,total_transfer,status) VALUES (?,?,?,?,?,?)`;
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

  removeAccount: async (username, account) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = ["INACTIVE", username, account];
      let query = ` UPDATE accounts SET status = ? WHERE username = ? AND account_no = ? AND status = 'ACTIVE'`;
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

  getProfile: async (username) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username];
      let query = ` SELECT * FROM users WHERE username = ? `;
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

  getCurrencies: async () => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      const qParams = [];
      let query = ` SELECT * FROM currency `;
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

  exchange: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      if (params.fromCurrency === params.toCurrency) {
        return params.amount;
      } else {
        const qParams = [params.fromCurrency, params.toCurrency];
        let query = ` SELECT * FROM currency WHERE currency_code IN (?,?) `;
        let values = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        let fromCurrency = values.find(
          (ele) => ele.currency_code === params.fromCurrency,
        ).exchange_rate;
        let toCurrency = values.find(
          (ele) => ele.currency_code === params.toCurrency,
        ).exchange_rate;
        let amount = (params.amount / fromCurrency) * toCurrency;
        return amount.toFixed(3);
      }
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  deposit: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
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
        throw new Error(errorCodes.ACCOUNT_NOT_ACTIVE.message);
      }
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  getTransactions: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [
        params.account,
        params.account,
        params.account,
        params.account,
        params.account,
        params.account,
      ];
      let query = ` SELECT *
FROM transactions
WHERE (
        type = 'TRANSFER_IN'
        AND to_account = ?
    )
    OR
    (
        type = 'TRANSFER_OUT'
        AND from_account = ?
    )
        OR
    (
        type = 'REVERSE_IN'
        AND to_account = ?
    )
        OR
    (
        type = 'REVERSE_OUT'
        AND from_account = ?
    )
    OR
    (
        type NOT IN (
            'TRANSFER_IN',
            'TRANSFER_OUT',
            'REVERSE_IN',
            'REVERSE_OUT'
        )
        AND (
            from_account = ?
            OR
            to_account = ?
        )
    )
ORDER BY created_at DESC`;
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

  transfer: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.fromAccount, params.toAccount, "ACTIVE"];
      let query = ` SELECT * FROM users u INNER JOIN accounts a ON u.username = a.username WHERE a.account_no IN (?,?) AND a.status = ? FOR UPDATE`;
      let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (result.length === 2) {
        for (let obj of result) {
          let transferAmount = await module.exports.exchange({
            fromCurrency: params.currency,
            toCurrency: obj.currency_code,
            amount: params.amount,
          });
          if (obj.account_no === params.fromAccount) {
            qParams = [
              transferAmount,
              transferAmount,
              params.fromAccount,
              transferAmount,
            ];
            if (Number(obj.total_balance) < Number(transferAmount)) {
              throw new Error(errorCodes.INSUFFICIENT_BALANCE.message);
            }
            query = ` UPDATE accounts SET total_balance = total_balance - ?, total_transfer = total_transfer + ? WHERE account_no = ? AND total_balance >= ? `;
            let result =
              await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                connection,
                query,
                qParams,
              );
            if (result.affectedRows !== 1) {
              throw new Error(errorCodes.TRANSFER_FAILED.message);
            }
          } else {
            qParams = [transferAmount, transferAmount, params.toAccount];
            query = ` UPDATE accounts SET total_balance = total_balance + ?, total_deposit = total_deposit + ? WHERE account_no = ? `;
            let result =
              await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                connection,
                query,
                qParams,
              );
            if (result.affectedRows !== 1) {
              throw new Error(errorCodes.TRANSFER_FAILED.message);
            }
          }
        }
        for (let obj of result) {
          let transferAmount = await module.exports.exchange({
            fromCurrency: params.currency,
            toCurrency: obj.currency_code,
            amount: params.amount,
          });
          if (obj.account_no === params.fromAccount) {
            const transactionId =
              "TXN" + Date.now() + Math.floor(Math.random() * 1000);
            qParams = [
              transactionId,
              params.username,
              "TRANSFER_OUT",
              obj.account_no,
              params.toAccount,
              params.currency,
              params.amount,
              transferAmount,
              "SUCCESS",
            ];
            query = `INSERT INTO transactions (
    transaction_id,
    username,
    type,
    from_account,
    to_account,
    currency, 
    amount,
    converted_amount,
    status
)
VALUES
(?,?,?,?,?,?,?,?,?)`;
            await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
              connection,
              query,
              qParams,
            );
          } else {
            const transactionId =
              "TXN" + Date.now() + Math.floor(Math.random() * 1000);
            qParams = [
              transactionId,
              params.username,
              "TRANSFER_IN",
              params.fromAccount,
              obj.account_no,
              params.currency,
              params.amount,
              transferAmount,
              "SUCCESS",
            ];
            query = `INSERT INTO transactions (
    transaction_id,
    username,
    type,
    from_account,
    to_account,
    currency, 
    amount,
    converted_amount,
    status
)
VALUES
(?,?,?,?,?,?,?,?,?)`;
            await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
              connection,
              query,
              qParams,
            );
          }
        }
      } else {
        throw new Error(errorCodes.INVALID_TRANSFER_ACCOUNTS.message);
      }
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  reverseTransaction: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.transaction_id];
      let query = ` SELECT * FROM transactions WHERE transaction_id = ?`;
      let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (result.length) {
        result = result[0];
        qParams = [result.from_account, result.to_account, "ACTIVE"];
        query = ` SELECT * FROM users u INNER JOIN accounts a ON u.username = a.username WHERE a.account_no IN (?,?) AND a.status = ? FOR UPDATE`;
        let results =
          await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
            connection,
            query,
            qParams,
          );
        if (results.length === 2) {
          for (let obj of results) {
            if (obj.account_no === result.from_account) {
              qParams = [
                result.converted_amount,
                result.converted_amount,
                result.from_account,
              ];
              query = ` UPDATE accounts SET total_balance = total_balance + ?, total_transfer = total_transfer - ? WHERE account_no = ?  `;
              let execute =
                await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                  connection,
                  query,
                  qParams,
                );
              if (execute.affectedRows !== 1) {
                throw new Error(errorCodes.TRANSFER_FAILED.message);
              }
            } else {
              let transferAmount = await module.exports.exchange({
                fromCurrency: result.currency,
                toCurrency: obj.currency_code,
                amount: result.amount,
              });
              qParams = [
                transferAmount,
                transferAmount,
                result.to_account,
                transferAmount,
              ];
              if (Number(obj.total_balance) < Number(transferAmount)) {
                throw new Error(errorCodes.INSUFFICIENT_BALANCE.message);
              }
              query = ` UPDATE accounts SET total_balance = total_balance - ?, total_deposit = total_deposit - ? WHERE account_no = ? AND total_balance >= ?`;
              let execute =
                await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                  connection,
                  query,
                  qParams,
                );
              if (execute.affectedRows !== 1) {
                throw new Error(errorCodes.TRANSFER_FAILED.message);
              }
            }
          }
          for (let obj of results) {
            if (obj.account_no === result.from_account) {
              const transactionId =
                "TXN" + Date.now() + Math.floor(Math.random() * 1000);
              qParams = [
                transactionId,
                result.username,
                "REVERSE_OUT",
                result.to_account,
                obj.account_no,
                result.currency,
                result.amount,
                result.converted_amount,
                "SUCCESS",
              ];
              query = `INSERT INTO transactions (
    transaction_id,
    username,
    type,
    from_account,
    to_account,
    currency, 
    amount,
    converted_amount,
    status
)
VALUES
(?,?,?,?,?,?,?,?,?)`;
              await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                connection,
                query,
                qParams,
              );
            } else {
              let transferAmount = await module.exports.exchange({
                fromCurrency: result.currency,
                toCurrency: obj.currency_code,
                amount: result.amount,
              });
              const transactionId =
                "TXN" + Date.now() + Math.floor(Math.random() * 1000);
              qParams = [
                transactionId,
                result.username,
                "REVERSE_IN",
                obj.account_no,
                result.from_account,
                result.currency,
                result.amount,
                transferAmount,
                "SUCCESS",
              ];
              query = `INSERT INTO transactions (
    transaction_id,
    username,
    type,
    from_account,
    to_account,
    currency, 
    amount,
    converted_amount,
    status
)
VALUES
(?,?,?,?,?,?,?,?,?)`;
              await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
                connection,
                query,
                qParams,
              );
            }
          }
          qParams = [params.transaction_id];
          query = ` UPDATE transactions SET is_reversed = 1 WHERE transaction_id = ?`;
          await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
            connection,
            query,
            qParams,
          );
        } else {
          throw new Error(errorCodes.INVALID_TRANSFER_ACCOUNTS.message);
        }
      } else {
        throw new Error(errorCodes.INVALID_TRANSACTIONID.message);
      }
    } catch (error) {
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },

  updateProfile: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
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
      BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      BaseMySQLProvider.commitTransaction(connection);
    }
  },
};
