const express = require('express');
const db = require('../database');

const router = express.Router();

// Get all patients (admin only)
router.get('/patients', (req, res) => {
    const sql = 'SELECT * FROM patients';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching patients:', err);
            return res.status(500).send('Error fetching patients');
        }
        res.json(results);
    });
});

// Admin can add new doctors
router.post('/doctors', (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    const sql =
        'INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [first_name, last_name, specialization, email, phone, schedule], (err, results) => {
        if (err) {
            console.error('Error adding doctor:', err);
            return res.status(500).send('Error adding doctor');
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Admin can delete a doctor
router.delete('/doctors/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM doctors WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error deleting doctor:', err);
            return res.status(500).send('Error deleting doctor');
        }
        res.send('Doctor deleted successfully');
    });
});

// Get all doctors (admin only)
router.get('/doctors', (req, res) => {
    const sql = 'SELECT * FROM doctors';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            return res.status(500).send('Error fetching doctors');
        }
        res.json(results);
    });
});

module.exports = router;