import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // Define selectedType state variable

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:8000/quizzes")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);

    // Find the selected category
    const selectedCategoryObject = categories.find(
      (category) => category.category === e.target.value
    );

    // Extract 'type' properties from questions and set in state
    const types =
      selectedCategoryObject?.questions?.map((question) => question.type) || [];
    
    console.log(types); // Log the question types to the console

    setQuestionTypes(types);
    setSelectedType(""); // Clear the selected type when the category changes
  };

  return (
    <div className="container-fluid">
      <form className="mx-auto">
        <h3 className="text-center">Welcome</h3>
        <h4 className="text-center bold">Quiz Settings</h4>
        <div>
          <label htmlFor="category">Quiz Category</label>
          <select
            name="category"
            className="form-select form-select-lg mb-3"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="">Select a category</option>
            {categories.map((d, index) => (
              <option value={d.category} key={index}>
                {d.category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type">Quiz Type</label>
          <select
            name="type"
            className="form-select form-select-lg mb-3"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Select a type</option>
            {questionTypes.map((type, index) => (
              <option value={type} key={index}>
                {/* {d?.questions?.map((item,index)=>{
                  console.log(item.type)
                })} */}
                {type}
              </option>
            ))}
          </select>
        </div>
        <Link to="/start-quiz">
          <button className="btn btn-primary mt-5">Start Quiz</button>
        </Link>
        <Link to="/">
          <button className="btn btn-primary mt-5">Quit Quiz</button>
        </Link>
      </form>
    </div>
  );
}

export default UserDashboard;
