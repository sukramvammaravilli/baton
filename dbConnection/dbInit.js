const pool =
    require('./connection');

const bcrypt =
    require('bcryptjs');

async function initializeDatabase() {

    try {

        await pool.query(`

            CREATE TABLE IF NOT EXISTS users (

                id INT PRIMARY KEY
                AUTO_INCREMENT,

                username VARCHAR(100)
                UNIQUE,

                password VARCHAR(255)
                NOT NULL,

                created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP
            )

        `);

        await pool.query(`

            CREATE TABLE IF NOT EXISTS accounts (

                id INT PRIMARY KEY
                AUTO_INCREMENT,

                user_id INT NOT NULL,

                account_number
                VARCHAR(50)
                UNIQUE,

                currency CHAR(3),

                balance
                DECIMAL(18,3)
                DEFAULT 0.000,

                FOREIGN KEY(user_id)
                REFERENCES users(id)

            )

        `);

        await pool.query(`

            CREATE TABLE IF NOT EXISTS transactions (

                id BIGINT PRIMARY KEY
                AUTO_INCREMENT,

                transaction_type
                ENUM(
                    'DEPOSIT',
                    'TRANSFER',
                    'REVERSAL'
                ),

                from_account_id INT NULL,

                to_account_id INT NULL,

                amount
                DECIMAL(18,3),

                currency CHAR(3),

                reversal_of_transaction_id
                BIGINT NULL,

                created_at TIMESTAMP
                DEFAULT CURRENT_TIMESTAMP

            )

        `);

        const [users] =
            await pool.query(
                'SELECT * FROM users'
            );

        if (users.length === 0) {

            const password =
                await bcrypt.hash(
                    'Admin123@',
                    10
                );

            const [result] =
                await pool.query(

                    `
                    INSERT INTO users
                    (
                        username,
                        password
                    )
                    VALUES
                    (?,?)
                    `,
                    [
                        'admin',
                        password
                    ]
                );

            await pool.query(

                `
                INSERT INTO accounts
                (
                    user_id,
                    account_number,
                    currency,
                    balance
                )
                VALUES
                (?,?,?,?)
                `,
                [
                    result.insertId,
                    'ACC1001',
                    'INR',
                    10000.000
                ]
            );
        }

        console.log(
            'Database initialized'
        );

    } catch (error) {

        console.error(error);
    }
}

module.exports =
    initializeDatabase;