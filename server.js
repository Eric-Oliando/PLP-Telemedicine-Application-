const express = require('express');
const session = require('express-session');
const bcryptjs = require('bcryptjs');
const MySQLStore = require('connect-mysql2')(session);
require('dotenv').config();

// initialize server
const app = express();


// Serve static files from the public directory
app.use(express.static('public'));

// Serve the html forms
const path = require('path');

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const db = require('./config/database');

const bodyParser = require('body-parser');
const patientsRoutes = require('./routes/patients');
const doctorsRoutes = require('./routes/doctors');
const appointmentsRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');


// set-up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session configuration
app.use(
    session({
        key: 'user_session_id',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MySQLStore({}, db),
        cookie: {
            maxAge: 40 * 60 * 1000,
            httpOnly: true,         
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' 
        }
    })
);

// use routes
app.use('/patients', patientsRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/admin', adminRoutes);


// Route to create all tables
app.get('/createTables', (req, res) => {
    
    const createPatientsTable = `
        CREATE TABLE IF NOT EXISTS patients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password_hash VARCHAR(255), 
            phone VARCHAR(14), 
            date_of_birth DATE, 
            gender ENUM('male', 'female', 'other'), 
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    const createDoctorsTable = `
        CREATE TABLE IF NOT EXISTS doctors (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            specialization VARCHAR(100),
            email VARCHAR(100) NOT NULL UNIQUE,
            phone VARCHAR(15),
            schedule TEXT
        );
    `;

    const createAppointmentsTable = `
        CREATE TABLE IF NOT EXISTS appointments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            patient_id INT,
            doctor_id INT,
            appointment_date DATE,
            appointment_time TIME,
            status ENUM('scheduled', 'completed', 'canceled') DEFAULT 'scheduled',
            FOREIGN KEY (patient_id) REFERENCES patients(id),
            FOREIGN KEY (doctor_id) REFERENCES doctors(id)
        );
    `;

    const createAdminTable = `
        CREATE TABLE IF NOT EXISTS admin (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(100) NOT NULL,
            role ENUM('admin', 'superadmin') DEFAULT 'admin'
        );
    `;

    db.query(createPatientsTable, (err) => {
        if (err) {
            console.error('Error creating patients table:', err);
            return res.status(500).send('Error creating patients table');
        }

        db.query(createDoctorsTable, (err) => {
            if (err) {
                console.error('Error creating doctors table:', err);
                return res.status(500).send('Error creating doctors table');
            }

            db.query(createAppointmentsTable, (err) => {
                if (err) {
                    console.error('Error creating appointments table:', err);
                    return res.status(500).send('Error creating appointments table');
                }

                db.query(createAdminTable, (err) => {
                    if (err) {
                        console.error('Error creating admin table:', err);
                        return res.status(500).send('Error creating admin table');
                    }

                    res.send('All tables created successfully');
                });
            });
        });
    });
});

app.get('/', (req, res) => { 
    res.status(200).send('Hello, I am using the Express packages');
});


//start the server

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});