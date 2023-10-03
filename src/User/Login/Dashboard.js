import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; 
function Dashboard() {
    
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState(5); 
  
    
    useEffect(() => {
      axios
        .get("http://localhost:8000/quizzes") 
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    }, []);
  

    const handleCategoryChange = (e) => {
      setSelectedCategory(e.target.value);
      console.log(selectedCategory)
    };
  
    const handleTypeChange = (e) => {
      setSelectedType(e.target.value);
    };
  

    const handleStartQuiz = () => {

    };
  
    return (
      <div className="container">
        <h2>Welcome to the Quiz Dashboard</h2>
        <div>
          <h3>Quiz Settings</h3>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select Category:
            </label>
            <select
              id="category"
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Select Type:
            </label>
            <select
              id="type"
              className="form-select"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="">Select a type</option>
              <option value="single">single</option>
              <option value="multiple">multiple</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="numberOfQuestions" className="form-label">
              Number of Questions:
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              className="form-control"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            />
          </div>
          
          <Link to={`/start-quiz?selectedCategory=${selectedCategory}&selectedType=${selectedType}&numberOfQuestions=${numberOfQuestions}`}>
          <button className="btn btn-primary" onClick={handleStartQuiz}>
            Start Quiz
          </button></Link>
          
          <Link to="/"><button className="btn btn-warning mt-3">Quit Quiz</button></Link>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  