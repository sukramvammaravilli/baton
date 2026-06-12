const HTTP_CODES = {
  SUCCESS: 200,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORISED: 401,
  NOT_FOUND: 404,
  RESOURCE_MOVED: 410,
  TEMPORARAY_DOWN: 503,
  TIME_OUT: 504,
  NO_ACCESS: 403,
  CONFLICT: 409,
};

module.exports = {
  MISSING_USERNAME: {
    code: "1001",
    message: "Invalid request, Missing username",
    status: HTTP_CODES.BAD_REQUEST,
  },

  MISSING_PASSWORD: {
    code: "1002",
    message: "Invalid request, Missing password",
    status: HTTP_CODES.BAD_REQUEST,
  },

  MISSING_SESSION: {
    code: "1003",
    message: "Invalid request, Missing session time",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_USERNAME: {
    code: "1004",
    message: "Invalid request, Invalid username",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_PASSWORD: {
    code: "1005",
    message: "Invalid request, Invalid password",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_FULLNAME: {
    code: "1006",
    message: "Invalid request, Invalid username",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_EMAIL: {
    code: "1007",
    message: "Invalid request, Invalid password",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_MOBILE: {
    code: "1008",
    message: "Invalid request, Missing parameter",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_IDENTITY_NUMBER: {
    code: "1009",
    message: "Invalid request, Missing parameter",
    status: HTTP_CODES.BAD_REQUEST,
  },

  USER_DOES_NOT_EXIST: {
    code: "1010",
    message: "Invalid request, User Does Not Exist",
    status: HTTP_CODES.UNAUTHORISED,
  },

  INVALID_CREDENTIALS: {
    code: "1011",
    message: "Invalid request, Invalid Credentials",
    status: HTTP_CODES.UNAUTHORISED,
  },

  INTERNAL_SERVER_ERROR: {
    code: "1012",
    message: "Internal Server error may be db connection or code issue",
    status: HTTP_CODES.INTERNAL_SERVER_ERROR,
  },

  MISSING_PARAMETER: {
    code: "1013",
    message: "Invalid request, Missing Parameter ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  MISSING_TOKEN: {
    code: "1014",
    message: "Invalid request, Missing Token ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_AMOUNT_EXCHANGE: {
    code: "1015",
    message: "Invalid request, Invalid exchange amount entered ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_AMOUNT_DEPOSIT: {
    code: "1016",
    message: "Invalid request, Invalid deposit amount entered ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_AMOUNT_TRANSFER: {
    code: "1017",
    message: "Invalid request, Invalid transfer amount entered ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  MISSING_ACCOUNT: {
    code: "1018",
    message: "Invalid request, Missing Account ",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_TOKEN: {
    code: "1019",
    message: "Invalid request, Invalid Token ",
    status: HTTP_CODES.UNAUTHORISED,
  },

  SESSION_EXPIRED: {
    code: "1020",
    message: "Session Expired or Timeout ",
    status: HTTP_CODES.UNAUTHORISED,
  },

  LOGGED_OUT_ALREADY: {
    code: "1021",
    message: "User Logged out already ",
    status: HTTP_CODES.UNAUTHORISED,
  },

  SESSION_NOT_FOUND: {
    code: "1022",
    message: "Session Not found ",
    status: HTTP_CODES.UNAUTHORISED,
  },

  ACCOUNT_NOT_ACTIVE: {
    code: "1023",
    message: "Invalid Request, Account is not active",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_TRANSFER_ACCOUNTS: {
    code: "1024",
    message:
      "Invalid Request, Invalid transfer accounts selected either of them are inactive",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INSUFFICIENT_BALANCE: {
    code: "1025",
    message: "Invalid Request, Insufficient Balance",
    status: HTTP_CODES.BAD_REQUEST,
  },

  TRANSFER_FAILED: {
    code: "1026",
    message: "Invalid Request, Either Credit or Debit failed",
    status: HTTP_CODES.BAD_REQUEST,
  },

  INVALID_TRANSACTIONID: {
    code: "1027",
    message: "Invalid Request, Invalid transaction id",
    status: HTTP_CODES.BAD_REQUEST,
  }
};
