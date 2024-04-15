// src/Server/routes/index.js
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT,
});
const bcrypt = require('bcryptjs');

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}
router.get('/', async (req, res) => {
    res.redirect('/accueil')
})
router.get('/accueil', async (req, res) => {
    res.render('accueil')
})


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await pool.query(
            'INSERT INTO client (identifiant, mail, mdp_client) VALUES ($1, $2) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).redirect('/');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    try {
        const user = await pool.query(
            'SELECT * FROM client WHERE identifiant = $1',
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.rows[0].mdp_client);
        
        if (!isValidPassword) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.user = user.rows[0];
        res.redirect('/stock');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.redirect('/login');
    });
});

router.get("*", (req, res) => {
    res.status(404).render("404")
})

module.exports = router;