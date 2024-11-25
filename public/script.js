// Search Functionality
document.querySelector('.search button').addEventListener('click', function () {
    const query = document.querySelector('.search input').value;
    if (query) {
        alert(`Searching for providers: ${query}`);
    } else {
        alert('Please enter a search term.');
    }
});

// Dynamic Testimonials
const testimonials = [
    {
        name: "Emily Nachan",
        quote: "The EKA Healthcare app has transformed how I access medical care. I can consult with my doctor without leaving my home!",
        image: "Images/Emily Nachan.jpg"
    },
    {
        name: "Marwan Ahmed",
        quote: "I appreciate the 24/7 availability. It gives me peace of mind knowing I can get help whenever I need it.",
        image: "Images/Marwan Ahmed.jpg"
    },
    {
        name: "Flamenco Ra.",
        quote: "The app is user-friendly, and managing my prescriptions has never been easier!",
        image: "Images/Flamenco Ra..jpg"
    }
];

let currentTestimonial = 0;

function displayTestimonial(index) {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    testimonialItems.forEach((item, i) => {
        item.style.display = (i === index) ? 'block' : 'none';
    });
}

// Show the first testimonial initially
displayTestimonial(currentTestimonial);

// Event listener for clicking through testimonials
document.querySelectorAll('.testimonial-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        displayTestimonial(currentTestimonial);
    });
});

// Book appointment page
document.getElementById('bookAppointmentForm').addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    // Capture data from the form fields
    let form = event.target;
    let firstName = form.elements["firstname"].value; 
    let lastName = form.elements["lastname"].value;
    let email = form.elements["email"].value;
    let contact = form.elements["contact"].value;
    let age = form.elements["age"].value;

    // Validate the data
    if (!firstName || !lastName || !email || !contact || !age) {
        alert('All fields are required.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (age < 7 || age > 105) {
        alert('Please enter a valid age between 7 and 105.');
        return;
    }

    let gender = Array.from(form.elements["gender"]).find(radio => radio.checked)?.value;

    // Send a POST request to the server
    try {
        const response = await fetch('/appointments', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({firstname, lastname, email, contact, age, gender})
        });

        const data = await response.json();
        alert('Appointment booked successfully! ID: ' + data.id);
        form.reset();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
});

// display appointment form data
function displayAppointmentData(data) {
    const summarySection = document.createElement('div');
    summarySection.innerHTML = `
        <h2>Form Summary</h2>
        <p><strong>First Name:</strong> ${data.firstName}</p>
        <p><strong>Last Name:</strong> ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Contact No:</strong> ${data.contact}</p>
        <p><strong>Age:</strong> ${data.age}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
    `;
    
    document.body.appendChild(summarySection);
}


// Login form
async function validateLoginForm(event) {
    event.preventDefault(); 
    let form = document.getElementById("loginForm");

    let email = form.elements["email"].value;
    let password = form.elements["password"].value;

    // Validate the fields
    if (!email || !password) {
        alert("Please fill out all fields");
        return; 
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return; 
    }

    // Send a POST request to the server
    try {
        const response = await fetch('/patients/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successfully! ID: ' + data.id);
            form.reset(); 
        } else {
            const errorMessage = await response.text();
            alert('Login failed: ' + errorMessage);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred during login. Please try again.');
    }
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", validateLoginForm);


// Registration form
async function validateRegistrationForm(event) {
    event.preventDefault();

    let form = document.getElementById('registrationForm');
    let firstName = form.elements["first_name"].value;
    let lastName = form.elements["last_name"].value;
    let email = form.elements["email"].value;
    let password = form.elements["password"].value;
    let phone = form.elements["phone"].value;
    let dateOfBirth = form.elements["date_of_birth"].value;
    let gender = form.elements["gender"].value;
    let address = form.elements["address"].value;
    let country = form.elements["country"].value;
    let termsAccepted = form.elements["terms"].checked;

    // Validate the data
    if (!firstName || !lastName || !email || !password || !phone || !dateOfBirth || !gender || !address || !country) {
        alert('All fields are required');
        return; 
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate phone number format (simple validation)
    const phoneRegex = /^[0-9]{10,15}$/; // Adjusted for flexibility
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number (10 to 15 digits).');
        return;
    }

    // Check if terms were accepted
    if (!termsAccepted) {
        document.getElementById('termsError').innerText = 'You must accept the terms and conditions.';
        return;
    } else {
        document.getElementById('termsError').innerText = '';
    }

    // Send a POST request to the server
    try {
        const response = await fetch('/patients/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                phone,
                date_of_birth: dateOfBirth,
                gender,
                address,
                country
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Registered successfully! ID: ' + data.id);
            form.reset(); 
        } else {
            const errorMessage = await response.text();
            alert('Registration failed: ' + errorMessage);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

// Event listener for registration form submission
document.getElementById('registrationForm').addEventListener("submit", validateRegistrationForm);


// Admin page - Add New Doctor
document.getElementById('add-doctor-form').addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear previous error messages
    clearErrors();

    // Capture data from the form fields
    let form = event.target;
    let fields = {
        firstName: form.elements["first_name"].value,
        lastName: form.elements["last_name"].value,
        specialization: form.elements["specialization"].value,
        email: form.elements["email"].value,
        phone: form.elements["phone"].value,
        scheduledDate: form.elements["scheduled_date"].value
    };

    // Validate fields
    let isValid = validateFields(fields);
    if (!isValid) return; // Exit if validation fails

    // Send POST request
    try {
        const response = await fetch('/doctors', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(fields)
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        alert('New doctor added successfully: ' + JSON.stringify(data));
        form.reset();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        alert('An error occurred while adding the doctor. Please try again.');
    }
});

// Function to validate fields
function validateFields(fields) {
    let isValid = true;
    const errorMessages = {
        firstName: 'First name is required.',
        lastName: 'Last name is required.',
        specialization: 'Specialization is required.',
        email: 'Email is required.',
        phone: 'Phone number is required.',
        scheduledDate: 'Scheduled date is required.'
    };

    // Clear previous errors
    clearErrors();

    // Validation checks
    for (const [key, value] of Object.entries(fields)) {
        if (!value) {
            document.getElementById(`${key}Error`).innerText = errorMessages[key];
            isValid = false;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (fields.email && !emailRegex.test(fields.email)) {
        document.getElementById('emailError').innerText = 'Please enter a valid email address.';
        isValid = false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,15}$/; 
    if (fields.phone && !phoneRegex.test(fields.phone)) {
        document.getElementById('phoneError').innerText = 'Please enter a valid phone number (10 to 15 digits).';
        isValid = false;
    }

    return isValid;
}

// Function to clear previous error messages
function clearErrors() {
    document.querySelectorAll('.error').forEach(error => error.innerText = '');
}

// Doctors page search functionality
document.getElementById('doctor-search').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const doctors = document.querySelectorAll('.doctor-item');

    doctors.forEach(doctor => {
        const name = doctor.getAttribute('data-name').toLowerCase();
        const specialization = doctor.getAttribute('data-specialization').toLowerCase();

        if (name.includes(searchValue) || specialization.includes(searchValue)) {
            doctor.style.display = '';
        } else {
            doctor.style.display = 'none';
        }
    });
});