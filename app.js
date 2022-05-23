const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./src/user')(app);
require('./src/wallet')(app);
require('./src/bet')(app);
require('./src/userBet')(app);

module.exports = app;
