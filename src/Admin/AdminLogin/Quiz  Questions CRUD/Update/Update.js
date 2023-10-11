import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams,Link } from "react-router-dom";
import { toast } from "react-toastify";


function Update({ match }) {
  const [searchParams] = useSearchParams();
  const questionId = parseInt(searchParams.get("selectdId"));

  const [questionData, setQuestionData] = useState({
    text: "",
    options: [],
    correctAnswer: [], // Use an array to store correct answers
  });

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
    const selectedValue = e.target.value;
    const currentCorrectAnswer = questionData.correctAnswer;
  
    if (currentCorrectAnswer.includes(selectedValue)) {
      // If it's already selected, remove it from the array
      const updatedCorrectAnswer = currentCorrectAnswer.filter(
        (value) => value !== selectedValue
      );
  
      // Check if it's the last checkbox and is being unchecked
      if (questionData.options.length === 1 && updatedCorrectAnswer.length === 0) {
        // Do nothing, allow unselection
      } else {
        setQuestionData({
          ...questionData,
          correctAnswer: updatedCorrectAnswer,
        });
      }
    } else {
      // If it's not selected, add it to the array
      const updatedCorrectAnswer = [...currentCorrectAnswer, selectedValue];
  
      setQuestionData({
        ...questionData,
        correctAnswer: updatedCorrectAnswer,
      });
    }
  };
  
  
  const isAtLeastOneCorrectAnswerSelected = questionData.correctAnswer.length > 0;
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!isAtLeastOneCorrectAnswerSelected) {
      // Display an error message if no correct answers are selected
      toast.error("At least one correct answer must be selected", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
  
    // Send a PUT request to update the question
    axios
      .put(`http://localhost:8000/questions/${questionId}`, questionData)
      .then((response) => {
        // Handle success and provide feedback to the admin
  
        toast.success("Updated successfully!", {
          position: "top-right",
          autoClose: 3000, // Auto close the notification after 3 seconds
        });
  
        // console.log("Question updated successfully");
      })
      .catch((error) => {
        console.error("Error updating question:", error);
        // Handle errors and display error messages
      });
  };
  

  return (
    <div className="container-fluid">
        <form onSubmit={handleSubmit} className="mx-auto mt-5">
      <h1>Update Question</h1>
      
        <div>
          <label>Question Text:</label>
          <textarea 
            className="form-control"
            name="text"
            value={questionData.text}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Options:</label><br />
          {questionData.options.map((option, index) => (
            <input
              className="form-control"
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(e, index)}
            />
          ))}
        </div>
        <div>
          <label>Correct Answer:</label>
          {questionData.options.map((option, index) => (
            <div key={index}>
              {questionData.options.length > 1 ? (
                <input
                  type="checkbox"
                  value={option}
                  checked={questionData.correctAnswer.includes(option)}
                  onChange={handleCorrectAnswerChange}
                />
              ) : (
                <input
                  type="radio"
                  value={option}
                  checked={questionData.correctAnswer[0] === option}
                  onChange={handleCorrectAnswerChange}
                />
              )}
              {option}
            </div>
          ))}
        </div>

         <button type="submit" className="btn btn-primary mb-2 mt-2">Update Question</button>
        <Link to={'/read-quiz-questions'}><button className="btn btn-warning align-self-center" >
        Back
      </button></Link>

      </form>
    </div>
  );
}

export default Update;
