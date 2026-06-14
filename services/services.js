const BaseMySQLProvider = require("../dbConnection/connection");
const errorCodes = require("../config/errorCode");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

module.exports = {
  dashboard: async (username) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username, "ACTIVE"];
      let query = ` SELECT * FROM accounts WHERE username = ? AND status = ?`;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  addAccount: async (username, account, currency) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username, account];
      let query = ` SELECT * FROM accounts WHERE username = ? AND account_no = ?`;
      let response = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (response.length) {
        throw new Error(errorCodes.DUPLICATE_ACCOUNT.message);
      }
      let currencies = await module.exports.getCurrencies();
      currencies = currencies.find((ele) => ele.currency_code === currency);
      if (!currencies) {
        throw new Error(errorCodes.INVALID_CURRENCY.message);
      }
      qParams = [username, account, 0.0, 0.0, 0.0, "ACTIVE", currency];
      query = ` INSERT INTO accounts (username,account_no,total_balance,total_deposit,total_transfer,status,currency_code) VALUES (?,?,?,?,?,?,?)`;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  removeAccount: async (username, account) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [username, account];
      let query = ` SELECT * FROM accounts WHERE username = ? AND account_no = ?`;
      let response = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (!response.length) {
        throw new Error(errorCodes.ACCOUNT_NOT_EXIST.message);
      }
      qParams = ["INACTIVE", username, account];
      query = ` UPDATE accounts SET status = ? WHERE username = ? AND account_no = ? AND status = 'ACTIVE'`;
      return await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
    } catch (error) {
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
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
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
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
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  exchange: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      if (params.fromCurrency === params.toCurrency) {
        return params.amount;
      } else {
        const qParams = [
          params.fromCurrency,
          params.toCurrency,
          params.fromCurrency,
          params.toCurrency,
        ];
        let query = ` SELECT * FROM currency WHERE currency_code IN (?, ?) AND (SELECT COUNT(*) FROM currency WHERE currency_code IN (?, ?)) = 2`;
        let values = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        if (!values.length || values.length !== 2) {
          throw new Error(errorCodes.INVALID_EXCHANGE_CURRENCY.message);
        }
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
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  deposit: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.username, params.accountNo, "ACTIVE"];
      let query = ` SELECT * FROM accounts WHERE username = ? AND account_no = ? AND status = ? `;
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
        const transactionId = uuidv4();
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
        query = `INSERT INTO transactions ( transaction_id, username, type, from_account, to_account, currency, amount, converted_amount) VALUES (?,?,?,?,?,?,?,?)`;
        let final = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
        if (final.affectedRows === 1) {
          qParams = ["SUCCESS", transactionId];
          query = ` UPDATE transactions SET status = ? WHERE transaction_id = ? `;
          await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
            connection,
            query,
            qParams,
          );
        }
        await BaseMySQLProvider.commitTransaction(connection);
        return true;
      } else {
        throw new Error(errorCodes.ACCOUNT_NOT_ACTIVE.message);
      }
    } catch (error) {
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
    }
  },

  getTransactions: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.username, params.account];
      let query = ` SELECT * FROM accounts WHERE username = ? AND account_no = ?`;
      let response = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (!response.length) {
        throw new Error(errorCodes.ACCOUNT_NOT_EXIST.message);
      }
      qParams = [
        params.account,
        params.account,
        params.account,
        params.account,
        params.account,
        params.account,
      ];
      query = ` SELECT * FROM transactions 
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
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  transfer: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.fromAccount, params.username, "ACTIVE"];
      let query = ` SELECT * FROM accounts WHERE account_no = ? AND username = ? AND status = ? FOR UPDATE `;
      let sender = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (!sender.length) {
        throw new Error(errorCodes.INVALID_TRANSFER_ACCOUNTS.message);
      }
      qParams = [params.toAccount, "ACTIVE"];
      query = ` SELECT * FROM accounts WHERE account_no = ? AND status = ? FOR UPDATE `;
      let receiver = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (!receiver.length) {
        throw new Error(errorCodes.INVALID_TRANSFER_ACCOUNTS.message);
      }
      sender = sender[0];
      receiver = receiver[0];
      if ((sender.currency_code !== receiver.currency_code) || (sender.currency_code !== params.currency && receiver.currency_code !== params.currency )) {
        throw new Error(errorCodes.INVALID_TRANSFER_TRANSACTION.message);
      }
      if (Number(sender.total_balance) < Number(params.amount)) {
        throw new Error(errorCodes.INSUFFICIENT_BALANCE.message);
      }
      qParams = [
        params.amount,
        params.amount,
        sender.account_no,
        params.amount,
      ];
      query = ` UPDATE accounts SET total_balance = total_balance - ?, total_transfer = total_transfer + ? WHERE account_no = ? AND total_balance >= ?`;
      const debit = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (debit.affectedRows !== 1) {
        throw new Error(errorCodes.TRANSFER_FAILED.message);
      }
      qParams = [params.amount, params.amount, receiver.account_no];
      query = `UPDATE accounts SET total_balance = total_balance + ?, total_deposit = total_deposit + ? WHERE account_no = ? `;
      const credit = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (credit.affectedRows !== 1) {
        throw new Error(errorCodes.TRANSFER_FAILED.message);
      }
      const outTxn = uuidv4();
      qParams = [
        outTxn,
        params.username,
        "TRANSFER_OUT",
        sender.account_no,
        receiver.account_no,
        params.currency,
        params.amount,
        params.amount,
        "SUCCESS",
      ];

      query = `
      INSERT INTO transactions
      (
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
      (?,?,?,?,?,?,?,?,?)
    `;
      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      const inTxn = uuidv4();
      qParams = [
        inTxn,
        receiver.username,
        "TRANSFER_IN",
        sender.account_no,
        receiver.account_no,
        params.currency,
        params.amount,
        params.amount,
        "SUCCESS",
      ];

      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );

      await BaseMySQLProvider.commitTransaction(connection);

      return true;
    } catch (error) {
      if (connection) {
        await BaseMySQLProvider.rollbackTransaction(connection);
      }

      throw error;
    }
  },

  reverseTransaction: async (params) => {
    let connection;

    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let qParams = [params.transaction_id, params.username, "TRANSFER_OUT"];
      let query = ` SELECT * FROM transactions WHERE transaction_id = ? AND username = ? AND type = ? FOR UPDATE `;
      let transaction =
        await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          connection,
          query,
          qParams,
        );
      if (!transaction.length) {
        throw new Error(errorCodes.INVALID_TRANSACTIONID.message);
      }
      transaction = transaction[0];
      if (transaction.is_reversed) {
        throw new Error(errorCodes.INVALID_REVERSAL.message);
      }
      qParams = [transaction.from_account, transaction.to_account, "ACTIVE"];
      query = ` SELECT * FROM accounts WHERE account_no IN (?,?) AND status = ? FOR UPDATE `;
      let accounts = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (accounts.length !== 2) {
        throw new Error(errorCodes.INVALID_TRANSFER_ACCOUNTS.message);
      }
      let sender = accounts.find(
        (x) => x.account_no === transaction.from_account,
      );
      let receiver = accounts.find(
        (x) => x.account_no === transaction.to_account,
      );
      if (Number(receiver.total_balance) < Number(transaction.amount)) {
        throw new Error(errorCodes.INSUFFICIENT_BALANCE.message);
      }
      qParams = [
        transaction.amount,
        transaction.amount,
        receiver.account_no,
        transaction.amount,
      ];
      query = ` UPDATE accounts SET total_balance = total_balance - ?, total_deposit = total_deposit - ? WHERE account_no = ? AND total_balance >= ?`;
      let result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (result.affectedRows !== 1) {
        throw new Error(errorCodes.TRANSFER_FAILED.message);
      }
      qParams = [transaction.amount, transaction.amount, sender.account_no];
      query = ` UPDATE accounts SET total_balance = total_balance + ?, total_transfer = total_transfer - ? WHERE account_no = ?`;
      result = await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );
      if (result.affectedRows !== 1) {
        throw new Error(errorCodes.TRANSFER_FAILED.message);
      }
      const reverseOutTxn = uuidv4();

      qParams = [
        reverseOutTxn,
        params.username,
        "REVERSE_OUT",
        transaction.to_account,
        transaction.from_account,
        transaction.currency,
        transaction.amount,
        transaction.amount,
        "SUCCESS",
        transaction.transaction_id,
      ];

      query = `
      INSERT INTO transactions
      (
        transaction_id,
        username,
        type,
        from_account,
        to_account,
        currency,
        amount,
        converted_amount,
        status,
        reversal_of_transaction_id
      )
      VALUES
      (?,?,?,?,?,?,?,?,?,?)
    `;

      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );

      const reverseInTxn = uuidv4();

      qParams = [
        reverseInTxn,
        params.username,
        "REVERSE_IN",
        transaction.to_account,
        transaction.from_account,
        transaction.currency,
        transaction.amount,
        transaction.amount,
        "SUCCESS",
        transaction.transaction_id,
      ];

      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );

      qParams = [reverseOutTxn, transaction.transaction_id];

      query = ` UPDATE transactions SET is_reversed = 1, reversal_of_transaction_id = ? WHERE transaction_id = ?`;

      await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
        connection,
        query,
        qParams,
      );

      await BaseMySQLProvider.commitTransaction(connection);

      return true;
    } catch (error) {
      if (connection) {
        await BaseMySQLProvider.rollbackTransaction(connection);
      }

      throw error;
    }
  },

  updateProfile: async (params) => {
    let connection;
    try {
      connection = await BaseMySQLProvider.getPoolConnectionTransaction();
      let profile = await module.exports.getProfile(params.username);
      if (!profile.length) {
        throw new Error(errorCodes.MISSING_PROFILE_DETAILS.message);
      }
      profile = profile[0];
      if (
        params.email === profile.email ||
        params.mobile === profile.mobile_number ||
        params.identityNumber === profile.identity_number ||
        params.fullname === profile.fullname
      ) {
        throw new Error(errorCodes.DUPLICATE_PROFILE_DETAILS.message);
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
      await BaseMySQLProvider.rollbackTransaction(connection);
      throw error;
    } finally {
      await BaseMySQLProvider.commitTransaction(connection);
    }
  },

  updateExchangeRates: async () => {
    try {
      const EXCHANGE_URL = "https://open.er-api.com/v6/latest/USD";
      const response = await axios.get(EXCHANGE_URL);
      const rates = response.data.rates;
      if (!rates) {
        throw new Error("Unable to fetch exchange rates");
      }
      for (const currency in rates) {
        const qParams = [rates[currency], currency];
        const query = ` UPDATE currency SET exchange_rate = ? WHERE currency_code = ? `;
        await BaseMySQLProvider.executePromisedQueryFilterOkPacket(
          null,
          query,
          qParams,
        );
      }
      console.log("Exchange rates updated successfully");
    } catch (error) {
      console.error("Exchange Rate Update Failed: ", error.message);
    }
  },
};
