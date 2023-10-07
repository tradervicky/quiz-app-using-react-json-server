import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import { toast } from "react-toastify";


function DeleteCategory() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(" http://localhost:8000/category");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedQuiz) {
      console.error("Please select a quiz to delete.");
      return;
    }

    try {
      const response = await axios.delete(
        ` http://localhost:8000/category/${selectedQuiz.id}`
      );
      toast.success("category Deleted!", {
        position: "top-right",
        autoClose: 3000, // Auto close the notification after 3 seconds
      });
      console.log("Quiz category deleted successfully:", response.data);
      //toast
      // toast.success("Category deleted successfully", {
      //   position: "top-right",
      //   autoClose: 2000, // Automatically close the toast after 2 seconds
      //   hideProgressBar: false,
      // });
      // Clear the selected quiz
      setSelectedQuiz(null);
      // Refresh the quiz list
      fetchQuizzes();
    } catch (error) {
      console.error("Error deleting quiz category:", error);
    }
  };

  return (
    <div className="container m-auto">
      <form className="mx-auto">
      <h3>Categories</h3>
      <ol>
        {quizzes.map((quiz) => (
          <a href="#" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
          <li
            key={quiz.id}
            onClick={() => setSelectedQuiz(quiz)}
            className={selectedQuiz === quiz ? "selected" : ""}
          >
            {quiz.name}
          </li>
          </a>
        ))}
      </ol>
      <div>
        <h3>Click for select</h3>
        {selectedQuiz && (
          <div>
            <p className="text-danger">Selected Quiz: {selectedQuiz.category}</p>
            <button className="btn btn-primary mt-5" onClick={handleDeleteCategory}>Delete Category</button>
            <Link to='/read-category'> <button className="btn btn-primary mt-5" >Back</button></Link>
          </div>
        )}
      </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default DeleteCategory;