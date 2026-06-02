const loadTransactions = async () => {

    const response = await fetch('/api/transactions');

    const data = await response.json();

    const table = document.getElementById('transactionTable');

    table.innerHTML = '';

    data.forEach(transaction => {

        table.innerHTML += `
            <tr>
                <td>${transaction.id}</td>
                <td>${transaction.type}</td>
                <td>${transaction.amount}</td>
                <td>${transaction.currency}</td>
                <td>${transaction.created_at}</td>
            </tr>
        `;
    });
};

const transferMoney = async () => {

    const fromAccount = document.getElementById('fromAccount').value;
    const toAccount = document.getElementById('toAccount').value;
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fromAccount,
            toAccount,
            amount,
            currency
        })
    })
}