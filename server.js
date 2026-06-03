require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const initializeDatabase = require('./db/initDb');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/api', walletRoutes);

app.use(express.static(path.join(__dirname, 'ui')));

initializeDatabase();

const PORT =
    process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {

    app.listen(PORT, () => {

        console.log(
            `Server running on ${PORT}`
        );
    });
}

module.exports = app;