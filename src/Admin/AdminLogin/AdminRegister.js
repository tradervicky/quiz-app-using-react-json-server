
// import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AdminRegister() {


    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Check if either the username or password is empty
      if (!username || !password) {
        setError("Please enter both username and password.");
        return;
      }
  
      // Make a POST request to register a new user
      try {
        const response = await fetch("http://localhost:8000/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (response.status === 201) {
          // Registration successful
          setSuccess("Registration successful. You can now log in.");
          setUsername(""); // Clear the username field
          setPassword(""); // Clear the password field
          navigate('/admin')
        } else if (response.status === 409) {
          setError("Username already exists. Please choose a different username.");
        } else {
          setError("Registration failed. Please try again.");
        }
      } catch (error) {
        setError("An error occurred while registering.");
        console.error("Error:", error);
      }
    };






//     const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const response = await axios.post("http://localhost:8000/admin/", {
//         username,
//         password,
//       });
//       if (response.status === 200) {
//         // Authentication successful
//         navigate("/admin-page"); // Navigate to admin dashboard
//       } 
//       else {
//         setError("Invalid username or password. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setError("An error occurred while logging in.");
//     }
//   };

  return (
    <div classNameName='container-fluid'>
      
      <div className="container-fluid">
            <form className="mx-auto" onSubmit={handleSubmit}>
                <h4 className="text-center">Admin Register</h4>
                <div className="mb-3 mt-5">
                  <label for="exampleInputEmail1" className="form-label">Enter User Email</label>
                  <input type="email" className="form-control" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">Enter Password</label>
                  <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)}/>
                  {error && <p className="error text-danger" >{error}</p>}                 
                </div>
                
                <div><button type="submit" className="btn btn-primary mt-5">Register</button>
               <Link to='/admin'><button className="btn btn-primary mt-5">Back</button></Link> 
                </div>
              </form>
              </div>
    </div>
  )
}

export default AdminRegister