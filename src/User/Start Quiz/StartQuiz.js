import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function StartQuiz() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("selectedCategory");
  const selectedType = searchParams.get("selectedType");
  const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
  const nameLogin = searchParams.get("nameLogin");
  const UserName = searchParams.get("UserName");
  const navigate = useNavigate();

  const userId = parseInt(searchParams.get("userId"));
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  useEffect(() => {
    // Fetch user's attempted questions
    axios.get(`http://localhost:8000/users/${userId}`)
      .then((res) => {
        setAnsweredQuestions(res?.data?.AttemptedQue || []);
      })
      .catch((error) => {
        console.error("Error fetching user's attempted questions", error);
      });
  }, [userId]);

  useEffect(() => {
    // Fetch questions and initialize the quiz
    fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
  }, [selectedCategory, selectedType, numberOfQuestions]);

  useEffect(() => {
    // Timer logic
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else if (currentQuestionIndex === questions.length - 1) {
        // Automatically submit the test when the timer ends on the last question
        submitTest();
      } else {
        handleNextQuestion();
      }
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer, currentQuestionIndex, questions]);

  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
    localStorage.setItem("timer", timer.toString());
  }, [currentQuestionIndex, timer]);

  const fetchQuestions = async (category, type, numQuestions) => {
    try {
      const allQuestionsResponse = await axios.get(`http://localhost:8000/questions`);
      const allQuestions = allQuestionsResponse.data;
      const userResponse = await axios.get(`http://localhost:8000/users/${userId}`);
      const userHistory = userResponse.data?.AttemptedQue || [];

      const unansweredQuestions = allQuestions.filter((question) =>
        question.catId === parseInt(category) &&
        question.type === type &&
        !userHistory.includes(question.id)
      );

      if (unansweredQuestions.length < numQuestions) {
        console.log("Not enough unanswered questions.");
        return;
      }

      const shuffledQuestions = shuffleArray(unansweredQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, numQuestions);

      setIsMultipleChoice(type === "multiple");
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleOptionSelect = (option) => {
    if (isMultipleChoice) {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.includes(option)
          ? prevSelectedOptions.filter((item) => item !== option)
          : [...prevSelectedOptions, option]
      );
    } else {
      setSelectedOptions([option]);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];



  const handleNextQuestion = () => {
    if (currentQuestion) {
      const isCorrect = selectedOptions.every((option) =>
        currentQuestion.correctAnswer.includes(option)
      );
  
      if (isCorrect && timer !== 0) {
        setScore(score + 1);
        localStorage.setItem("score", score + 1);
      }
  
      const currentQuestionId = currentQuestion.id;
  
      if (!answeredQuestions.includes(currentQuestionId)) {
        // Only add the ID if it's not already in the array
        setAnsweredQuestions([...answeredQuestions, currentQuestionId]);
        // Update the user's attempted questions
        axios
          .get(`http://localhost:8000/users/${userId}`)
          .then((response) => {
            if (response.data) {
              const user = response.data;
              user.AttemptedQue = [...answeredQuestions, currentQuestionId];
              
              axios
                .put(`http://localhost:8000/users/${userId}`, user)
                .then((updateResponse) => {
                  if (updateResponse.data.success) {
                    console.log("User's attempted questions updated successfully");
                  } else {
                    console.error("Failed to update user's attempted questions");
                  }
                })
                .catch((error) => {
                  console.error("Error updating user's attempted questions", error);
                });
            } else {
              console.error("User not found");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data", error);
          });
      }
  
      setUserAnswers([...userAnswers, selectedOptions]);
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOptions([]);
        setTimer(30);
      } else {
        // If it's the last question, navigate to the score page
        navigate(
          `/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`
        );
      }
    }
  };
  
  
  

  const submitTest = () => {
    localStorage.clear();
    navigate(`/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`);
  };

  return (
    <div className="container mt-5">
      {questions.length > 0 && currentQuestion ? (
        <div className="card">
          <div className="card-body">
            <div className="text-center mt-3">
              <span className="badge bg-primary">Timer: {timer}s</span>
            </div>
            <h5 className="card-title">
              Question {currentQuestionIndex + 1}
            </h5>

            <p className="card-text">{currentQuestion.text}</p>
            <div>
              {currentQuestion.options.map((option, index) => (
                <label key={index} className="form-check">
                  {isMultipleChoice ? (
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  ) : (
                    <input
                      type="radio"
                      className="form-check-input"
                      value={option}
                      checked={selectedOptions.includes(option)}
                      onChange={() => handleOptionSelect(option)}
                    />
                  )}
                  <span className="form-check-label">{option}</span>
                </label>
              ))}
            </div>

            
              
              <button
                className="btn btn-primary mt-3"
                onClick={handleNextQuestion}
                disabled={isMultipleChoice ? false : !selectedOptions.length}
              >
                {currentQuestionIndex === questions.length - 1 ? "submit": "Next Question"}
              </button>
            
          </div>
        </div>
      ) : (
        <h3 className="text-center " style={{ color: "white" }}>
          No questions available. <br /> <span> Try Other Combination <br /> or select fewer questions</span>
        </h3>
      )}
    </div>
  );
}

export default StartQuiz;



