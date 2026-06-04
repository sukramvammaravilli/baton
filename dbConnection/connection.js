// require('dotenv').config();

// const mysql =
//     require('mysql2/promise');

// const pool =
//     mysql.createPool({

//         host:
//             process.env.DB_HOST,

//         user:
//             process.env.DB_USER,

//         password:
//             process.env.DB_PASSWORD,

//         database:
//             process.env.DB_NAME,

//         waitForConnections: true,

//         connectionLimit: 10
//     });

// module.exports = pool;



import mysql  from 'mysql2';
// import ErrorCode from "appConfig/errorCode.js";
var pool;

export default class BaseMySqlProvider {

  static getPool(){
    if (pool) return pool;
    let databaseConfig = {
        host: process.env.DB_HOST,
        port: process.env.PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        supportBigNumbers: true,
        bigNumberStrings: true
      }
    pool = mysql.createPool(databaseConfig);
    return pool;
 }
 
  static executeConnectionPromisedQuery(connection,query,params){
    appLogger.info(null," BaseMySqlProvider/executeConnectionPromisedQuery",params);
    return new Promise((resolve, reject) => {
      try {
        this.getPool().query(query, params, (err_query, result) => { 
          return resolve(this.handleQueryResponse(err_query, result));
        });
      } catch (err) {
        appLogger.error(null, null,`BaseMySqlProvider/executeConnectionPromisedQuery - , error: `, err);
        return reject(err);
      }
    });
  }

  static executePromisedQueryFilterOkPacket(connection,query,params){
    appLogger.info(null," BaseMySqlProvider/executePromisedQueryFilterOkPacket");
    if (!connection) {
      appLogger.info(null,"connection not present");
      return new Promise((resolve, reject) => {
        try {
          if (process.env.NODE_ENV !== "production") {
            appLogger.info(null,
              `BaseMySQLProvider.executePromisedQueryFilterOkPacket (${query}) start`
            );
          }
          this.getPool().query(query, params, (err_query, result) => {
            return resolve(this.handleQueryResponse(err_query, result));
          });
        } catch (err) {
          appLogger.error(null, null, `BaseMySqlProvider/executePromisedQueryFilterOkPacket - , error: `, err);
          return reject(err);
        }
      });
    } else {
      appLogger.info(null,"connection present");
      return BaseMySqlProvider.executeConnectionPromisedQuery(
        connection,
        query,
        params
      );
    }
  }

  static getPoolConnectionTransaction() {
    appLogger.info(null,`BaseMySqlProvider/getPoolConnectionTransaction`);
    return new Promise((resolve, reject) => {
      try {
        this.getPool().getConnection((err, connection) => {
          if (err) {
            appLogger.error(null, null, `BaseMySqlProvider/getPoolConnectionTransaction - , error: `, err);
            return reject(err);
          } else {
            connection.beginTransaction(err => {
              if (err) {
                return reject(err);
              } else {
                return resolve(connection);
              }
            });
          }
        });
      } catch (error) {
        appLogger.error(null, null, `BaseMySqlProvider/getPoolConnectionTransaction - , error: `, error);
        return reject(error);
      }
    });
  }

  static commitTransaction(connection){
    return new Promise((resolve, reject) => {
      try {
        appLogger.info(null,`BaseMySqlProvider.commitTransaction start`);
        connection.commit(err => {
          if (err) {
            return reject(err);
          } else {
            connection.release();
            appLogger.info(null,"connection released")
            return resolve(true);
          }
        });
      } catch (err) {
        appLogger.error(null, null, `BaseMySqlProvider/commitTransaction - , error: `, err);
        return reject(err);
      }
    });
  }

  static rollbackTransaction(connection){
    return new Promise((resolve, reject) => {
      try {
        appLogger.info(null,`BaseMySqlProvider.rollbackTransaction start`);
        if (connection) {
          connection.rollback(() => {
            appLogger.error(null, null, `BaseMySqlProvider/rollbackTransaction - , error: rollback`);
            connection.release();
            appLogger.info(null,"connection released")
            return resolve(true);
          });
        } else {
          return reject(ErrorCode.GENERAL_ERROR);
        }
      } catch (err) {
        appLogger.error(null, null, `BaseMySqlProvider/rollbackTransaction - , error: `, err);
        return reject(err);
      }
    });
  }

  static handleQueryResponse(err_query, result){
    appLogger.info(null,`BaseMySqlProvider/handleQueryResponse`);
    if (err_query) {
      appLogger.error(null, null,`BaseMySqlProvider/handleQueryResponse - , error: `, err_query);
      return Promise.reject(err_query);
    } else {
      let results = result;
      if (result.length > 1) {
        results = result.filter(res => {
          if (res.hasOwnProperty("affectedRows") == false) return res;
        });
      }
      return results;
    }
  }
}