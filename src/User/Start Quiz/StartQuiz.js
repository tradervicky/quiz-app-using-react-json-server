import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

function StartQuiz() {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("selectedCategory");
  console.log(selectedCategory)
  const selectedType = searchParams.get("selectedType");
  const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
  const nameLogin = searchParams.get("nameLogin")
  const UserName = searchParams.get("UserName")
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  // const [timer, setTimer] = useState(30); // timer value in seconds
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(
    parseInt(localStorage.getItem("timer")) || 30
  );
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
  //   parseInt(localStorage.getItem("currentQuestionIndex")) || 0
  // );
  useEffect(() => {
    fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
   
  }, [selectedCategory, selectedType, numberOfQuestions]);

  useEffect(() => {
    // Start the timer when a new question is displayed
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
        localStorage.setItem("timer", timer - 1);
      } else {
        // When the timer reaches 0, automatically move to the next question (if not the last question)
        if (currentQuestionIndex < questions.length - 1) {
          handleNextQuestion();
        }
      }
    }, 1000);

    // Clean up the timer when the component unmounts or when the question changes
    return () => {
      clearInterval(timerInterval);
    };
  }, [currentQuestionIndex, questions, timer]);

  const fetchQuestions = async (category, type, numQuestions) => {
    try {
      const apiUrl = `http://localhost:8000/questions`;
      const response = await axios.get(apiUrl);
      
      const filteredQuestions = response.data
      .filter((question) => question.catId === parseInt(category) && question.type === type);
        console.log(filteredQuestions)
      const shuffledQuestions = shuffleArray(filteredQuestions);

      setIsMultipleChoice(type === "multiple");

      const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
      setQuestions(selectedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
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
    
    setUserAnswers([...userAnswers, selectedOptions]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
      setTimer(30); // Reset the timer for the next question
    }
    

    if (currentQuestion) {
      // Check if the selected  are correct
      const isCorrect = selectedOptions.every((option) =>
        currentQuestion.correctAnswer.includes(option)
      );

      if (isCorrect && timer !==0) {
        setScore(score + 1);
      }
    }
    
  };
  
  console.log(score)
  // console.log(selectedOptions)



  // yaha logic add karna hai
  const handleSubmit =  ()=>{
    navigate(`/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`)
  }
  
  // useEffect(()=>{
  //   axios.post('http://localhost:8000/testdata',{
  //     "username": UserName,
  //     "category": selectedCategory,
  //      "attemptId":[...currentQuestion.id]  
  //   })
  // },[])
  
  
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
            
            {currentQuestionIndex === questions.length - 1 ? 
            ( 
              <>
              <button
              className="btn btn-primary mt-3"
              onClick={handleNextQuestion}
              disabled={isMultipleChoice ? false : !selectedOptions.length}
              >Next
              </button>
              <button
                className="btn btn-primary mt-3"
                onClick={handleSubmit}
                disabled={!selectedOptions.length}
              >
                Submit Test
              </button>
              </>

            ) : (
              <button
                className="btn btn-primary mt-3"
                onClick={handleNextQuestion}
                disabled={isMultipleChoice ? false : !selectedOptions.length}
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



export default StartQuiz;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSearchParams, useNavigate } from "react-router-dom";

// function StartQuiz() {
//   const [searchParams] = useSearchParams();
//   const selectedCategory = searchParams.get("selectedCategory");
//   const selectedType = searchParams.get("selectedType");
//   const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
//   const nameLogin = searchParams.get("nameLogin");
//   const UserName = searchParams.get("UserName");
//   const navigate = useNavigate();
//   const [questions, setQuestions] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState([]);
//   const [isMultipleChoice, setIsMultipleChoice] = useState(false);
//   const [timer, setTimer] = useState(
//     parseInt(localStorage.getItem("timer")) || 30
//   );
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
//     parseInt(localStorage.getItem("currentQuestionIndex")) || 0
//   );
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
//     if (currentQuestionIndex !== 0) {
//       setCurrentQuestionIndex(currentQuestionIndex);
//     }
//   }, [selectedCategory, selectedType, numberOfQuestions]);

//   useEffect(() => {
//     // Start the timer when a new question is displayed
//     const timerInterval = setInterval(() => {
//       if (timer > 0) {
//         setTimer(timer - 1);
//         localStorage.setItem("timer", timer - 1);
//       } else {
//         // When the timer reaches 0, automatically move to the next question (if not the last question)
//         if (currentQuestionIndex < questions.length - 1) {
//           handleNextQuestion();
//         }
//       }
//     }, 1000);

//     // Clean up the timer when the component unmounts or when the question changes
//     return () => {
//       clearInterval(timerInterval);
//     };
//   }, [currentQuestionIndex, questions, timer]);

//   useEffect(() => {
//     // Save the current quiz state to localStorage whenever it changes
//     localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
//     localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
//     localStorage.setItem("score", score);
//   }, [selectedOptions, userAnswers, score]);

//   // Load the quiz state from localStorage when the component mounts
//   useEffect(() => {
//     const storedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
//     const storedAnswers = JSON.parse(localStorage.getItem("userAnswers"));
//     const storedScore = localStorage.getItem("score");

//     if (storedOptions) {
//       setSelectedOptions(storedOptions);
//     }
//     if (storedAnswers) {
//       setUserAnswers(storedAnswers);
//     }
//     if (storedScore) {
//       setScore(parseInt(storedScore));
//     }
//   }, []);

//   const fetchQuestions = async (category, type, numQuestions) => {
//     try {
//       const apiUrl = `http://localhost:8000/questions`;
//       const response = await axios.get(apiUrl);
      
//       const filteredQuestions = response.data
//         .filter(
//           (question) =>
//             question.catId === parseInt(category) && question.type === type
//         )
//         .flatMap((question) => question.questions);
//       console.log(filteredQuestions);
//       const shuffledQuestions = shuffleArray(filteredQuestions);

//       setIsMultipleChoice(type === "multiple");

//       const selectedQuestions = shuffledQuestions.slice(0, numQuestions);
//       setQuestions(selectedQuestions);
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     }
//   };

//   const handleOptionSelect = (option) => {
//     if (isMultipleChoice) {
//       setSelectedOptions((prevSelectedOptions) =>
//         prevSelectedOptions.includes(option)
//           ? prevSelectedOptions.filter((item) => item !== option)
//           : [...prevSelectedOptions, option]
//       );
//     } else {
//       setSelectedOptions([option]);
//     }
//   };

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleNextQuestion = () => {
//     setUserAnswers([...userAnswers, selectedOptions]);

//     if (currentQuestionIndex < questions.length - 1) {
//       // Save the current question index to localStorage
//       localStorage.setItem(
//         "currentQuestionIndex",
//         currentQuestionIndex + 1
//       );

//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOptions([]);
//       setTimer(30); // Reset the timer for the next question
//     }

//     if (currentQuestion) {
//       // Check if the selected options are correct
//       const isCorrect = selectedOptions.every((option) =>
//         currentQuestion.correctAnswer.includes(option)
//       );

//       if (isCorrect && timer !== 0) {
//         setScore(score + 1);
//       }
//     }
//   };

//   const handleSubmit = () => {
//     // Clear the stored quiz state in localStorage when the quiz is completed
//     localStorage.removeItem("timer");
//     localStorage.removeItem("currentQuestionIndex");
//     localStorage.removeItem("selectedOptions");
//     localStorage.removeItem("userAnswers");
//     localStorage.removeItem("score");

//     navigate(
//       `/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`
//     );
//   };

//   return (
//     <div className="container mt-5">
//       {questions.length > 0 && currentQuestion ? (
//         <div className="card">
//           <div className="card-body">
//             <div className="text-center mt-3">
//               <span className="badge bg-primary">Timer: {timer}s</span>
//             </div>
//             <h5 className="card-title">
//               Question {currentQuestionIndex + 1}
//             </h5>

//             <p className="card-text">{currentQuestion.text}</p>
//             <div>
//               {currentQuestion.options.map((option, index) => (
//                 <label key={index} className="form-check">
//                   {isMultipleChoice ? (
//                     <input
//                       type="checkbox"
//                       className="form-check-input"
//                       value={option}
//                       checked={selectedOptions.includes(option)}
//                       onChange={() => handleOptionSelect(option)}
//                     />
//                   ) : (
//                     <input
//                       type="radio"
//                       className="form-check-input"
//                       value={option}
//                       checked={selectedOptions.includes(option)}
//                       onChange={() => handleOptionSelect(option)}
//                     />
//                   )}
//                   <span className="form-check-label">{option}</span>
//                 </label>
//               ))}
//             </div>

//             {currentQuestionIndex === questions.length - 1 ? (
//               <>
//                 <button
//                   className="btn btn-primary mt-3"
//                   onClick={handleNextQuestion}
//                   disabled={isMultipleChoice ? false : !selectedOptions.length}
//                 >
//                   Next
//                 </button>
//                 <button
//                   className="btn btn-primary mt-3"
//                   onClick={handleSubmit}
//                   disabled={!selectedOptions.length}
//                 >
//                   Submit Test
//                 </button>
//               </>
//             ) : (
//               <button
//                 className="btn btn-primary mt-3"
//                 onClick={handleNextQuestion}
//                 disabled={isMultipleChoice ? false : !selectedOptions.length}
//               >
//                 Next Question
//               </button>
//             )}
//           </div>
//         </div>
//       ) : (
//         <p>No questions available.</p>
//       )}
//     </div>
//   );
// }

// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }

// export default StartQuiz;