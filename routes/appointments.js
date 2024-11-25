const express = require('express');
const db = require('../database');

const router = express.Router();

// Book an appointment
router.post('/', (req, res) => {
    // Capture the form data
    const { firstname, lastname, email, contact, age, gender } = req.body;

    const patient_id = req.session.patient_id;

    
    const doctor_id = 1;
    const appointment_date = new Date();
    const appointment_time = new Date().toLocaleTimeString();

    const sql =
        'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)';

    db.query(sql, [patient_id, doctor_id, appointment_date, appointment_time], (err, results) => {
        if (err) {
            console.error('Error booking appointment:', err);
            return res.status(500).send('Error booking appointment');
        }
        res.status(201).json({ id: results.insertId });
    });
});

// Get appointments for a patient
router.get('/:patient_id', (req, res) => {
    const { patient_id } = req.params;
    const sql = 'SELECT * FROM appointments WHERE patient_id = ?';

    db.query(sql, [patient_id], (err, results) => {
        if (err) {
            console.error('Error fetching appointments:', err);
            return res.status(500).send('Error fetching appointments');
        }
        res.json(results);
    });
});

// Cancel an appointment
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM appointments WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.error('Error canceling appointment:', err);
            return res.status(500).send('Error canceling appointment');
        }
        res.send('Appointment canceled successfully');
    });
});

module.exports = router;