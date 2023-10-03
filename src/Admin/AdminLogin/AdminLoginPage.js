// import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './AdminLoginPage.css'
import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';


function AdminLoginPage() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both email and password.");
      return;}

    
    try {
      const response = await fetch(`http://localhost:8000/admin?username=${username}`);
      const userData = await response.json();

      if (userData.length === 0) {
        setError("User not found. Please check your username.");
      } if (userData[0].password === password) {
        // Password matches, log the user 
        alert("Login successful!");
        navigate('/admin-page')
        
      } 
      else {
        setError("Incorrect password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while logging in.");
      console.error("Error:", error);
    }
  };



  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const navigate = useNavigate();

  // const handlSubmit = (e)=>{
  //   e.preventDefault();
  //   if(validate){
  //     fetch("http://localhost:8000/admin/"+ username)
  //     .then((res)=>{
  //       return res.json();
  //     }).then((resp)=>{
  //       if(Object.keys(resp).length===0){
  //         toast.error('please Enter valid user name')
  //       }
  //     }).catch((err)=>{
  //       console.log("error")
  //     })
  //   }
  // }
  // const validate = () => {
  //   let result = true;
  //   if (username === '' || username === null) {
  //       result = false;
  //   }
  //   if (password === '' || password === null) {
  //     result = false;
  // }
  // return result
  // }





  // useEffect(()=>{
    
  // })
  // const handlSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     const response = await axios.post("http://localhost:8000/admin/", {
  //       username,
  //       password,
  //     });
  //     if (response.status === 200) {
  //       // Authentication successful
  //       navigate("/admin-page"); // Navigate to admin dashboard
  //     } else {
  //       setError("Invalid username or password. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setError("An error occurred while logging in.");
  //   }
  // };
  


  return (
    <div className='container-fluid'>
      
      <div className="container-fluid">
            <form className="mx-auto" onSubmit={handlSubmit}>
                <h4 className="text-center">Admin Login</h4>
                <div className="mb-3 mt-5">
                  <label for="exampleInputEmail1" className="form-label">User Email</label>
                  <input type="email"  value={username} className="form-control" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label for="exampleInputPassword1" className="form-label">Password</label>
                  <input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)}/>
                  {error && <p className="error text-danger" >{error}</p>}                 
                </div>
                <div id="emailHelp" className="form-text mt-3"><Link to='/admin-register'>Register here</Link> </div>
                <button type="submit" className="btn btn-primary mt-5">Login</button>
              </form>
              </div>
    </div>
  )
}

export default AdminLoginPage