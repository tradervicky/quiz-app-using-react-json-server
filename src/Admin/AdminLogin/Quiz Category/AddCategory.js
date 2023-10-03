
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';


function AddCategory() {
    const [quizCategory, setQuizCategory] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
 
  if (!quizCategory ) {
    setError("please enter category.");
    return;
  }
  
  try {
    const response = await fetch("http://localhost:8000/quizzes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quizCategory }),
    });

    if (response.status === 201) {
        
        setSuccess("New Category Added successful.");
        
        setQuizCategory(""); 
        
        navigate('/admin-page')
      }else if (response.status === 409) {
        setError("Category already exists. Please choose a different Category.");
      } else {
        setError("Please try different category.");
      }
    } catch (error) {
      setError("An error occurred while registering.");
      console.error("Error:", error);
    }
  };
    

  return (
    <div className=' d-flex w-100 vh-100 justify-content-center align-items-center'>
        <form onSubmit={handleSubmit}>
            <div>
            <label for="text" class="form-label">Category :</label>
            <input type="text" name='text' class="form-control" onChange={(e) => setQuizCategory(e.target.value)}/>
            </div><br />
            <button className='btn btn-info'>Submit</button>
            <Link to='/admin-page'><button className='btn btn-info mx-3'>Back</button></Link>
            </form>
    </div>
  )
}

export default AddCategory