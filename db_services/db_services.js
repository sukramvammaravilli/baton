const pool = require('../db/connection');

const {
    validateAmount,
    validateCurrency
} = require('../utils/validation');

const deposit = async ({
    accountNumber,
    amount,
    currency
}) => {

    validateAmount(amount);
    validateCurrency(currency);

    const [accounts] =
        await pool.query(

            `
            SELECT *
            FROM accounts
            WHERE account_number=?
            `,

            [accountNumber]

        );

    if (accounts.length === 0) {

        throw new Error(
            'Account not found'
        );
    }

    const account =
        accounts[0];

    if (
        account.currency !== currency
    ) {

        throw new Error(
            'Currency mismatch'
        );
    }

    await pool.query(

        `
        UPDATE accounts
        SET balance =
        balance + ?
        WHERE id=?
        `,

        [
            amount,
            account.id
        ]

    );

    await pool.query(

        `
        INSERT INTO transactions
        (
            transaction_type,
            to_account_id,
            amount,
            currency
        )
        VALUES
        (
            'DEPOSIT',
            ?,?,?
        )
        `,

        [
            account.id,
            amount,
            currency
        ]

    );

    return {

        message:
            'Deposit successful'

    };
};

const transfer = async ({
    fromAccount,
    toAccount,
    amount,
    currency
}) => {

    validateAmount(amount);
    validateCurrency(currency);

    if (
        fromAccount === toAccount
    ) {

        throw new Error(
            'Cannot transfer to same account'
        );
    }

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [senderRows] =
            await connection.query(

                `
                SELECT *
                FROM accounts
                WHERE account_number=?
                FOR UPDATE
                `,

                [fromAccount]

            );

        const [receiverRows] =
            await connection.query(

                `
                SELECT *
                FROM accounts
                WHERE account_number=?
                FOR UPDATE
                `,

                [toAccount]

            );

        if (
            senderRows.length === 0
        ) {

            throw new Error(
                'Sender account not found'
            );
        }

        if (
            receiverRows.length === 0
        ) {

            throw new Error(
                'Receiver account not found'
            );
        }

        const sender =
            senderRows[0];

        const receiver =
            receiverRows[0];

        if (
            sender.currency !==
            receiver.currency
        ) {

            throw new Error(
                'Transfer allowed only within same currency'
            );
        }

        if (
            sender.currency !== currency
        ) {

            throw new Error(
                'Currency mismatch'
            );
        }

        if (
            Number(sender.balance)
            <
            Number(amount)
        ) {

            throw new Error(
                'Insufficient balance'
            );
        }

        await connection.query(

            `
            UPDATE accounts
            SET balance =
            balance - ?
            WHERE id=?
            `,

            [
                amount,
                sender.id
            ]

        );

        await connection.query(

            `
            UPDATE accounts
            SET balance =
            balance + ?
            WHERE id=?
            `,

            [
                amount,
                receiver.id
            ]

        );

        await connection.query(

            `
            INSERT INTO transactions
            (
                transaction_type,
                from_account_id,
                to_account_id,
                amount,
                currency
            )
            VALUES
            (
                'TRANSFER',
                ?,?,?,?
            )
            `,

            [
                sender.id,
                receiver.id,
                amount,
                currency
            ]

        );

        await connection.commit();

        return {

            message:
                'Transfer successful'

        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();
    }
};

const reverseTransaction =
    async (transactionId) => {

        const connection =
            await pool.getConnection();

        try {

            await connection.beginTransaction();

            const [rows] =
                await connection.query(

                    `
                    SELECT *
                    FROM transactions
                    WHERE id=?
                    `,

                    [transactionId]

                );

            if (
                rows.length === 0
            ) {

                throw new Error(
                    'Transaction not found'
                );
            }

            const tx =
                rows[0];

            if (
                tx.transaction_type !==
                'TRANSFER'
            ) {

                throw new Error(
                    'Only transfers can be reversed'
                );
            }

            await connection.query(

                `
                UPDATE accounts
                SET balance =
                balance + ?
                WHERE id=?
                `,

                [
                    tx.amount,
                    tx.from_account_id
                ]

            );

            await connection.query(

                `
                UPDATE accounts
                SET balance =
                balance - ?
                WHERE id=?
                `,

                [
                    tx.amount,
                    tx.to_account_id
                ]

            );

            await connection.query(

                `
                INSERT INTO transactions
                (
                    transaction_type,
                    from_account_id,
                    to_account_id,
                    amount,
                    currency,
                    reversal_of_transaction_id
                )
                VALUES
                (
                    'REVERSAL',
                    ?,?,?,?,?
                )
                `,

                [
                    tx.to_account_id,
                    tx.from_account_id,
                    tx.amount,
                    tx.currency,
                    tx.id
                ]

            );

            await connection.commit();

            return {

                message:
                    'Reversal successful'

            };

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();
        }
    };

const getTransactions =
    async (userId) => {

        const [rows] =
            await pool.query(

                `
                SELECT t.*
                FROM transactions t
                JOIN accounts a
                ON
                (
                    t.from_account_id = a.id
                    OR
                    t.to_account_id = a.id
                )
                WHERE a.user_id=?
                ORDER BY t.id DESC
                `,

                [userId]

            );

        return rows;
    };

module.exports = {

    deposit,
    transfer,
    reverseTransaction,
    getTransactions

};