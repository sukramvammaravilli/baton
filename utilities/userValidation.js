const errorCodes = require("../config/errorCode");

module.exports = {
  validateUser: async (params) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    const identitynumberRegex = /^[a-zA-Z0-9_]{3,50}$/;

    const fullNameRegex = /^[A-Za-z ]{3,50}$/;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    const mobileRegex = /^\+[1-9]\d{1,14}$/;

    if (params.username && !usernameRegex.test(params.username))
      throw new Error(errorCodes.INVALID_USERNAME.message);

    if (params.fullname && !fullNameRegex.test(params.fullname))
      throw new Error(errorCodes.INVALID_FULLNAME.message);

    if (params.email && !emailRegex.test(params.email))
      throw new Error(errorCodes.INVALID_EMAIL.message);

    if (params.password && !passwordRegex.test(params.password))
      throw new Error(errorCodes.INVALID_PASSWORD.message);

    if (params.mobile && !mobileRegex.test(params.mobile))
      throw new Error(errorCodes.INVALID_MOBILE.message);

    if (
      params.identityNumber &&
      !identitynumberRegex.test(params.identityNumber)
    )
      throw new Error(errorCodes.INVALID_IDENTITY_NUMBER.message);
    return true;
  },
};
