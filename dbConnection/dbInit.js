import BaseMySqlProvider from "./connection";
const bcrypt = require('bcryptjs');

export default class Initialization {

async createUserTable() {
        let is_external_connection = true;
        try {
            appLogger.info(null, "Start of Repo: SystemRepo, Method: createApprovalTable");
            if (!connection) {
                is_external_connection = false;
                connection = await BaseMySqlProvider.getPoolConnectionTransaction();
            }
            const createTableQuery = `CREATE TABLE IF NOT EXISTS users (

    id INT PRIMARY KEY AUTO_INCREMENT,

    username VARCHAR(50)
    UNIQUE NOT NULL,

    full_name VARCHAR(100)
    NOT NULL,

    email VARCHAR(100)
    UNIQUE NOT NULL,

    password VARCHAR(255)
    NOT NULL);`
            await BaseMySqlProvider.executePromisedQueryFilterOkPacket(connection, createTableQuery);
            console.log(
            'Database initialized'
        );
            return;
        } catch (error) {
            appLogger.error(null, null, "Error while creating approval table", error);
            throw error;
        } finally {
            appLogger.info(null, "End of Repo: SystemRepo, Method: createApprovalTable");
        }
    }


        // await pool.query(`

        //     CREATE TABLE IF NOT EXISTS accounts (

        //         id INT PRIMARY KEY
        //         AUTO_INCREMENT,

        //         user_id INT NOT NULL,

        //         account_number
        //         VARCHAR(50)
        //         UNIQUE,

        //         currency CHAR(3),

        //         balance
        //         DECIMAL(18,3)
        //         DEFAULT 0.000,

        //         FOREIGN KEY(user_id)
        //         REFERENCES users(id)

        //     )

        // `);

        // await pool.query(`

        //     CREATE TABLE IF NOT EXISTS transactions (

        //         id BIGINT PRIMARY KEY
        //         AUTO_INCREMENT,

        //         transaction_type
        //         ENUM(
        //             'DEPOSIT',
        //             'TRANSFER',
        //             'REVERSAL'
        //         ),

        //         from_account_id INT NULL,

        //         to_account_id INT NULL,

        //         amount
        //         DECIMAL(18,3),

        //         currency CHAR(3),

        //         reversal_of_transaction_id
        //         BIGINT NULL,

        //         created_at TIMESTAMP
        //         DEFAULT CURRENT_TIMESTAMP

        //     )

        // `);

        // const [users] =
        //     await pool.query(
        //         'SELECT * FROM users'
        //     );

    //     console.log(
    //         'Database initialized'
    //     );

    // } catch (error) {

    //     console.error(error);
    // }
}

// module.exports =
//     initializeDatabase;