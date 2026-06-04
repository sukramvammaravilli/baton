const dashboardService = require('../services/services');
module.exports = {

  deposit : async (req, res) => {
    try {
      appLogger.debug('dashboardController/deposit - Start');
      const params = {accountNumber, amount, currency
      };
      const result = await dashboardService.deposit(params);
      if (result) {
        res.done(null, successCodes.successDesc.NOTIFICATION_PUSHED);
      }
    } catch (error) {
      appLogger.error('dashboardController/deposit - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      appLogger.info('dashboardController/deposit - End');
    }
  },

  transfer: async (req, res) => {
    try {
      appLogger.debug('dashboardController/transfer - Start');
      const params = {fromAccount,toAccount, amount, currency
      };
      const result = await dashboardService.transfer(params);
      if (result) {
        res.done(null, successCodes.successDesc.NOTIFICATION_PUSHED);
      }
    } catch (error) {
      appLogger.error('dashboardController/transfer - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      appLogger.info('dashboardController/transfer - End');
    }
  },

  getTransactions: async (req, res) => {
    try {
      appLogger.debug('dashboardController/getTransactions - Start');
      const result = await dashboardService.getTransactions(params);
      if (result) {
        res.done(null, successCodes.successDesc.NOTIFICATION_PUSHED);
      }
    } catch (error) {
      appLogger.error('dashboardController/getTransactions - error - ', error);
      if (error && error.code) {
        res.error(null, error);
      } else {
        res.error(null, errorCodes.errorDesc.NOTIFICATION_CONTROLLER_ERROR);
      }
    } finally {
      appLogger.info('dashboardController/getTransactions - End');
    }
  }

}





// const walletService =
//     require('../services/walletService');

// const deposit =
//     async (req, res) => {

//         try {

//             const result =
//                 await walletService
//                 .deposit(

//                     req.body

//                 );

//             res.json(result);

//         } catch (error) {

//             res.status(400)
//             .json({

//                 error:
//                     error.message

//             });
//         }
//     };

// const transfer =
//     async (req, res) => {

//         try {

//             const result =
//                 await walletService
//                 .transfer(

//                     req.body

//                 );

//             res.json(result);

//         } catch (error) {

//             res.status(400)
//             .json({

//                 error:
//                     error.message

//             });
//         }
//     };

// const getTransactions =
//     async (req, res) => {

//         try {

//             const data =
//                 await walletService
//                 .getTransactions(

//                     req.user.userId

//                 );

//             res.json(data);

//         } catch (error) {

//             res.status(500)
//             .json({

//                 error:
//                     error.message

//             });
//         }
//     };

// const reverseTransaction =
//     async (req, res) => {

//         try {

//             const result =
//                 await walletService
//                 .reverseTransaction(

//                     req.params.id

//                 );

//             res.json(result);

//         } catch (error) {

//             res.status(400)
//             .json({

//                 error:
//                     error.message

//             });
//         }
//     };

// module.exports = {

//     deposit,
//     transfer,
//     getTransactions,
//     reverseTransaction

// };