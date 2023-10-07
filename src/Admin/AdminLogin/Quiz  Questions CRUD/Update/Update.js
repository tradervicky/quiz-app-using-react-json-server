import React, { useState, useEffect } from "react";
import axios from "axios";

function Update({ match }) {
  const [questionData, setQuestionData] = useState({
    text: "",
    options: [],
    correctAnswer: [],
  });

  const questionId = match.params.id; // Assuming you have a route parameter for the question ID

  useEffect(() => {
    // Fetch existing question data for the specified question ID
    axios
      .get(`http://localhost:8000/questions/${questionId}`)
      .then((response) => {
        setQuestionData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching question:", error);
      });
  }, [questionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...questionData.options];
    updatedOptions[index] = e.target.value;

    setQuestionData({
      ...questionData,
      options: updatedOptions,
    });
  };

  const handleCorrectAnswerChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    setQuestionData({
      ...questionData,
      correctAnswer: selectedOptions,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Send a PUT request to update the question
    axios
      .put(`http://localhost:8000/questions/${questionId}`, questionData)
      .then((response) => {
        // Handle success and provide feedback to the admin
        console.log("Question updated successfully");
      })
      .catch((error) => {
        console.error("Error updating question:", error);
        // Handle errors and display error messages
      });
  };

  return (
    <div>
      <h1>Update Question</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question Text:</label>
          <textarea
            name="text"
            value={questionData.text}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Options:</label>
          {questionData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(e, index)}
            />
          ))}
        </div>
        <div>
          <label>Correct Answer:</label>
          <select
            multiple
            value={questionData.correctAnswer}
            onChange={handleCorrectAnswerChange}
          >
            {questionData.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Update Question</button>
      </form>
    </div>
  );
}

export default Update;
