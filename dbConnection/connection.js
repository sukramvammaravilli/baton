const mysql = require("mysql2");
var pool;

class BaseMySqlProvider {
  static getPool() {
    if (pool) return pool;
    let databaseConfig = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      supportBigNumbers: true,
      bigNumberStrings: true,
    };
    pool = mysql.createPool(databaseConfig);
    return pool;
  }

  static executeConnectionPromisedQuery(connection, query, params) {
    return new Promise((resolve, reject) => {
      try {
        connection.query(query, params, (err_query, result) => {
          return resolve(this.handleQueryResponse(err_query, result));
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  static executePromisedQueryFilterOkPacket(connection, query, params) {
    if (!connection) {
      return new Promise((resolve, reject) => {
        try {
          this.getPool().query(query, params, (err_query, result) => {
            return resolve(this.handleQueryResponse(err_query, result));
          });
        } catch (err) {
          return reject(err);
        }
      });
    } else {
      return BaseMySqlProvider.executeConnectionPromisedQuery(
        connection,
        query,
        params,
      );
    }
  }

  static getPoolConnectionTransaction() {
    return new Promise((resolve, reject) => {
      try {
        this.getPool().getConnection((err, connection) => {
          if (err) {
            return reject(err);
          } else {
            connection.beginTransaction((err) => {
              if (err) {
                return reject(err);
              } else {
                return resolve(connection);
              }
            });
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  static commitTransaction(connection) {
    return new Promise((resolve, reject) => {
      try {
        connection.commit((err) => {
          if (err) {
            return reject(err);
          } else {
            connection.release();
            return resolve(true);
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  }

  static rollbackTransaction(connection) {
    return new Promise((resolve, reject) => {
      try {
        if (connection) {
          connection.rollback(() => {
            connection.release();
            return resolve(true);
          });
        } else {
          return reject(ErrorCode.GENERAL_ERROR);
        }
      } catch (err) {
        return reject(err);
      }
    });
  }

  static handleQueryResponse(err_query, result) {
    if (err_query) {
      return Promise.reject(err_query);
    } else {
      let results = result;
      if (result.length > 1) {
        results = result.filter((res) => {
          if (res.hasOwnProperty("affectedRows") == false) return res;
        });
      }
      return results;
    }
  }
}

module.exports = BaseMySqlProvider;
