const dashboardService = require("../services/services");
const userValidation = require("../utilities/userValidation");
const errorCodes = require("../config/errorCode");

module.exports = {
  dashboard: async (req, res) => {
    try {
      const username = req.user.username;
      if (!username) {
        return res.status(errorCodes.MISSING_USERNAME.status).json({
          error: errorCodes.MISSING_USERNAME.message,
        });
      }
      let result = await dashboardService.dashboard(username);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const username = req.user.username;
      if (!username) {
        return res.status(errorCodes.MISSING_USERNAME.status).json({
          error: errorCodes.MISSING_USERNAME.message,
        });
      }
      let result = await dashboardService.getProfile(username);
      return res.status(200).json(result[0]);
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  getCurrencies: async (req, res) => {
    try {
      let result = await dashboardService.getCurrencies();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  exchange: async (req, res) => {
    try {
      const params = {
        fromCurrency: req.body.from.split(",")[0],
        toCurrency: req.body.to.split(",")[0],
        amount: req.body.amount,
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (param === "amount" && params[param] < 0) {
          return res.status(errorCodes.INVALID_AMOUNT_EXCHANGE.status).json({
            error: errorCodes.INVALID_AMOUNT_EXCHANGE.message,
          });
        }
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      const result = await dashboardService.exchange(params);
      return res.status(200).json({
        convertedAmount: result,
      });
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const params = {
        username: req.user.username,
        email: req.body.email,
        currency_code: req.body.currencyCode,
        mobile: req.body.mobile,
        identityNumber: req.body.identityNumber,
        fullname: req.body.fullname,
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      let validation = await userValidation.validateUser(params);
      if (validation) {
        await dashboardService.updateProfile(params);
        return res.status(200).json("Profile Updated Successfully");
      }
    } catch (error) {
      if (error.message) {
        return res.status(400).json({
          error: error.message,
        });
      } else {
        return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
          error: errorCodes.INTERNAL_SERVER_ERROR.message,
        });
      }
    }
  },

  addAccount: async (req, res) => {
    try {
      const username = req.user.username;
      const accountNumber = req.body.accountNo;
      if (!username) {
        return res.status(errorCodes.MISSING_USERNAME.status).json({
          error: errorCodes.MISSING_USERNAME.message,
        });
      }
      if (!accountNumber) {
        return res.status(errorCodes.MISSING_ACCOUNT.status).json({
          error: errorCodes.MISSING_ACCOUNT.message,
        });
      }
      await dashboardService.addAccount(username, accountNumber);
      return res.status(200).json("Account added successfully");
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  removeAccount: async (req, res) => {
    try {
      const username = req.user.username;
      const accountNumber = req.body.account;
      if (!username) {
        return res.status(errorCodes.MISSING_USERNAME.status).json({
          error: errorCodes.MISSING_USERNAME.message,
        });
      }
      if (!accountNumber) {
        return res.status(errorCodes.MISSING_ACCOUNT.status).json({
          error: errorCodes.MISSING_ACCOUNT.message,
        });
      }
      await dashboardService.removeAccount(username, accountNumber);
      return res.status(200).json("Removed account successfully");
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  deposit: async (req, res) => {
    try {
      const params = {
        username: req.user.username,
        accountNo: req.body.accountNo,
        amount: req.body.amount,
        currency: req.body.currency.split(",")[0],
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (param === "amount" && params[param] < 0) {
          return res.status(errorCodes.INVALID_AMOUNT_DEPOSIT.status).json({
            error: errorCodes.INVALID_AMOUNT_DEPOSIT.message,
          });
        }
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      const result = await dashboardService.deposit(params);
      return res.status(200).json("Deposit Success");
    } catch (error) {
      if(error.message){
        return res.status(errorCodes.ACCOUNT_NOT_ACTIVE.status).json({
          error: error.message
        })
      } else {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
    }
  },

  transfer: async (req, res) => {
    try {
      const params = {
        username: req.user.username,
        fromAccount: req.body.fromAccount,
        toAccount: req.body.toAccount,
        amount: req.body.amount,
        currency: req.body.currency.split(",")[0],
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (param === "amount" && params[param] < 0) {
          return res.status(errorCodes.INVALID_AMOUNT_TRANSFER.status).json({
            error: errorCodes.INVALID_AMOUNT_TRANSFER.message,
          });
        }
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      const result = await dashboardService.transfer(params);
      return res.status(200).json("Transfer Success");
    } catch (error) {
      if(error.message){
        return res.status(errorCodes.ACCOUNT_NOT_ACTIVE.status).json({
          error: error.message
        })
      } else {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  }
  },

  getTransactions: async (req, res) => {
    try {
      const params = {
        username: req.user.username,
        account: req.query.accountNo,
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      let result = await dashboardService.getTransactions(params);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  reverseTransaction: async (req, res) => {
    try {
      const params = {
        username: req.user.username,
        transaction_id: req.body.transactionId,
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      await dashboardService.reverseTransaction(params);
      return res.status(200).json("Transaction reversed");
    } catch (error) {
      if(error.message){
        return res.status(errorCodes.ACCOUNT_NOT_ACTIVE.status).json({
          error: error.message
        })
      } else {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
    }
  },
};
