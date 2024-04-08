require("dotenv").config();

const path = require('path');

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
});

const https = require("https");
const http = require("http");
const fs = require("fs");

const app = express();

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// Define middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Public')));
app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));


const ressourcesRouter = require('./Pages/ressources');
app.use('/', ressourcesRouter);

let server;

if (process.env.LIVE === "true") {
    server = https.createServer(
        {
            key: fs.readFileSync(`${__dirname}/Certificate/private_key.pem`),
            cert: fs.readFileSync(`${__dirname}/Certificate/certificate.crt`),
            passphrase: process.env.PASSPHRASE,
        },
        app
    );
} else {
    server = http.createServer(app);
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    next();
});

server.listen(3500, () =>
    console.log("Serveur allumée sur le port 3500")
);

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(3096).toString('hex');
// console.log(secretKey);

module.exports = { app, pool };