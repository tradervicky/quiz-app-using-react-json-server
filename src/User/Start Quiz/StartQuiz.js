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

  // const handleNextQuestion = () => {
  //   if (currentQuestion) {
  //     const isCorrect = selectedOptions.every((option) =>
  //       currentQuestion.correctAnswer.includes(option)
  //     );

  //     if (isCorrect && timer > 0) {
  //       setScore(score + 1);
  //       localStorage.setItem("score", (score + 1).toString());
  //     }

  //     const currentQuestionId = currentQuestion.id;

  //     if (answeredQuestions.includes(currentQuestionId)) {
  //       console.log("Question already attempted");
  //     } else {
  //       const newAttemptedQuestions = [...answeredQuestions, currentQuestionId];

  //       // Update the user's data in the db.json file
  //       axios.put(`http://localhost:8000/users/${userId}`, { AttemptedQue: newAttemptedQuestions })
  //         .then((response) => {
  //           if (response.data.success) {
  //             console.log("User's attempted questions updated successfully");
  //           } else {
  //             console.error("Failed to update user's attempted questions");
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error updating user's attempted questions", error);
  //         });
  //     }

  //     setUserAnswers([...userAnswers, selectedOptions]);

  //     if (currentQuestionIndex < questions.length - 1) {
  //       setCurrentQuestionIndex(currentQuestionIndex + 1);
  //       setSelectedOptions([]);
  //       setTimer(30);
  //     } else {
  //       submitTest();
  //     }
  //   }
  // };

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
                  onClick={submitTest}
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
        <h3 className="text-center " style={{ color: "white" }}>
          No questions available. <br /> <span> Try Other Combination <br /> or select fewer questions</span>
        </h3>
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
//   const nameLogin = searchParams.get("nameLogin");
//   const UserName = searchParams.get("UserName");
//   const navigate = useNavigate();


//   //logic for not reapeated question if user again attempted the test


// //   const [allQue, setAllQue]=useState([]);
//   const userId = parseInt(searchParams.get("userId"));
// const [answeredQuestions, setAnsweredQuestions] = useState([]);
// useEffect(()=>{
// axios.get(  `http://localhost:8000/users/${userId}`)
// .then((res)=>setAnsweredQuestions(res?.data?.AttemptedQue))
// },[userId])

// // useEffect(()=>{
// //   axios.get('http://localhost:8000/questions')
// //   .then((res)=>setAllQue(res?.data))  
// // },[])

// // const unansweredQuestions = allQue.filter(
// //   (question) => !answeredQuestions.includes(question.id)
// // );

// // console.log(typeof(answeredQuestions))
// // console.log(allQue)
// // console.log(unansweredQuestions)
// // const AvailableQuestionId =  allQue.filter((element) => !answeredQuestions.includes(element));
// // console.log(AvailableQuestionId)


// //end

//   // Initialize localStorage 
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
//   const [score, setScore] = useState(
//     parseInt(localStorage.getItem("score")) || 0
//   );
//   const [timer, setTimer] = useState(
//     parseInt(localStorage.getItem("timer")) || 30
//   );
//   const [isMultipleChoice, setIsMultipleChoice] = useState(false);

//   useEffect(() => {
//     fetchQuestions(selectedCategory, selectedType, numberOfQuestions);
//   }, [selectedCategory, selectedType, numberOfQuestions]);

//   useEffect(() => {
//     // timer start
//     const timerInterval = setInterval(() => {
//       if (timer > 0) {
//         setTimer(timer - 1);
//         localStorage.setItem("timer", timer - 1);
//       } else {
//         // next question when zero timer 
//         if (currentQuestionIndex < questions.length - 1) {
//           handleNextQuestion();
//         }
//       }
//     }, 1000);

//     // clear the timer next question 
   
//     return () => {
//       clearInterval(timerInterval); // clear the time by using clearInterval function on the time of unmount of component or any dependencies changes
//     };
//   }, [currentQuestionIndex, questions, timer]);

//   useEffect(() => {
//     // saved in local storage
//     const savedSelectedOptions = JSON.parse(
//       localStorage.getItem("selectedOptions")
//     );
//     if (Array.isArray(savedSelectedOptions) && savedSelectedOptions.length > 0) {  // check for savedSelectedoption is an array or not and then 
//       setSelectedOptions(savedSelectedOptions);  // also check its length aand set options
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
//     // Update localStorages on nexy question
//     localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString());
//   }, [currentQuestionIndex]);



// // yaha se fetch function
// const fetchQuestions = async (category, type, numQuestions) => {
//   try {
//     // Fetch all questions
//     const allQuestionsResponse = await axios.get(`http://localhost:8000/questions`);
//     const allQuestions = allQuestionsResponse.data;

//     // Fetch the user's attempted questions
//     const userResponse = await axios.get(`http://localhost:8000/users/${userId}`);
//     const userHistory = userResponse.data?.AttemptedQue || [];

//     // Filter unanswered questions
//     const unansweredQuestions = allQuestions.filter((question) =>
//       question.catId === parseInt(category) &&
//       question.type === type &&
//       !userHistory.includes(question.id)
//     );

//     if (unansweredQuestions.length < numQuestions) {
//       // Handle the case where there aren't enough unanswered questions
//       // You can choose to fetch more questions or handle it as needed.
//       console.log("Not enough unanswered questions.");
//       return;
//     }

//     // Shuffle the questions to randomize the order
//     const shuffledQuestions = shuffleArray(unansweredQuestions);

//     // Take the first 'numQuestions' from the shuffled list
//     const selectedQuestions = shuffledQuestions.slice(0, numQuestions);

//     setIsMultipleChoice(type === "multiple");
//     setQuestions(selectedQuestions);
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//   }
// };


// //end

//   // const fetchQuestions = async (category, type, numQuestions) => {
    
//   //     const apiUrl = `http://localhost:8000/questions`;
//   //     const response = await axios.get(apiUrl);
//   //     const ansResponse = await axios.get(`http://localhost:8000/users/${userId}`) // res?.data?.AttemptedQue
//   //     // const response = unansweredQuestions;
//   //     console.log(response.data)
//   //     const filteredQuestions = response.data.filter(
//   //       (question) =>
//   //         question.catId === parseInt(category) && question.type === type
//   //         //logic for not reapeted question 
//   //       //  &&  !answeredQuestions.includes(question.id) // logic hai for not reapeatintion

//   //     );
//   //     setIsMultipleChoice(type === "multiple");  //help in selection options 

//   //     const selectedQuestions = filteredQuestions.slice(0, numQuestions); // again filtered the question according to selected number of questions
//   //     setQuestions(selectedQuestions);
   
//   // };

//   const handleOptionSelect = (option) => {  // selectd the option according 
//                                             // accoding to type of question
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
//     if (currentQuestion) {
//       const isCorrect = selectedOptions.every((option) =>
//         currentQuestion.correctAnswer.includes(option)
//       );
  
//       if (isCorrect && timer !== 0) {
//         setScore(score + 1);
//         localStorage.setItem("score", score + 1);
//       }
  
//       const currentQuestionId = currentQuestion.id; // Get the ID of the current question
  
//       if (answeredQuestions.includes(currentQuestionId)) {
//         // If the question is already in the AttemptedQue, don't add it again
//         console.log("Question already attempted");
//       } else {
//         // Add the current question ID to the AttemptedQue array
  
//         // Update the user's data in the db.json file
//         axios
//           .get(`http://localhost:8000/users/${userId}`)
//           .then((response) => {
//             if (response.data) {
//               const user = response.data;
//               const newAttemptedQuestions = [...user.AttemptedQue, currentQuestionId];
//               user.AttemptedQue = newAttemptedQuestions;
              
//               // Update the user's data in the db.json file
//               axios
//                 .put(`http://localhost:8000/users/${userId}`, user)
//                 .then((updateResponse) => {
//                   if (updateResponse.data.success) {
//                     console.log("User's attempted questions updated successfully");
//                   } else {
//                     console.error("Failed to update user's attempted questions");
//                   }
//                 })
//                 .catch((error) => {
//                   console.error("Error updating user's attempted questions", error);
//                 });
//             } else {
//               console.error("User not found");
//             }
//           })
//           .catch((error) => {
//             console.error("Error fetching user data", error);
//           });
//       }
  
//       setUserAnswers([...userAnswers, selectedOptions]);
  
//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex(currentQuestionIndex + 1);
//         setSelectedOptions([]);
//         setTimer(30);
//       }
//       else{
//         navigate(
//           `/result?score=${score}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLogin}`
//         );
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
//     // const [attemptedQuestionData , setAttemptedQuestionData ] = useState([])
//     // useEffect(()=>{
//     //   setAttemptedQuestionData((prevData) => [...prevData, currentQuestionIndex]);
//     // },[currentQuestion])
//     // console.log(attemptedQuestionData)
  
//   //end

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

 
//         <h3 className="text-center " style={{color:"white"}}>No questions available. <br /> <span> Try Other Combination <br /> or select less no of Question</span></h3>

//       )}
//     </div>
//   );
// }

//  function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
//   }

// export default StartQuiz;



