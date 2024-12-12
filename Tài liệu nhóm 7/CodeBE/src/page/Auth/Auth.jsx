import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signUp, logIn } from "../../actions/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Auth.css";
import logo from "../../ass/stack-overflow.png";
import AboutAuth from "./AboutAuth";
import axiosClient from "../../api/axiosClient";


const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSwitch = () => {
        setIsSignUp(!isSignUp);
    };
    const userData = {
        username: name,
        email: email,
        passwordRaw: password,
        reputation: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password || (isSignUp && !name)) {
          toast.error("Please fill out all required fields");
          return;
        }
      
        if (isSignUp) {
          dispatch(signUp(userData, navigate));
        } else {
          try {
            const response = await dispatch(logIn({ email, passwordRaw: password }, navigate));
            if (response && response.data && response.data.result && response.data.result.token) {
              toast.success("Login successful");
              navigate('/');
              console.log("Stored refreshToken:", localStorage.getItem("refreshToken"));  
              console.log("Stored token:", localStorage.getItem("token"));
              const response = await axiosClient.post("/authen/login", userData);
console.log("Login API Response:", response.data);

            }
          } catch (error) {

          }
        }
      };
      

    return (
        <section className="Auth-section">
            {isSignUp && <AboutAuth />}
            <div className="auth-container-2">
                {!isSignUp && <Link to="/"><img src={logo} alt="StackOverflow" className="login-logo" width="65px" /></Link>}
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <label htmlFor="name">
                            <h4>Display Name</h4>
                            <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} />
                        </label>
                    )}
                    <label htmlFor="email">
                        <h4>Email</h4>
                        <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                    </label>
                    <label htmlFor="password">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <h4>Password</h4>
                            {!isSignUp && <p style={{ color: "#007ac6", fontSize: "13px" }}>forgot password</p>}
                        </div>
                        <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type="submit" className="auth-btn">{isSignUp ? "Sign Up" : "Login"}</button>
                    <p>
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button type="button" className="handle-switch-btn" onClick={handleSwitch}>{isSignUp ? "Log In" : "Sign Up"}</button>
                    </p>
                </form>
            </div>
          
        </section>
    );
};

export default Auth;
