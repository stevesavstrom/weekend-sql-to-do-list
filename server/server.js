const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

const Pool = pg.Pool;
const config = {
    database: 'bookstore',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
};

const pool = new Pool(config);

pool.on('connect', () => {
    console.log('Postgresql connected');
});

pool.on('error', () => {
    console.log('Error with PostgreSQL pool', error);
});