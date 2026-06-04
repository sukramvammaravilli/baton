const dashboardDbService = require('../db_services/db_services');
module.exports = {

deposit : async (accountNumber, amount, currency) => {

    // const connection = await pool.getConnection();

    // try {

    //     await connection.beginTransaction();

    //     const [accounts] = await connection.query(
    //         'SELECT * FROM accounts WHERE account_number = ?',
    //         [accountNumber]
    //     );
    //     if (accounts.length === 0) {
    //         throw new Error('Account not found');
    //     }

    //     const account = accounts[0];

    //     if (account.currency !== currency) {
    //         throw new Error('Currency mismatch');
    //     }

    //     const newBalance = parseFloat(account.balance) + parseFloat(amount);

    //     await connection.query(
    //         'UPDATE accounts SET balance = ? WHERE id = ?',
    //         [newBalance, account.id]
    //     );

    //     await connection.query(
    //         `INSERT INTO transactions
    //         (type, to_account, amount, currency)
    //         VALUES (?, ?, ?, ?)`,
    //         ['DEPOSIT', account.id, amount, currency]
    //     );

    //     await connection.commit();

    //     return {
    //         message: 'Deposit successful'
    //     };

    // } catch (error) {

    //     await connection.rollback();
    //     throw error;

    // } finally {

    //     connection.release();
    // }
},

transfer : async (fromAccountNumber, toAccountNumber, amount, currency) => {

//     const connection = await pool.getConnection();
// try {

//         await connection.beginTransaction();

//         const [senderRows] = await connection.query(
//             'SELECT * FROM accounts WHERE account_number = ?',
//             [fromAccountNumber]
//         );

//         const [receiverRows] = await connection.query(
//             'SELECT * FROM accounts WHERE account_number = ?',
//             [toAccountNumber]
//         );

//         if (senderRows.length === 0 || receiverRows.length === 0) {
//             throw new Error('Invalid account');
//         }

//         const sender = senderRows[0];
//         const receiver = receiverRows[0];

//         if (sender.currency !== receiver.currency) {
//             throw new Error('Transfer allowed only within same currency');
//         }

//         if (sender.currency !== currency) {
//             throw new Error('Currency mismatch');
//         }

//         if (parseFloat(sender.balance) < parseFloat(amount)) {
//             throw new Error('Insufficient balance');
//         }

//         const senderBalance = parseFloat(sender.balance) - parseFloat(amount);
//         const receiverBalance = parseFloat(receiver.balance) + parseFloat(amount);

//         await connection.query(
//             'UPDATE accounts SET balance = ? WHERE id = ?',
//             [senderBalance, sender.id]
//         );

//         await connection.query(
//             'UPDATE accounts SET balance = ? WHERE id = ?',
//             [receiverBalance, receiver.id]
//         );

//         await connection.query(
//             `INSERT INTO transactions
//             (type, from_account, to_account, amount, currency)
//             VALUES (?, ?, ?, ?, ?)`,
//             ['TRANSFER', sender.id, receiver.id, amount, currency]
//         );

//         await connection.commit();

//         return {
//             message: 'Transfer successful'
//         };

//     } catch (error) {

//         await connection.rollback();
//         throw error;

//     } finally {

//         connection.release();
//     }
},

getTransactions : async () => {

    // const [transactions] = await pool.query(`
    //     SELECT * FROM transactions
    //     ORDER BY created_at DESC
    // `);

    // return transactions;
}
}