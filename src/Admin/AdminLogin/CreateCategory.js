import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";


function CreateCategory() {

    const [newCategory, setNewCategory] = useState("");
    // console.log(newCategory)
    const navigate = useNavigate();

    const handleAddCategory = (e) => {
      e.preventDefault()
      const apiUrl = " http://localhost:8000/category"; 
      //  new category object
      const categoryData = { name: newCategory };
  
      // post request send 
      axios
        .post(apiUrl, categoryData)
        .then((response) => {
          alert("Category added:", response.data);
          navigate('/admin-page')
          setNewCategory(""); 
        })
        .catch((error) => {
          console.error("Error:", error);
          
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
  )
}

export default CreateCategory