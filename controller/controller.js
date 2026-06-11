const dashboardService = require("../services/services");
const userValidation = require("../utilities/userValidation");

module.exports = {
  dashboard: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const username = req.query.username;
      let result = await dashboardService.dashboard(username);
      res.status(200).json(result);
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  getProfile: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const username = req.query.username;
      let result = await dashboardService.getProfile(username);
      res.status(200).json(result[0]);
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  getCurrencies: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      let result = await dashboardService.getCurrencies();
      res.status(200).json(result);
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  exchange: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const params = {
        fromCurrency: req.body.from.split(",")[0],
        toCurrency: req.body.to.split(",")[0],
        amount: req.body.amount,
      };
      const result = await dashboardService.exchange(params);
      res.status(200).json({
        convertedAmount: result,
      });
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  updateProfile: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const params = {
        username: req.body.username,
        email: req.body.email,
        currency_code: req.body.currencyCode,
        mobile: req.body.mobile,
        identityNumber: req.body.identityNumber,
        fullname: req.body.fullname,
      };
      let validation = await userValidation.validateUser(params);
      if (validation) {
        await dashboardService.updateProfile(params);
        return res.status(200).json({
          message: "Profile Updated Successfully",
        });
      }
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  addAccount: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const username = req.body.username;
      const accountNumber = req.body.accountNo;
      await dashboardService.addAccount(username, accountNumber);
      res.status(200).json("Account added successfully");
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  removeAccount: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const username = req.body.username;
      const accountNumber = req.body.account;
      await dashboardService.removeAccount(username, accountNumber);
      res.status(200).json("Removed account successfully");
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  deposit: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const params = {
        username: req.body.username,
        accountNo: req.body.accountNo,
        amount: req.body.amount,
        currency: req.body.currency.split(",")[0],
      };
      const result = await dashboardService.deposit(params);
      res.status(200).json("Deposit Success");
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  transfer: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/transfer - Start');
      const params = {
        username: req.body.username,
        fromAccount: req.body.fromAccount,
        toAccount: req.body.toAccount,
        amount: req.body.amount,
        currency: req.body.currency.split(",")[0],
      };
      const result = await dashboardService.transfer(params);
      res.status(200).json("Transfer Success");
    } catch (error) {
      // appLogger.error('dashboardController/transfer - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/transfer - End');
    }
  },

  getTransactions: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const params = {
        username: req.query.username,
        account: req.query.accountNo,
      };
      let result = await dashboardService.getTransactions(params);
      res.status(200).json(result);
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  },

  reverseTransaction: async (req, res) => {
    try {
      // appLogger.debug('dashboardController/deposit - Start');
      const params = {
        username: req.body.username,
        transaction_id: req.body.transactionId,
      };
      await dashboardService.reverseTransaction(params);
      res.status(200).json("Transaction reversed");
    } catch (error) {
      // appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      // appLogger.info('dashboardController/deposit - End');
    }
  }
};
