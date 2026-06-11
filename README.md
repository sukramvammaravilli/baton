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

Create a MySQL database:

CREATE DATABASE wallet_system;

use wallet_system;

CREATE TABLE IF NOT EXISTS `accounts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `account_no` varchar(20) NOT NULL,
  `total_balance` decimal(18,3) DEFAULT '0.000',
  `total_deposit` decimal(18,3) DEFAULT '0.000',
  `total_transfer` decimal(18,3) DEFAULT '0.000',
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_no` (`account_no`),
  KEY `username` (`username`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `currency` (
  `currency_name` varchar(100) NOT NULL,
  `currency_code` varchar(5) NOT NULL,
  `currency_symbol` varchar(20) NOT NULL,
  `exchange_rate` decimal(18,3) NOT NULL,
  UNIQUE KEY `currency_name` (`currency_name`),
  UNIQUE KEY `currency_code` (`currency_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_id` varchar(50) NOT NULL,
  `username` varchar(20) NOT NULL,
  `type` enum('DEPOSIT','TRANSFER_IN','TRANSFER_OUT','REVERSE_IN','REVERSE_OUT') NOT NULL,
  `from_account` varchar(20) DEFAULT NULL,
  `to_account` varchar(20) DEFAULT NULL,
  `currency` varchar(10) NOT NULL,
  `amount` decimal(18,3) NOT NULL,
  `converted_amount` decimal(18,3) NOT NULL,
  `status` enum('SUCCESS','PENDING','FAILED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `session_token` varchar(255) DEFAULT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `logout_time` timestamp NULL DEFAULT NULL,
  `expiry_time` timestamp NULL DEFAULT NULL,
  `status` enum('ACTIVE','LOGGED_OUT','EXPIRED') DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `fullname` varchar(30) NOT NULL,
  `email` varchar(255) NOT NULL,
  `currency_code` varchar(3) NOT NULL,
  `mobile_number` varchar(20) NOT NULL,
  `identity_number` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `mobile_number` (`mobile_number`),
  UNIQUE KEY `identity_number` (`identity_number`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
Repositories
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

Services act as the central business layer.

---

### Repository Layer

Responsible for:

* SQL queries
* Database communication
* Transaction management

Separating repository logic improves maintainability and testability.

---

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

Transfers between accounts with different currencies automatically invoke currency conversion.

Benefits:

* Supports international wallets
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

npm test


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
* Cross Currency Transfer
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

1. Users can own multiple accounts.
2. Each account belongs to exactly one user.
3. Each account maintains a single currency.
4. Transfers may occur between different currencies.
5. Session expiration is configurable using environment variables.
6. Only authenticated users can access dashboard APIs.
7. Financial transactions must be atomic.
8. Reverse operations are fully auditable.

