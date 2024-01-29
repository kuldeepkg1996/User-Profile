import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './signup.css';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState(""); // State for warning message
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const collectData = async () => {
        // Basic validation
        if (!name || !email || !password) {
            setWarning("*All fields are required.");
            return;
        }

        try {
            let result = await fetch("http://localhost:8000/register", {
                method: 'post',
                body: JSON.stringify({ name, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!result.ok) {
                console.error(`Error: ${result.status} - ${result.statusText}`);
                return;
            }

            // result = await result.json();
            // console.warn("Successfully registered");
            // localStorage.setItem("user", JSON.stringify(result.result));
            // localStorage.setItem("token", JSON.stringify(result.auth));

            navigate('/login');
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    return (
        <div className="register">
            <h1>Register</h1>
            {warning && <p  style={{color:"red"}} className="warning">{warning}</p>}
            <input
                className="inputBox2"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="inputBox2"
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="inputBox2"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={collectData}
                className="appButton"
                type="button"
            >
                Sign Up
            </button>
        </div>
    );
};

export default SignUp;
