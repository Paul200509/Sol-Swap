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
// Example route
// router.get('/commandes', async (req, res) => {
//     try {
//         pool.query('SELECT * FROM palfrenier ORDER BY id', (err, smith) => {
//             const stock = smith.rows;
//             pool.query('SELECT * FROM cheval_caleche ORDER BY id', (err, smith) => {
//                 const cheval_caleche = smith.rows;
//                 res.render('index', { stock, cheval_caleche });
//             })
//         })
//
//     } catch (error) {
//         // Log and handle errors
//         console.error('Error executing SQL query:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
// router.post('/commandes/valider', (req, res) => {
//     const updatePromises = [];
//     Object.entries(req.body).forEach(([id, quantity]) => {
//         quantity = parseInt(quantity);
//         if (isNaN(quantity)) {
//             console.error('Invalid quantity:', quantity);
//             res.status(400).send('Invalid quantity');
//             return;
//         }
//         const queryPromise = new Promise((resolve, reject) => {
//             pool.query('SELECT stock FROM palfrenier WHERE id = $1', [id], (err, result) => {
//                 if (err) {
//                     console.error('Error selecting data from database:', err);
//                     reject(err);
//                     return;
//                 }
//                 if (result.rows.length === 0) {
//                     console.error('No record found for ID:', id);
//                     reject(new Error('Record not found'));
//                     return;
//                 }
//                 const currentStock = result.rows[0].stock;
//                 const newStock = currentStock - quantity;
//                 pool.query('UPDATE palfrenier SET stock = $1 WHERE id = $2', [newStock, id], (err, result) => {
//                     if (err) {
//                         console.error('Error updating data in database:', err);
//                         reject(err);
//                         return;
//                     }
//                     resolve();
//                 });
//             });
//         });
//         updatePromises.push(queryPromise);
//     });
//     Promise.all(updatePromises)
//         .then(() => {
//             res.redirect('/ressources/commandes');
//         })
//         .catch(err => {
//             console.error('Error processing updates:', err);
//             res.status(500).send('Internal Server Error');
//         });
// });
// router.post('/commandes/restock', (req, res) => {
//     const updatePromises = [];
//     Object.entries(req.body).forEach(([id, quantity]) => {
//         quantity = parseInt(quantity);
//         if (isNaN(quantity)) {
//             console.error('Invalid quantity:', quantity);
//             res.status(400).send('Invalid quantity');
//             return;
//         }
//         const queryPromise = new Promise((resolve, reject) => {
//             pool.query('SELECT stock FROM palfrenier WHERE id = $1', [id], (err, result) => {
//                 if (err) {
//                     console.error('Error selecting data from database:', err);
//                     reject(err);
//                     return;
//                 }
//                 if (result.rows.length === 0) {
//                     console.error('No record found for ID:', id);
//                     reject(new Error('Record not found'));
//                     return;
//                 }
//                 const currentStock = result.rows[0].stock;
//                 const newStock = currentStock + quantity;
//                 pool.query('UPDATE palfrenier SET stock = $1 WHERE id = $2', [newStock, id], (err, result) => {
//                     if (err) {
//                         console.error('Error updating data in database:', err);
//                         reject(err);
//                         return;
//                     }
//                     resolve();
//                 });
//             });
//         });
//         updatePromises.push(queryPromise);
//     });
//     Promise.all(updatePromises)
//         .then(() => {
//             res.redirect('/ressources/commandes');
//         })
//         .catch(err => {
//             console.error('Error processing updates:', err);
//             res.status(500).send('Internal Server Error');
//         });
// });

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}
router.get('/register', (req, res) => {
    res.render('register'); // Assuming you have a view engine set up to render your registration form
});
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

router.get('/login', (req, res) => {
    res.render('login'); // Assuming you have a view engine set up to render your login form
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

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

router.get("/stock", isAuthenticated, (req, res, next) => {
    const userId = req.session.user.id;
    res.send(`${userId}`)
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.redirect('/login');
    });
});


module.exports = router;