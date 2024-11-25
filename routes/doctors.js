const express = require('express');
const db = require('../database');

const router = express.Router();

// Create a new doctor
router.post('/', (req, res) => {
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

// Get all doctors
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM doctors';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching doctors:', err);
            return res.status(500).send('Error fetching doctors');
        }
        res.json(results);
    });
});

// Update a doctor
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    const sql = 'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?';

    db.query(sql, [first_name, last_name, specialization, email, phone, schedule, id], (err) => {
        if (err) {
            console.error('Error updating doctor:', err);
            return res.status(500).send('Error updating doctor');
        }
        res.send('Doctor updated successfully');
    });
});

// Delete a doctor
router.delete('/:id', (req, res) => {
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

module.exports = router;