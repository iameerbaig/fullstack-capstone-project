import React, { useEffect, useState } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {

    // Create useState hook variables for email, password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Task 1: Include a state for the error message.
    const [incorrect, setIncorrect] = useState('');

    // Task 2: Create local variables for `navigate` and `setIsLoggedIn`.
    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('auth-token'); // Get the bearer token from session storage, if any
    const { setIsLoggedIn } = useAppContext();

    // Task 3: If the user is already logged in, go straight to the main page.
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

    // Create handleLogin function and include console.log
    const handleLogin = async () => {
        try {
            // Task 4: Make a POST call to the backend login API, with the bearer token when there is one.
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    ...(bearerToken ? { 'Authorization': `Bearer ${bearerToken}` } : {}),
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            // Task 5: Access the data coming from the fetch API.
            const json = await response.json();

            if (json.authtoken) {
                // Task 6: Set the user details in session storage.
                sessionStorage.setItem('auth-token', json.authtoken);
                sessionStorage.setItem('name', json.userName);
                sessionStorage.setItem('email', json.userEmail);

                // Task 7: Set the login status to true and go to the main page.
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                // Task 8: Clear the fields and show the error message.
                setEmail('');
                setPassword('');
                setIncorrect(json.error || 'Login failed. Try again.');
                setTimeout(() => {
                    setIncorrect('');
                }, 2000);
            }
        } catch (e) {
            console.log("Error fetching details: " + e.message);
            setIncorrect('Could not reach the server. Please try again.');
        }
    };

        return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="login-card p-4 border rounded">
              <h2 className="text-center mb-4 font-weight-bold">Login</h2>

          {/* Create input elements for the variables email and password */}
          <div className="mb-4">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="text"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
            {/* Display the error message, if any */}
            {incorrect && <span style={{color:'red',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{incorrect}</span>}
          </div>

          {/* Create a button that performs the `handleLogin` function on click */}
          <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>

                <p className="mt-4 text-center">
                    New here? <a href="/app/register" className="text-primary">Register Here</a>
                </p>

            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
