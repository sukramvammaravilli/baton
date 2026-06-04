CREATE DATABASE baton_wallet_system;

USE wallet_system;

CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_number VARCHAR(50) UNIQUE NOT NULL,
    currency VARCHAR(10) NOT NULL,
    balance DECIMAL(18,3) DEFAULT 0.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(20) NOT NULL,
    from_account INT NULL,
    to_account INT NULL,
    amount DECIMAL(18,3) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    reference_transaction_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (from_account) REFERENCES accounts(id),
    FOREIGN KEY (to_account) REFERENCES accounts(id)
);

CREATE TABLE users (

    id INT PRIMARY KEY AUTO_INCREMENT,

    username VARCHAR(50)
    UNIQUE NOT NULL,

    full_name VARCHAR(100)
    NOT NULL,

    email VARCHAR(100)
    UNIQUE NOT NULL,

    password VARCHAR(255)
    NOT NULL
);