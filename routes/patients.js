const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');

const router = express.Router();

// Patient Registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const sql =
        'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [first_name, last_name, email, password_hash, phone, date_of_birth, gender, address], (err, results) => {
        if (err) return res.status(500).send('Error registering patient');
        res.status(201).json({ id: results.insertId });
    });
});

// Patient Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM patients WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).send('Invalid credentials');

        const patient = results[0];
        const match = await bcrypt.compare(password, patient.password_hash);
        if (match) {
            req.session.patientId = patient.id; // Store patient ID in session
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send('Could not log out');
        res.send('Logged out successfully');
    });
});

// Profile Management
router.get('/profile', (req, res) => {
    if (!req.session.patientId) return res.status(401).send('Unauthorized');

    const sql = 'SELECT * FROM patients WHERE id = ?';
    db.query(sql, [req.session.patientId], (err, results) => {
        if (err) return res.status(500).send('Error fetching profile');
        res.json(results[0]);
    });
});

// Update Profile
router.put('/profile', (req, res) => {
    if (!req.session.patientId) return res.status(401).send('Unauthorized');

    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;
    const sql = 'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?';

    db.query(sql, [first_name, last_name, phone, date_of_birth, gender, address, req.session.patientId], (err) => {
        if (err) return res.status(500).send('Error updating profile');
        res.send('Profile updated successfully');
    });
});

// Delete Account
router.delete('/account', (req, res) => {
    if (!req.session.patientId) return res.status(401).send('Unauthorized');

    const sql = 'DELETE FROM patients WHERE id = ?';
    db.query(sql, [req.session.patientId], (err) => {
        if (err) return res.status(500).send('Error deleting account');
        req.session.destroy();
        res.send('Account deleted successfully');
    });
});

module.exports = router;