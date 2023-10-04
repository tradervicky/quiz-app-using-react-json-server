import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function StartQuiz() {
  const [searchParams, setSearchParams ]= useSearchParams();
  const selectedCategory= (searchParams.get('selectedCategory'));
  console.log(selectedCategory)
  const selectedType = (searchParams.get('selectedType'));
  const numberOfQuestions = (searchParams.get('numberOfQuestions'));

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  useEffect(() => {
    fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
  }, [selectedCategory, selectedType, numberOfQuestions]);

  const fetchQuestions = async (category, type, numberOfQuestions) => {
    try {
      const apiUrl = `http://localhost:8000/quizzes`;
      const response = await axios.get(apiUrl);
      //logic 
      setQuestions(response.data);     
    } catch (error) {
      console.error("Error fetching questions:", error);
      
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[selectedCategory];
  console.log(currentQuestion)

  return (
    <div>
      <h2>Start Quiz</h2>
      { questions.length > 0 && currentQuestion ? (
        <div>
          <h3>Question {currentQuestionIndex + 1}</h3>
          <p>{currentQuestion.text}</p>
          <ul>
            {currentQuestion.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
          <button onClick={handleNextQuestion}>Next Question</button>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
}

export default StartQuiz;







// import axios from 'axios';
// import React from 'react'
// import { useState } from 'react';
// import { useEffect } from 'react'
// import {Link} from 'react-router-dom'

// function StartQuiz() {
//   const [userName, setUserName] = useState("");
//   useEffect(()=>{
//     fetchUserName();
//   },[])
//   const fetchUserName = async () => {
//     try {
//       const response = await axios.get("  http://localhost:8000/users");
//       setUserName(response.data.name);
//     } catch (error) {
//       console.error("Error fetching user name:", error);
//     }
//   };
//   const fetchUserData = async (userId) => {
//     try {
//       const response = await axios.get('http://localhost:8000/users')
//       setUserName(response.data.name);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   return (
//     <div className="card mx-auto mt-5" style={{width:"40%"}}>
//   <div className="card-body">
//     <h5 className="card-title text-center">Welcome {}</h5>
//     <p className="card-text">Question</p>
//   </div>
//   <ul className="list-group list-group-flush">
//     <li className="list-group-item">An item</li>
//     <li className="list-group-item">A second item</li>
//     <li className="list-group-item">A third item</li>
//     <li className="list-group-item">A Fourth item</li>

//   </ul>
//   <div className="card-body d-flex justify-content-between">
//   <Link to='/'><button className="btn btn-danger">Quit</button></Link>
//   <button className="btn btn-success">Next</button>
//   </div>
// </div>
// )}

// export default StartQuiz