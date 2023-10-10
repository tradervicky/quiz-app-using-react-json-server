// import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './UserLogin.css'
import { Link } from 'react-router-dom';
// import { useEffect } from 'react';
import { toast } from 'react-toastify';


function UserLogin() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const [name, setName] = useState("")

  const handlSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both email and password.");
      return;}

    // Make a GET request to fetch user data from the JSON server
    try {
      const response = await fetch(`http://localhost:8000/users?username=${username}`);
      const userData = await response.json();
      if (userData.length === 0) {
        setError("User not found. Please check your username.");
      } if (userData[0].password === password) {
        // Password matches, log the user in (you can set a session or token here)
         // Show a success toast notification
      toast.success("Login successfully!", {
        position: "top-right",
        autoClose: 3000, // Auto close the notification after 3 seconds
      });
        navigate(`/user-dashboard?username=${username}`)
        
      } 
      else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      console.error("Error:", error);
    }
  };

  return (
    <div className='container-fluid'>
      
      <div className="container-fluid">
            <form className="mx-auto" onSubmit={handlSubmit}>
                <h4 className="text-center">User Login</h4>
                <div className="mb-3 mt-5">
                  <label for="exampleInputEmail1" className="form-label">User Email</label>
                  <input type="email"  value={username} className="form-control" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">Password</label>
                  <input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)}/>
                  {error && <p className="error text-danger" >{error}</p>}                 
                </div>
                <div id="emailHelp" className="form-text mt-3"><Link to='/user-register'>Register here</Link> </div>
                <button type="submit" className="btn btn-primary mt-5" >Login</button>
              </form>
              </div>
    </div>
  )
}

export default UserLogin