import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";


function CreateCategory() {
    // const [quizCategory, setQuizCategory] = useState("");
    
    // const [error, setError] = useState("");
    // const [success, setSuccess] = useState("");

    // const navigate = useNavigate();
    
    
    
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
  
      
    //   if (!quizCategory) {
    //     setError("Please enter Category.");
    //     return;
    //   }
  
     
    //   try {
    //     const response = await fetch("http://localhost:8000/quizzes", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({quizCategory }),
    //     });
    //     console.log("proceed")
    //     if (response.status === 201) {

    //       // Category added successful
    //       setSuccess("Category Added successfully.");

    //       setQuizCategory(""); 
          
    //       navigate('/admin-page')
    //     } else if (response.status === 409) {
    //       setError("Category already exists. Please choose a different Category.");
    //     } else {
    //       setError("Category added failed. Please try again.");
    //     }
    //   } catch (error) {
    //     setError("An error occurred while registering.");
    //     console.error("Error:", error);
    //   }
    // };

    const [newCategory, setNewCategory] = useState("");
    const navigate = useNavigate();

    const handleAddCategory = (e) => {
      e.preventDefault()
      //  JSON server endpoint for category creation
      const apiUrl = "http://localhost:8000/quizzes"; 
  
      // Create a new category object
      const categoryData = { category: newCategory };
  
      // Send a POST request to add the new category
      axios
        .post(apiUrl, categoryData)
        .then((response) => {
          alert("Category added:", response.data);
          navigate('/admin-page')
          setNewCategory(""); // Clear the input field
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle any errors and show an error message if needed
        });
    };




  return (
    <div classNameName='container-fluid '>
      <form className="mx-auto" >
    <h2 className="text-center">Add New Category</h2>
      <input
      className="form-control"
        type="text"
        placeholder="Category Name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button className="btn btn-primary mt-5" onClick={handleAddCategory}>Add Category</button>
      <Link to='/read-category'><button className="btn btn-primary mt-5">Read Category</button></Link>
      <Link to='/admin-page'><button className="btn btn-primary mt-5">Back</button></Link>

      </form>
    </div >
    // <div classNameName='container-fluid'>
      
    //   <div className="container-fluid">
    //         <form className="mx-auto" onSubmit={handleSubmit}>
    //             <h4 className="text-center">New Category </h4>
    //             <div className="mb-3 mt-5">
    //               <label for="exampleInputEmail1" className="form-label">Enter New Category</label>
    //               <input type="text" className="form-control" onChange={(e) => setQuizCategory(e.target.value)} />
    //             </div>
    //             <div><button type="submit" className="btn btn-primary mt-5">Submit</button>
    //            <Link to='/admin-page'><button className="btn btn-primary mt-5">Back</button></Link> 
    //             </div>
    //           
    //           </div>
    // </div>
  )
}

export default CreateCategory