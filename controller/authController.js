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
      };

      const [users] = await pool.query(
        `
                    SELECT *
                    FROM users
                    WHERE username=?
                    `,

        [username],
      );

      if (users.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const user = users[0];

      const isMatch = await bcrypt.compare(
        password,

        user.password,
      );

      if (!isMatch) {
        return res.status(401).json({
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        {
          userId: user.id,

          username: user.username,
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "1h",
        },
      );

      res.json({
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
      if (error.message) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: error.message,
        });
      }
    }
  },
};
