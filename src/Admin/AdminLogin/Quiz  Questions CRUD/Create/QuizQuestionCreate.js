import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";



function QuizQuestionCreate() {
  const [quiz, setQuiz] = useState([])
  const [id, setID] = useState('')
  const [question, setQuestion] = useState({
    type: '', 
    text: '',
    options: [],
    correctAnswer: '',
  });
  const queHandler= (e)=>{
    setQuestion({...question, [e.target.text]: e.target.value})
  }
  useEffect(()=>{
    axios.get(' http://localhost:8000/quizzes')
    .then((res)=> setQuiz(res))
    console.log(quiz)
  },[])
  const sumitHandler = (e)=>{
    e.preventDefault();
    axios.post(`http://localhost:8000/quizzes/${quiz.id}/questions`, question)
    .then((res)=>{
      console.log(res)
    })
  }
  return (
    <div>
      <h3>Add New Question</h3>
      <div>
        <label htmlFor="question">Question</label>
        <input type="text" onChange={queHandler}/>
      </div>
      <button className="btn btn-outline-secondary" onClick={sumitHandler}>submit</button>

      
    </div>
  )
}

export default QuizQuestionCreate



// Method 2



// import React, { useState } from "react";
// import axios from "axios";
// function QuizQuestionCreate() {

//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);
//   const [correctAnswer, setCorrectAnswer] = useState(0); // Index of correct option
//   const [questionType, setQuestionType] = useState("single"); // Default to single choice

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   const handleCreateQuestion = async () => {
//     const newQuestion = {
//       type: questionType,
//       text: question,
//       options,
//       correctAnswer: questionType === "single" ? options[correctAnswer] : correctAnswer.map(i => options[i]),
//     };

//     try {
//       const response = await axios.post("http://your-server-address/api/questions", newQuestion);
//       console.log("Question created successfully:", response.data);
//       // Clear the form
//       setQuestion("");
//       setOptions(["", "", "", ""]);
//       setCorrectAnswer(0);
//       setQuestionType("single");
//     } catch (error) {
//       console.error("Error creating question:", error);
//     }
//   };
//   return (
//      <div>
//       <h2>Create Question</h2>
//       <div>
//         <label htmlFor="question">Question Text</label>
//         <input
//           type="text"
//           id="question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//         />
//       </div>
//       <div>
//         <label>Question Type</label>
//         <div>
//           <label>
//             Single Choice
//             <input
//               type="radio"
//               value="single"
//               checked={questionType === "single"}
//               onChange={() => setQuestionType("single")}
//             />
//           </label>
//           <label>
//             Multiple Choice
//             <input
//               type="radio"
//               value="multiple"
//               checked={questionType === "multiple"}
//               onChange={() => setQuestionType("multiple")}
//             />
//           </label>
//         </div>
//       </div>
//       <div>
//         <label>Options</label>
//         {options.map((option, index) => (
//           <div key={index}>
//             <input
//               type="text"
//               value={option}
//               onChange={(e) => handleOptionChange(index, e.target.value)}
//             />
//           </div>
//         ))}
//       </div>
//       <div>
//         <label>Correct Answer</label>
//         {questionType === "single" ? (
//           <select
//             value={correctAnswer}
//             onChange={(e) => setCorrectAnswer(e.target.value)}
//           >
//             {options.map((option, index) => (
//               <option key={index} value={index}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <div>
//             {options.map((option, index) => (
//               <label key={index}>
//                 <input
//                   type="checkbox"
//                   checked={correctAnswer.includes(index)}
//                   onChange={() => {
//                     const newCorrectAnswer = correctAnswer.includes(index)
//                       ? correctAnswer.filter((i) => i !== index)
//                       : [...correctAnswer, index];
//                     setCorrectAnswer(newCorrectAnswer);
//                   }}
//                 />
//                 {option}
//               </label>
//             ))}
//           </div>
//         )}
//       </div>
//       <button onClick={handleCreateQuestion}>Create Question</button>
//     </div>
//   )
// }

// export default QuizQuestionCreate

// Method 3


// import axios from 'axios';
// import { useState,useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom';
// function QuizQuestionCreate() {
  
//   useEffect(() => {
    
//     fetchQuizData();
//   }, []);

//   const fetchQuizData = async () => {
//     try {
      
//       const response = await axios.get("http://localhost:8000/quizzes");

//       if (response.status === 200) {
//         const quizData = response.data;

//         setQuestions(quizData[0].questions); 
//         // console.log(quizData[0].questions)
//       } else {
//         console.error("Failed to fetch quiz data");
//       }
//     } catch (error) {
//       console.error("Error fetching quiz data:", error);
//     }
//   };
//   return (
//     <div className='container-fluid '>
      
//       <div className="container-fluid">
//             <form className="mx-auto my-auto mt-5" onSubmit={handleSubmit}>
//                 <h4 className="text-center">Add New Question</h4>
//                 <div className="mb-3 mt-1">
//                   <label for="exampleInputEmail1" className="form-label">Question</label>
//                   <input type="email"   className="form-control" placeholder='Type Question'  />
//                 </div>
//                 <div className="mb-3">
//                   <input type="text" className="form-control" placeholder='Type option-1'/>
//                   {/* {error && <p className="error text-danger" >{error}</p>}                  */}
//                 </div>
//                 <div className="mb-3">
//                   <input type="text"  className="form-control" placeholder='Type option-2'/>
//                   {/* {error && <p className="error text-danger" >{error}</p>}                  */}
//                 </div>
//                 <div className="mb-3">
//                   <input type="text"  className="form-control" placeholder='Type option-3'/>
//                   {/* {error && <p className="error text-danger" >{error}</p>}                  */}
//                 </div>
//                 <div className="mb-3">
//                   <input type="text"  className="form-control" placeholder='Type option-4'/>
//                   {/* {error && <p className="error text-danger" >{error}</p>}                  */}
//                 </div>
//                 <label for="QuestionType" className="form-label">Question Type</label>
//                 <select name="QuestionType" id="">{}</select>
//                 <button type="submit" className="btn btn-primary mt-5">Add +</button>
//                <Link to='/quiz-questions'> <button type="submit" className="btn btn-primary mt-5">Back </button></Link>
//               </form>
//               </div>
//     </div>
//   )
// }

// export default QuizQuestionCreate