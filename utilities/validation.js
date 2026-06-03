const currencies =
    require('./currencies');

function validateAmount(amount) {

    if (
        amount === undefined ||
        amount === null
    ) {

        throw new Error(
            'Amount is required'
        );
    }

    if (amount <= 0) {

        throw new Error(
            'Amount must be greater than zero'
        );
    }

    const decimalPlaces =
        amount.toString()
        .split('.')[1]?.length || 0;

    if (decimalPlaces > 3) {

        throw new Error(
            'Maximum 3 decimal places allowed'
        );
    }
}

function validateCurrency(currency) {

    if (
        !currencies.includes(currency)
    ) {

        throw new Error(
            'Invalid ISO currency'
        );
    }
}

module.exports = {

    validateAmount,
    validateCurrency

};