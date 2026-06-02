const walletService = require('../services/walletService');

const deposit = async (req, res) => {

    try {

        const { accountNumber, amount, currency } = req.body;

        const response = await walletService.deposit(
            accountNumber,
            amount,
            currency
        );

        res.status(200).json(response);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};

const transfer = async (req, res) => {

    try {

        const {
            fromAccount,
            toAccount,
            amount,
            currency
        } = req.body;

        const response = await walletService.transfer(
            fromAccount,
            toAccount,
            amount,
            currency
        );

        res.status(200).json(response);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};

const getTransactions = async (req, res) => {

    try {

        const transactions = await walletService.getTransactions();

        res.status(200).json(transactions);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    deposit,
    transfer,
    getTransactions
};