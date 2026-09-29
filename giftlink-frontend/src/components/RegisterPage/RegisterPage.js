import React, { useState } from 'react';

import './RegisterPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {

    // Create useState hook variables for firstName, lastName, email, password
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 1: Include a state for error message.
    const [showerr, setShowerr] = useState('');

    // Task 2: Create a local variable for `navigate` and `setIsLoggedIn`.
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAppContext();

    // Create handleRegister function and include console.log
    const handleRegister = async () => {
        try {
            // Task 3: Make a POST call to the backend register API with the form values.
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                }),
            });

            // Task 4: Access the data coming from the fetch API.
            const json = await response.json();

            if (json.authtoken) {
                // Task 5: Set user details in session storage.
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', firstName);
                sessionStorage.setItem('email', json.email);

                // Task 6: Set the user's login status to true and redirect to the main page.
                setIsLoggedIn(true);
                navigate('/app');
            }

            if (json.error) {
                // Task 7: Set an error message if the registration fails.
                setShowerr(json.error);
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setShowerr('Could not reach the server. Please try again.');
        }
    };

         return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="register-card p-4 border rounded">
                            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

                    {/* Create input elements for all the variables - firstName, lastName, email, password */}
                    <div className="mb-4">
                        <label htmlFor="firstName" className="form-label">FirstName</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="lastName" className="form-label">LastName</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-control"
                            placeholder="Enter your lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="text"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setShowerr('');
                            }}
                        />
                        {/* Task 8: Display an error message below the email input, if any. */}
                        {showerr && <div className="text-danger">{showerr}</div>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Create a button that performs the `handleRegister` function on click */}
                    <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

                        <p className="mt-4 text-center">
                            Already a member? <a href="/app/login" className="text-primary">Login</a>
                        </p>

                         </div>
                    </div>
                </div>
            </div>

         )//end of return
}

export default RegisterPage;
