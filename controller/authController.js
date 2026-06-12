const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorCodes = require("../config/errorCode");
const userValidation = require("../utilities/userValidation");
const authServices = require("../services/authServices");

module.exports = {
  login: async (req, res) => {
    try {
      let params = {
        username: req.body.username,
        password: req.body.password,
        session_time: process.env.SESSION_TIME,
      };
      let paramsValidation = Object.keys(params);
      for (let param of paramsValidation) {
        if (!params[param]) {
          return res.status(errorCodes.MISSING_PARAMETER.status).json({
            error: errorCodes.MISSING_PARAMETER.message + "" + param,
          });
        }
      }
      let users = await authServices.login(params);
      if (users.length === 0) {
        return res.status(errorCodes.USER_DOES_NOT_EXIST.status).json({
          error: errorCodes.USER_DOES_NOT_EXIST.message,
        });
      }
      const user = users[0];
      const isMatch = await bcrypt.compare(params.password, user.password);
      if (!isMatch) {
        return res.status(errorCodes.INVALID_CREDENTIALS.status).json({
          error: errorCodes.INVALID_CREDENTIALS.message,
        });
      }
      const token = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: params.session_time,
        },
      );
      await authServices.insertSession(params, token);
      return res.status(200).json({
        fullname: user.fullname,
        username: user.username,
        token,
      });
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  register: async (req, res) => {
    try {
      let params = {
        username: req.body.username,
        password: req.body.password,
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
        params.password = await bcrypt.hash(params.password, 10);
        await authServices.register(params);
        return res.status(200).json({
          message: "User Regitered Successfully",
        });
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

  getCountries: async (req, res) => {
    try {
      return res.status(200).json(await authServices.getCountries());
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(errorCodes.MISSING_TOKEN.status).json({
          error: errorCodes.MISSING_TOKEN.message,
        });
      }
      await authServices.logout(token);
      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(errorCodes.INTERNAL_SERVER_ERROR.status).json({
        error: errorCodes.INTERNAL_SERVER_ERROR.message,
      });
    }
  },
};
