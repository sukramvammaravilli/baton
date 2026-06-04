// const pool = require('../dbConnection/connection');

// const {
//     validateAmount,
//     validateCurrency
// } = require('../utilities/validation');

// const deposit = async ({
//     accountNumber,
//     amount,
//     currency
// }) => {

//     validateAmount(amount);
//     validateCurrency(currency);

//     const [accounts] =
//         await pool.query(

//             `
//             SELECT *
//             FROM accounts
//             WHERE account_number=?
//             `,

//             [accountNumber]

//         );

//     if (accounts.length === 0) {

//         throw new Error(
//             'Account not found'
//         );
//     }

//     const account =
//         accounts[0];

//     if (
//         account.currency !== currency
//     ) {

//         throw new Error(
//             'Currency mismatch'
//         );
//     }

//     await pool.query(

//         `
//         UPDATE accounts
//         SET balance =
//         balance + ?
//         WHERE id=?
//         `,

//         [
//             amount,
//             account.id
//         ]

//     );

//     await pool.query(

//         `
//         INSERT INTO transactions
//         (
//             transaction_type,
//             to_account_id,
//             amount,
//             currency
//         )
//         VALUES
//         (
//             'DEPOSIT',
//             ?,?,?
//         )
//         `,

//         [
//             account.id,
//             amount,
//             currency
//         ]

//     );

//     return {

//         message:
//             'Deposit successful'

//     };
// };

// const transfer = async ({
//     fromAccount,
//     toAccount,
//     amount,
//     currency
// }) => {

//     validateAmount(amount);
//     validateCurrency(currency);

//     if (
//         fromAccount === toAccount
//     ) {

//         throw new Error(
//             'Cannot transfer to same account'
//         );
//     }

//     const connection =
//         await pool.getConnection();

//     try {

//         await connection.beginTransaction();

//         const [senderRows] =
//             await connection.query(

//                 `
//                 SELECT *
//                 FROM accounts
//                 WHERE account_number=?
//                 FOR UPDATE
//                 `,

//                 [fromAccount]

//             );

//         const [receiverRows] =
//             await connection.query(

//                 `
//                 SELECT *
//                 FROM accounts
//                 WHERE account_number=?
//                 FOR UPDATE
//                 `,

//                 [toAccount]

//             );

//         if (
//             senderRows.length === 0
//         ) {

//             throw new Error(
//                 'Sender account not found'
//             );
//         }

//         if (
//             receiverRows.length === 0
//         ) {

//             throw new Error(
//                 'Receiver account not found'
//             );
//         }

//         const sender =
//             senderRows[0];

//         const receiver =
//             receiverRows[0];

//         if (
//             sender.currency !==
//             receiver.currency
//         ) {

//             throw new Error(
//                 'Transfer allowed only within same currency'
//             );
//         }

//         if (
//             sender.currency !== currency
//         ) {

//             throw new Error(
//                 'Currency mismatch'
//             );
//         }

//         if (
//             Number(sender.balance)
//             <
//             Number(amount)
//         ) {

//             throw new Error(
//                 'Insufficient balance'
//             );
//         }

//         await connection.query(

//             `
//             UPDATE accounts
//             SET balance =
//             balance - ?
//             WHERE id=?
//             `,

//             [
//                 amount,
//                 sender.id
//             ]

//         );

//         await connection.query(

//             `
//             UPDATE accounts
//             SET balance =
//             balance + ?
//             WHERE id=?
//             `,

//             [
//                 amount,
//                 receiver.id
//             ]

//         );

//         await connection.query(

//             `
//             INSERT INTO transactions
//             (
//                 transaction_type,
//                 from_account_id,
//                 to_account_id,
//                 amount,
//                 currency
//             )
//             VALUES
//             (
//                 'TRANSFER',
//                 ?,?,?,?
//             )
//             `,

//             [
//                 sender.id,
//                 receiver.id,
//                 amount,
//                 currency
//             ]

//         );

//         await connection.commit();

//         return {

//             message:
//                 'Transfer successful'

//         };

//     } catch (error) {

//         await connection.rollback();

//         throw error;

//     } finally {

//         connection.release();
//     }
// };

// const reverseTransaction =
//     async (transactionId) => {

//         const connection =
//             await pool.getConnection();

//         try {

//             await connection.beginTransaction();

//             const [rows] =
//                 await connection.query(

//                     `
//                     SELECT *
//                     FROM transactions
//                     WHERE id=?
//                     `,

//                     [transactionId]

//                 );

//             if (
//                 rows.length === 0
//             ) {

//                 throw new Error(
//                     'Transaction not found'
//                 );
//             }

//             const tx =
//                 rows[0];

//             if (
//                 tx.transaction_type !==
//                 'TRANSFER'
//             ) {

//                 throw new Error(
//                     'Only transfers can be reversed'
//                 );
//             }

//             await connection.query(

//                 `
//                 UPDATE accounts
//                 SET balance =
//                 balance + ?
//                 WHERE id=?
//                 `,

//                 [
//                     tx.amount,
//                     tx.from_account_id
//                 ]

//             );

//             await connection.query(

//                 `
//                 UPDATE accounts
//                 SET balance =
//                 balance - ?
//                 WHERE id=?
//                 `,

//                 [
//                     tx.amount,
//                     tx.to_account_id
//                 ]

//             );

//             await connection.query(

//                 `
//                 INSERT INTO transactions
//                 (
//                     transaction_type,
//                     from_account_id,
//                     to_account_id,
//                     amount,
//                     currency,
//                     reversal_of_transaction_id
//                 )
//                 VALUES
//                 (
//                     'REVERSAL',
//                     ?,?,?,?,?
//                 )
//                 `,

//                 [
//                     tx.to_account_id,
//                     tx.from_account_id,
//                     tx.amount,
//                     tx.currency,
//                     tx.id
//                 ]

//             );

//             await connection.commit();

//             return {

//                 message:
//                     'Reversal successful'

//             };

//         } catch (error) {

//             await connection.rollback();

//             throw error;

//         } finally {

//             connection.release();
//         }
//     };

// const getTransactions =
//     async (userId) => {

//         const [rows] =
//             await pool.query(

//                 `
//                 SELECT t.*
//                 FROM transactions t
//                 JOIN accounts a
//                 ON
//                 (
//                     t.from_account_id = a.id
//                     OR
//                     t.to_account_id = a.id
//                 )
//                 WHERE a.user_id=?
//                 ORDER BY t.id DESC
//                 `,

//                 [userId]

//             );

//         return rows;
//     };

// module.exports = {

//     deposit,
//     transfer,
//     reverseTransaction,
//     getTransactions

// };


// import mysql  from 'mysql2';
// // import ErrorCode from "appConfig/errorCode.js";
// import fs from 'fs'
// var pool;

// export default class BaseMySqlProvider {

//   static getPool(){
//     if (pool) return pool;
//     let databaseConfig = {
//         host: process.env.MYSQL_DB_HOST,
//         port: process.env.MYSQL_DB_PORT,
//         user: process.env["SQL_CREDS.DB_USERNAME"],
//         password: process.env["SQL_CREDS.DB_PASSWORD"],
//         database: process.env.MYSQL_DB_NAME,
//         multipleStatements:process.env.MULTIPLESTATEMENTS,
//         supportBigNumbers: true,
//         bigNumberStrings: true
//       }
//     if (process.env['RDS_ENCRYPTION'] && process.env['RDS_ENCRYPTION'] === 'true') {
//       databaseConfig.ssl = {
//         // ca: fs.readFileSync(process.env['RDS_ENCRYPTION_KEY'])
//         rejectUnauthorized: false
//       }
//     }
//     pool = mysql.createPool(databaseConfig);
//     return pool;
//  }
 
//   static executeConnectionPromisedQuery(connection,query,params){
//     appLogger.info(null," BaseMySqlProvider/executeConnectionPromisedQuery",params);
//     return new Promise((resolve, reject) => {
//       try {
//         this.getPool().query(query, params, (err_query, result) => { 
//           return resolve(this.handleQueryResponse(err_query, result));
//         });
//       } catch (err) {
//         appLogger.error(null, null,`BaseMySqlProvider/executeConnectionPromisedQuery - , error: `, err);
//         return reject(err);
//       }
//     });
//   }

//   static executePromisedQueryFilterOkPacket(connection,query,params){
//     appLogger.info(null," BaseMySqlProvider/executePromisedQueryFilterOkPacket");
//     if (!connection) {
//       appLogger.info(null,"connection not present");
//       return new Promise((resolve, reject) => {
//         try {
//           if (process.env.NODE_ENV !== "production") {
//             appLogger.info(null,
//               `BaseMySQLProvider.executePromisedQueryFilterOkPacket (${query}) start`
//             );
//           }
//           this.getPool().query(query, params, (err_query, result) => {
//             return resolve(this.handleQueryResponse(err_query, result));
//           });
//         } catch (err) {
//           appLogger.error(null, null, `BaseMySqlProvider/executePromisedQueryFilterOkPacket - , error: `, err);
//           return reject(err);
//         }
//       });
//     } else {
//       appLogger.info(null,"connection present");
//       return BaseMySqlProvider.executeConnectionPromisedQuery(
//         connection,
//         query,
//         params
//       );
//     }
//   }

//   static getPoolConnectionTransaction() {
//     appLogger.info(null,`BaseMySqlProvider/getPoolConnectionTransaction`);
//     return new Promise((resolve, reject) => {
//       try {
//         this.getPool().getConnection((err, connection) => {
//           if (err) {
//             appLogger.error(null, null, `BaseMySqlProvider/getPoolConnectionTransaction - , error: `, err);
//             return reject(err);
//           } else {
//             connection.beginTransaction(err => {
//               if (err) {
//                 return reject(err);
//               } else {
//                 return resolve(connection);
//               }
//             });
//           }
//         });
//       } catch (error) {
//         appLogger.error(null, null, `BaseMySqlProvider/getPoolConnectionTransaction - , error: `, error);
//         return reject(error);
//       }
//     });
//   }

//   static commitTransaction(connection){
//     return new Promise((resolve, reject) => {
//       try {
//         appLogger.info(null,`BaseMySqlProvider.commitTransaction start`);
//         connection.commit(err => {
//           if (err) {
//             return reject(err);
//           } else {
//             connection.release();
//             appLogger.info(null,"connection released")
//             return resolve(true);
//           }
//         });
//       } catch (err) {
//         appLogger.error(null, null, `BaseMySqlProvider/commitTransaction - , error: `, err);
//         return reject(err);
//       }
//     });
//   }

//   static rollbackTransaction(connection){
//     return new Promise((resolve, reject) => {
//       try {
//         appLogger.info(null,`BaseMySqlProvider.rollbackTransaction start`);
//         if (connection) {
//           connection.rollback(() => {
//             appLogger.error(null, null, `BaseMySqlProvider/rollbackTransaction - , error: rollback`);
//             connection.release();
//             appLogger.info(null,"connection released")
//             return resolve(true);
//           });
//         } else {
//           return reject(ErrorCode.GENERAL_ERROR);
//         }
//       } catch (err) {
//         appLogger.error(null, null, `BaseMySqlProvider/rollbackTransaction - , error: `, err);
//         return reject(err);
//       }
//     });
//   }

//   static handleQueryResponse(err_query, result){
//     appLogger.info(null,`BaseMySqlProvider/handleQueryResponse`);
//     if (err_query) {
//       appLogger.error(null, null,`BaseMySqlProvider/handleQueryResponse - , error: `, err_query);
//       return Promise.reject(err_query);
//     } else {
//       let results = result;
//       if (result.length > 1) {
//         results = result.filter(res => {
//           if (res.hasOwnProperty("affectedRows") == false) return res;
//         });
//       }
//       return results;
//     }
//   }
// }