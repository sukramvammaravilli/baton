const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// const walletRoutes = require('./routes/walletRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// app.use('/api', walletRoutes);

app.use(express.static(path.join(__dirname, 'ui')));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;