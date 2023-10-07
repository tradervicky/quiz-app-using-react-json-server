import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {Link} from "react-router-dom"

function QuizQuestionCreate() {
  const [quizData, setQuizData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null); // For single-choice questions
  const [correctAnswers, setCorrectAnswers] = useState([]); // For multiple-choice questions
  const [questionType, setQuestionType] = useState("single");

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/category");
      setQuizData(response.data);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCorrectAnswerChange = (index) => {
    if (questionType === "single") {
      // For single-choice questions, set the correct answer directly
      setCorrectAnswer(index);
    } else {
      // For multiple-choice questions, toggle the correct answers
      const currentCorrectAnswers = [...correctAnswers];
      if (currentCorrectAnswers.includes(index)) {
        currentCorrectAnswers.splice(currentCorrectAnswers.indexOf(index), 1);
      } else {
        currentCorrectAnswers.push(index);
      }
      setCorrectAnswers(currentCorrectAnswers);
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedCategory || !questionText || options.includes("")) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const newQuestion = {
      type: questionType,
      catId: selectedCategory.id,
      text: questionText,
      options,
      correctAnswer: questionType === "single" ? options[correctAnswer] : correctAnswers.map((index) => options[index]),
    };
  
    try {
      const response = await axios.post("http://localhost:8000/questions", newQuestion);
      console.log("Question added successfully:", response.data);
  
      // Clear form fields
      setSelectedCategory(null);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
      setCorrectAnswers([]);
      setQuestionType("single");
  
      // Show a success toast notification
      toast.success("Question added successfully!", {
        position: "top-right",
        autoClose: 3000, // Auto close the notification after 3 seconds
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };
  

  return (
    <div className='container-fluid '>
      <form className="mx-auto mt-1 ">
      <h3>Create New Question</h3>
      <div>
        <label htmlFor="categorySelect">Select Category</label>
        <select
        className="form-select form-select-lg mb-3"
          id="categorySelect"
          onChange={(e) => setSelectedCategory(quizData.find((category) => category.id === parseInt(e.target.value)))}
        >
          <option value="">Select Category</option>
          {quizData.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="questionText">Question Text</label>
        <input
        className="form-control"
          type="text"
          id="questionText"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <div>
        <label>Question Type</label>
        <div>
          <label>
            Single Choice
            <input
              type="radio"
              value="single"
              checked={questionType === "single"}
              onChange={() => setQuestionType("single")}
            />
          </label>
          <label className="p-2">
            Multiple Choice
            <input
            
              type="radio"
              value="multiple"
              checked={questionType === "multiple"}
              onChange={() => setQuestionType("multiple")}
            />
          </label>
        </div>
      </div>
      <div>
        <label>Options</label>
        {options.map((option, index) => (
          <div key={index}>
            <input
              className="form-control"
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
            {questionType === "multiple" ? (
              <input
                type="checkbox"
                checked={correctAnswers.includes(index)}
                onChange={() => handleCorrectAnswerChange(index)}
              />
            ) : (
              <input
                type="radio"
                checked={correctAnswer === index}
                onChange={() => handleCorrectAnswerChange(index)}
              />
            )}
          </div>
        ))}
        {options.length < 4 && (
          <button onClick={handleAddOption}>Add Option</button>
        )}
      </div>
      <button onClick={handleCreateQuestion} className="btn btn-primary mt-2">Create Question</button>
      <Link to='/quiz-questions'><button  className="btn btn-primary mt-2">Back</button></Link>

      </form>
    </div>
  );
}

export default QuizQuestionCreate;
