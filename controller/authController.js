const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userValidation = require("../utilities/userValidation");
const authServices = require("../services/authServices");

module.exports = {
  login: async (req, res) => {
    try {
      let params = {
        username: req.body.username,
        password: req.body.password,
        session_time: process.env.SESSION_TIME
      };
      let users = await authServices.login(params);
      if (users.length === 0) {
        return res.status(401).json({
          error: "User does not exists",
        });
      }
      const user = users[0];
      const isMatch = await bcrypt.compare(params.password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }
      const token = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: params.session_time
        },
      );
      await authServices.insertSession(params,token);
      res.status(200).json({
        fullname: user.fullname,
        username: user.username,
        token,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
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
      let validation = await userValidation.validateUser(params);
      if (validation) {
        params.password = await bcrypt.hash(params.password, 10);
        await authServices.register(params);
        return res.status(200).json({
          message: "User Regitered Successfully",
        });
      }
    } catch (error) {
      if(error.message) {
        res.status(400).json({
          message: error.message
        })
      } else {
      res.status(500).json({
        error: error.message,
      });
    }
    }
  },

  getCountries: async (req, res) => {
    try {
      return res.status(200).json(await authServices.getCountries());
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        await authServices.logout(token);
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Logout failed"
        });
    }
}
};
