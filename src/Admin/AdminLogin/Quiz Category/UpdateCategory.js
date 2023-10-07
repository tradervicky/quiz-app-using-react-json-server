import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function UpdateCategory() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/category");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedQuiz || !updatedCategory) {
      console.error("Please select a quiz and provide a new category.");
      return;
    }

    const updatedQuiz = {
      ...selectedQuiz,
      name: updatedCategory,
    };

    try {
      const response = await axios.put(
        `http://localhost:8000/category/${selectedQuiz.id}`,
        updatedQuiz
      );
      console.log("Quiz category updated successfully:", response.data);
      // Clear the selected quiz and updated category
      setSelectedQuiz(null);
      setUpdatedCategory("");
      // Refresh the quiz list
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz category:", error);
    }
  };

  return (
    <div className="container m-auto">
      <form className="mx-auto">
        <h3>Categories</h3>
        <ol>
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz)}
              className={selectedQuiz === quiz ? "selected" : ""}
            >
              {quiz.name}
            </li>
          ))}
        </ol>
        <div>
          <h3>Click to Update</h3>
          {selectedQuiz && (
            <div>
              <p>Selected Quiz: {selectedQuiz.name}</p>
              <input
                type="text"
                className="form-control"
                placeholder="New Category"
                value={updatedCategory}
                onChange={(e) => setUpdatedCategory(e.target.value)}
              />
              <button
                className="btn btn-primary mt-3"
                onClick={handleUpdateCategory}
              >
                Update Category
              </button>
              <Link to="/read-category">
                <button className="btn btn-primary mt-3">Back</button>
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default UpdateCategory;
