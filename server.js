require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Routes = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

Routes(app)

app.use(express.static(path.join(__dirname, 'ui')));

const PORT =3000;
    // process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {

    app.listen(PORT, () => {

        console.log(
            `Server running on ${PORT}`
        );
    });
}

module.exports = app;