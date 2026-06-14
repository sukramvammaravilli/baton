# Multi Currency Wallet System

## Overview

This project is a backend-driven multi-currency wallet system.

The system supports:
- Deposits
- Atomic transfers
- Immutable transaction ledger
- Transaction history

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Frontend
- HTML
- CSS
- Bootstrap

## Testing
- Jest
- Supertest

---

# Why MySQL?

MySQL was selected because it supports ACID transactions which are critical for financial systems.

---

# Features

- Deposit funds
- Transfer funds atomically
- Immutable transaction records
- Transaction history
- Precision support using DECIMAL(18,3)

---

# Setup Instructions

## Prerequisites

Ensure the following software is installed:

* Node.js (v18+ recommended)
* MySQL Server
* npm

Verify installation:

in bash or command prompt ( with admin access)
node -v
npm -v
mysql --version


---

## Clone Repository

bash
git clone https://github.com/sukramvammaravilli/baton.git
cd baton

or code has been made live for 1 month that also can be checked :- 

https://baton-wallet-system.onrender.com

---

## Install Dependencies

after opening the code , run the following in any terminal like command prompt or git bash
- npm install


---

## Database Setup

Schema.sql is present for schemas 
NOTE : compulsory insert the currency data before taking any acton in portal
seed-data-script.sql is present for inserting any ready data

NOTE: either schema.sql an be used for creating tables or else when npm start is done automatically all the necessary tables will be added in db with empty data .
---

## Environment Configuration

Create a `.env` file in the project root and enter the below key values and update your db values
- PORT=3000
- JWT_SECRET=mysecretkey
- SESSION_TIME=15m
- DB_HOST=localhost
- DB_PORT=DB_PORT
- DB_USER=root
- DB_PASSWORD=password
- DB_NAME=wallet_system


---

## Run Application

- npm start


Application will start on:

- http://localhost:3000 (if locally run the code)

- https://baton-wallet-system.onrender.com/ (live)


---

# Architectural Decisions

## Layered Architecture

The application follows a layered architecture pattern:


Client
  |
Routes
  |
Middleware
  |
Controllers
  |
Validators
  |
Services
  |
MySQL Database


### Routes

Responsible for endpoint definitions and request routing.

All routes which are used :-

text
/api/login
/api/register
/api/dashboard/transfer
/api/dashboard/profile
/api/dashboard/updateProfile
/api/accounts
/api/dashboard/addAccount
/api/dashboard/removeAccount
/api/dashboard
/api/dashboard/deposit
/api/dashboard/transfer
/api/dashboard/transactions
/api/dashboard/getCurrencies
/api/dashboard/exchange
/api/dashboard/reverseTransaction
/api/logout

---

### Controllers

Responsible for:

* Request validation
* Preparing input parameters
* Sending HTTP responses

Controllers do not contain business logic.

---

### Services

Responsible for:

* Business rules
* Transfer processing
* Currency conversion
* Session management
* SQL queries
* Database communication
* Transaction management

Services act as the central business layer and DB layer.


## Authentication Design

JWT authentication is used for securing APIs.

Why JWT?

* Stateless authentication
* Industry standard
* Easy frontend integration
* Scalable for distributed systems

---

## Session Tracking Design

Although JWT is stateless, sessions are additionally stored in the database.

Reason:

* Logout support
* Forced session expiration
* Session auditing
* Active session monitoring

Session states:

ACTIVE
LOGGED_OUT
EXPIRED


---

## Transfer Atomicity Design

Transfers are executed using database transactions.

Reason:

Financial operations must be atomic.

Example:

Debit Sender
Credit Receiver
Insert Transaction


If any step fails:

ROLLBACK


This guarantees:

* No partial transfers
* Consistent balances
* Data integrity

---

## Multi-Currency Design

Each account stores its own currency. 

(NOTE :- some days before which i submitted in that currency was implemented in user level which is wrong so that is corrected now. )

Transfers between accounts with different currencies automatically invoke currency conversion. (This was the part of previous implementation)

Transfers between accounts with different currencies is restricted now as per the requirement in assignment .

Benefits:

* Supports international wallets, user can have multicurrency accounts.
* Simplifies balance management
* Improves extensibility

---

# Test Instructions

The project uses:

* Jest
* Supertest

for automated API testing.
---

## Install Test Dependencies

bash
npm install --save-dev jest supertest


---

## Configure package.json

json
{
  "scripts": {
    "test": "jest"
  }
}


---

## Run Complete Test Suite

Execute all tests:

npm test  (It is not needed now as it will run all tests parallel , which will cause issue because of tokens and account/user creation). 

Execute particular file but in the following order :-  

npx jest test/auth/signup.test.js 
npx jest test/auth/login.test.js 
npx jest test/auth/logout.test.js 
npx jest test/auth/session.test.js 
npx jest test/accounts/account.test.js 
npx jest test/dashboard/dashboard.test.js 
npx jest test/deposit/deposit.test.js 
npx jest test/exchange/exchange.test.js 
npx jest test/profile/profile.test.js 
npx jest test/transfer/transfer.test.js 
npx jest test/transactions/reverse.test.js 
npx jest test/transactions/transactions.test.js

---

## Test Modules Covered

### Authentication

* Registration
* Login
* Logout

### Session Management

* JWT Validation
* Session Expiry
* Session Status Verification

### Dashboard

* Dashboard Summary
* Account Visibility
* Live Rates w.r.t USD

### Profile

* Profile Retrieval
* Profile Update

### Account Management

* Add Account
* Remove Account

### Deposit

* Deposit Validation
* Balance Update
* Transaction Creation

### Transfer

* Same Currency Transfer
* Cross Currency Transfer Error
* Insufficient Balance
* Invalid Accounts

### Atomicity

* Rollback Validation
* Partial Transfer Prevention

### Exchange

* Currency Conversion
* Invalid Currency Handling

### Transactions

* History Retrieval
* Transaction Visibility

### Reverse Transactions

* Balance Restoration
* Duplicate Reversal Prevention

---

## Total Automated Tests

Approx 110+ Test Cases


---

# Assumptions

The following assumptions were made during development:

1. Users can own multiple accounts with different currencies.
2. Each account belongs to exactly one user.
3. Each account maintains a single currency.
4. Transfers may not occur between different currencies should happen only in same currency.
5. Session expiration is configurable using environment variables.
6. Only authenticated users can access dashboard APIs.
7. Financial transactions must be atomic.
8. Reverse operations are fully auditable.
9. Actual Deposit can happen through bank only so assuming here source is confirmed so directly depositing in particular account with different currencies.
10. Self Transfers cannot be done.
11. Cors is public as of now because code is not deployed in any server as of now.
12. Basic UI has been used as discussed so no SPA framework.
13. Please change the testing values accordingly and test , at present what are there those are tested with empty db so now if tested with same data then may show different result.
