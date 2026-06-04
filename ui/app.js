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






const token =
    localStorage.getItem(
        'token'
    );

if (
    !token &&
    !window.location.pathname
        .includes('login')
) {

    window.location.href =
        '/login.html';
}

async function deposit() {

    const response =
        await fetch(
            '/api/deposit',
            {

                method: 'POST',

                headers: {

                    'Content-Type':
                    'application/json',

                    Authorization:
                    `Bearer ${token}`

                },

                body: JSON.stringify({

                    accountNumber:
                    document.getElementById(
                        'depositAccount'
                    ).value,

                    amount:
                    Number(
                        document.getElementById(
                            'depositAmount'
                        ).value
                    ),

                    currency:
                    document.getElementById(
                        'depositCurrency'
                    ).value

                })

            }
        );

    const data =
        await response.json();

    alert(
        data.message ||
        data.error
    );
}

async function transfer() {

    const response =
        await fetch(
            '/api/transfer',
            {

                method: 'POST',

                headers: {

                    'Content-Type':
                    'application/json',

                    Authorization:
                    `Bearer ${token}`

                },

                body: JSON.stringify({

                    fromAccount:
                    document.getElementById(
                        'fromAccount'
                    ).value,

                    toAccount:
                    document.getElementById(
                        'toAccount'
                    ).value,

                    amount:
                    Number(
                        document.getElementById(
                            'transferAmount'
                        ).value
                    ),

                    currency:
                    document.getElementById(
                        'transferCurrency'
                    ).value

                })

            }
        );

    const data =
        await response.json();

    alert(
        data.message ||
        data.error
    );

    loadTransactions();
}

async function loadTransactions() {

    const response =
        await fetch(
            '/api/transactions',
            {

                headers: {

                    Authorization:
                    `Bearer ${token}`

                }

            }
        );

    const transactions =
        await response.json();

    const tbody =
        document.getElementById(
            'transactions'
        );

    tbody.innerHTML = '';

    transactions.forEach(tx => {

        tbody.innerHTML += `

        <tr>

            <td>${tx.id}</td>

            <td>
                ${tx.transaction_type}
            </td>

            <td>
                ${tx.amount}
            </td>

            <td>
                ${tx.currency}
            </td>

            <td>
                ${new Date(
                    tx.created_at
                ).toLocaleString()}
            </td>

        </tr>

        `;
    });
}

function logout() {

    localStorage.removeItem(
        'token'
    );

    window.location.href =
        '/login.html';
}

loadTransactions();