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

  //logic for not reapeated question if user again attempted the test
  const [allQue, setAllQue] = useState([]);
  const userId = parseInt(searchParams.get("userId"));
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:8000/users/${userId}`)
      .then((res) => setAnsweredQuestions(res?.data?.AttemptedQue));
  }, [userId]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/questions")
      .then((res) => setAllQue(res?.data));
  }, []);


  // console.log(answeredQuestions);
  // // console.log(allQue)
  // console.log(unansweredQuestions);
  // const AvailableQuestionId =  allQue.filter((element) => !answeredQuestions.includes(element));
  // console.log(AvailableQuestionId)

  // Initialize localStorage
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const savedCurrentQuestionIndex = parseInt(
      localStorage.getItem("currentQuestionIndex")
    );
    return isNaN(savedCurrentQuestionIndex) ? 0 : savedCurrentQuestionIndex;
  });
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem("selectedOptions")) || []
  );
  const [userAnswers, setUserAnswers] = useState(
    JSON.parse(localStorage.getItem("userAnswers")) || []
  );
  const [score, setScore] = useState(
    parseInt(localStorage.getItem("score")) || 0
  );
  const [timer, setTimer] = useState(
    parseInt(localStorage.getItem("timer")) || 30
  );
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  useEffect(() => {
    console.log("first");
    fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
  }, [selectedCategory, selectedType, numberOfQuestions]);
  console.log(selectedCategory);
  useEffect(() => {
    // timer start
    const timerInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
        localStorage.setItem("timer", timer - 1);
      } else {
        // next question when zero timer
        if (currentQuestionIndex < questions.length - 1) {
          handleNextQuestion();
        }
      }
    }, 1000);

    // clear the timer next question

    return () => {
      clearInterval(timerInterval); // clear the time by using clearInterval function on the time of unmount of component or any dependencies changes
    };
  }, [currentQuestionIndex, questions, timer]);

  useEffect(() => {
    // saved in local storage
    const savedSelectedOptions = JSON.parse(
      localStorage.getItem("selectedOptions")
    );
    if (
      Array.isArray(savedSelectedOptions) &&
      savedSelectedOptions.length > 0
    ) {
      // check for savedSelectedoption is an array or not and then
      setSelectedOptions(savedSelectedOptions); // also check its length aand set options
    }
    const savedUserAnswers = JSON.parse(localStorage.getItem("userAnswers"));
    if (Array.isArray(savedUserAnswers) && savedUserAnswers.length > 0) {
      setUserAnswers(savedUserAnswers);
    }
    const savedScore = parseInt(localStorage.getItem("score"));
    if (!isNaN(savedScore) && savedScore > 0) {
      setScore(savedScore);
    }
  }, []);

  useEffect(() => {
    // Update localStorages on nexy question
    localStorage.setItem(
      "currentQuestionIndex",
      currentQuestionIndex.toString()
    );
  }, [currentQuestionIndex]);

  const fetchQuestions = async (category, type, numQuestions) => {
    const apiUrl = `http://localhost:8000/questions`;
    const response = await axios.get(apiUrl);

    const unansweredQuestions = response.data.filter(
      (question) => !answeredQuestions.includes(question.id)
    );
  
    // console.log(response);
    // const filteredQuestions = response.data.filter(
    //   (question) =>
    //     question.catId === parseInt(category) &&
    //     question.type === type &&
    //     //logic for not reapeted question
        !answeredQuestions.includes(question.id) // logic hai for not reapeatintion
    // );

    console.log(unansweredQuestions);
    setIsMultipleChoice(type === "multiple"); //help in selection options

    const selectedQuestions = unansweredQuestions.slice(0, numQuestions); // again filtered the question according to selected number of questions
    setQuestions(selectedQuestions);
  };

  const handleOptionSelect = (option) => {
    // selectd the option according
    // accoding to type of question
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
      setTimer(30);
    }

    if (currentQuestion) {
      //logic for not reapeated question
      // const currentQuestionId = questions[currentQuestionIndex].id;

      // Add the current question's ID to the list of answered questions
      // setAnsweredQuestions([...answeredQuestions, currentQuestionId]);
      // end
      // Check if the selected options are correct
      const isCorrect = selectedOptions.every((option) =>
        currentQuestion.correctAnswer.includes(option)
      );

      if (isCorrect && timer !== 0) {
        setScore(score + 1);
        localStorage.setItem("score", score + 1);
      }
    }
  };

  // Logic to submit the test
  const handleSubmit = () => {
    localStorage.clear(); // Clear local storage when the test is completed
    navigate(
      `/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`
    );
  };

  // logic for not repeated question again
  // const [attemptedQuestionData , setAttemptedQuestionData ] = useState([])
  // useEffect(()=>{
  //   setAttemptedQuestionData((prevData) => [...prevData, currentQuestionIndex]);
  // },[currentQuestion])
  // console.log(attemptedQuestionData)

  //end

  return (
    <div className="container mt-5">
      {questions.length > 0 && currentQuestion ? (
        <div className="card">
          <div className="card-body">
            <div className="text-center mt-3">
              <span className="badge bg-primary">Timer: {timer}s</span>
            </div>
            <h5 className="card-title">Question {currentQuestionIndex + 1}</h5>

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

            {currentQuestionIndex === questions.length - 1 ? (
              <>
                <button
                  className="btn btn-primary mt-3"
                  onClick={handleNextQuestion}
                  disabled={isMultipleChoice ? false : !selectedOptions.length}
                >
                  Next
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

export default StartQuiz;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSearchParams, useNavigate } from "react-router-dom";

// function StartQuiz() {
//   const [searchParams] = useSearchParams();
//   const selectedCategory = searchParams.get("selectedCategory");
//   const selectedType = searchParams.get("selectedType");
//   const numberOfQuestions = parseInt(searchParams.get("numberOfQuestions"));
//   const userId = parseInt(searchParams.get("userId"));
//   const nameLogin = searchParams.get("nameLogin");
//   const UserName = searchParams.get("UserName");
//   const navigate = useNavigate();
//   const [allQue, setAllQue]=useState([]);

// //logic for not reapeated question if user again attempted the test
// const [answeredQuestions, setAnsweredQuestions] = useState([]);
// const AnsResponse = axios.get(' http://localhost:8000/users')
// useEffect(()=>{
// axios.get(  `http://localhost:8000/users/${userId}`)
// .then((res)=>setAnsweredQuestions(res?.data?.AttemptedQue))
// },[])
// useEffect(()=>{
//   axios.get('http://localhost:8000/questions')
//   .then((res)=>setAllQue(res?.data))
// },[])

// const unansweredQuestions = allQue.filter(
//   (question) => !answeredQuestions.includes(question.id)
// );

// // console.log(answeredQuestions)
// // console.log(allQue)
// console.log(unansweredQuestions)
// // const AvailableQuestionId =  allQue.filter((element) => !answeredQuestions.includes(element));
// // console.log(AvailableQuestionId)
//   // Initialize state from localStorage or use default values
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const savedCurrentQuestionIndex = parseInt(
//       localStorage.getItem("currentQuestionIndex")
//     );
//     return isNaN(savedCurrentQuestionIndex) ? 0 : savedCurrentQuestionIndex;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(
//     JSON.parse(localStorage.getItem("selectedOptions")) || []
//   );
//   const [userAnswers, setUserAnswers] = useState(
//     JSON.parse(localStorage.getItem("userAnswers")) || []
//   );
//   const [isMultipleChoice, setIsMultipleChoice] = useState(false);
//   const [score, setScore] = useState(
//     parseInt(localStorage.getItem("score")) || 0
//   );
//   const [timer, setTimer] = useState(
//     parseInt(localStorage.getItem("timer")) || 30
//   );

//   useEffect(() => {
//     fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
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
//     // Check if there is saved state in localStorage and update the state accordingly
//     const savedSelectedOptions = JSON.parse(
//       localStorage.getItem("selectedOptions")
//     );
//     if (Array.isArray(savedSelectedOptions) && savedSelectedOptions.length > 0) {
//       setSelectedOptions(savedSelectedOptions);
//     }
//     const savedUserAnswers = JSON.parse(localStorage.getItem("userAnswers"));
//     if (Array.isArray(savedUserAnswers) && savedUserAnswers.length > 0) {
//       setUserAnswers(savedUserAnswers);
//     }
//     const savedScore = parseInt(localStorage.getItem("score"));
//     if (!isNaN(savedScore) && savedScore > 0) {
//       setScore(savedScore);
//     }
//   }, []);

//   useEffect(() => {
//     // Update localStorage whenever the currentQuestionIndex changes
//     localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
//   }, [currentQuestionIndex]);

//   const fetchQuestions = async (category, type, numQuestions) => {
//     try {
//       const apiUrl = `http://localhost:8000/questions`;
//       const response = await axios.get(apiUrl);

//       // const response = unansweredQuestions

//       const filteredQuestions = response.filter(
//         (question) =>
//           question.catId === parseInt(category) && question.type === type

//           //logic for not reapeted question
//         //  &&  !answeredQuestions.includes(question.id)
//       );

//       setIsMultipleChoice(type === "multiple");

//       const selectedQuestions = filteredQuestions.slice(0, numQuestions);
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
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOptions([]);
//       setTimer(30); // Reset the timer for the next question
//     }

//     if (currentQuestion) {
//       //logic for not reapeated question
//       // const currentQuestionId = questions[currentQuestionIndex].id;

//     // Add the current question's ID to the list of answered questions
//     // setAnsweredQuestions([...answeredQuestions, currentQuestionId]);
// // end
//       // Check if the selected options are correct
//       const isCorrect = selectedOptions.every((option) =>
//         currentQuestion.correctAnswer.includes(option)
//       );

//       if (isCorrect && timer !== 0) {
//         setScore(score + 1);
//         localStorage.setItem("score", score + 1);
//       }
//     }
//   };

//   // Logic to submit the test
//   const handleSubmit = () => {
//     localStorage.clear(); // Clear local storage when the test is completed
//     navigate(
//       `/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`
//     );
//   };

//     // logic for not repeated question again
//     const [attemptedQuestionData , setAttemptedQuestionData ] = useState([])
//     useEffect(()=>{
//       setAttemptedQuestionData((prevData) => [...prevData, currentQuestionIndex]);
//     },[currentQuestion])
//     // console.log(attemptedQuestionData)

//   //end

//   return (
//     <div className="container mt-5">
//       {questions.length > 0 && currentQuestion ? (
//         <div className="card">
//           <div className="card-body">
//             <div className="text-center mt-3">
//               <span className="badge bg-primary">Timer: {timer} sec</span>
//             </div>
//             <h5 className="card-title">
//               Question {currentQuestionIndex + 1 }
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

// export default StartQuiz;

// this code below is resuffle the questions

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

//   // Initialize state from localStorage or use default values
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
//     const savedCurrentQuestionIndex = parseInt(
//       localStorage.getItem("currentQuestionIndex")
//     );
//     return isNaN(savedCurrentQuestionIndex) ? 0 : savedCurrentQuestionIndex;
//   });
//   const [selectedOptions, setSelectedOptions] = useState(
//     JSON.parse(localStorage.getItem("selectedOptions")) || []
//   );
//   const [userAnswers, setUserAnswers] = useState(
//     JSON.parse(localStorage.getItem("userAnswers")) || []
//   );
//   const [isMultipleChoice, setIsMultipleChoice] = useState(false);
//   const [score, setScore] = useState(
//     parseInt(localStorage.getItem("score")) || 0
//   );
//   const [timer, setTimer] = useState(
//     parseInt(localStorage.getItem("timer")) || 30
//   );

//   useEffect(() => {
//     fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
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
//     // Check if there is saved state in localStorage and update the state accordingly
//     const savedSelectedOptions = JSON.parse(
//       localStorage.getItem("selectedOptions")
//     );
//     if (Array.isArray(savedSelectedOptions) && savedSelectedOptions.length > 0) {
//       setSelectedOptions(savedSelectedOptions);
//     }
//     const savedUserAnswers = JSON.parse(localStorage.getItem("userAnswers"));
//     if (Array.isArray(savedUserAnswers) && savedUserAnswers.length > 0) {
//       setUserAnswers(savedUserAnswers);
//     }
//     const savedScore = parseInt(localStorage.getItem("score"));
//     if (!isNaN(savedScore) && savedScore > 0) {
//       setScore(savedScore);
//     }
//   }, []);

//   useEffect(() => {
//     // Update localStorage whenever the currentQuestionIndex changes
//     localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
//   }, [currentQuestionIndex]);

//   const fetchQuestions = async (category, type, numQuestions) => {
//     try {
//       const apiUrl = `http://localhost:8000/questions`;
//       const response = await axios.get(apiUrl);

//       const filteredQuestions = response.data.filter(
//         (question) =>
//           question.catId === parseInt(category) && question.type === type
//       );
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
//         localStorage.setItem("score", score + 1);
//       }
//     }
//   };

//   // Logic to submit the test
//   const handleSubmit = () => {
//     localStorage.clear(); // Clear local storage when the test is completed
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
