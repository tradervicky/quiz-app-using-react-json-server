import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
function Read() {
  
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      
      const response = await axios.get(" http://localhost:8000/questions");

      if (response.status === 200) {
        const quizData = response.data;

        setQuestions(quizData); 
        // console.log(quizData[0].questions)
      } else {
        console.error("Failed to fetch quiz data");
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };
  console.log(questions);
  

  return (
    
    <>

<div className="m-2">
  <div className="d-flex justify-content-xl-between mx-auto " style={{width: "80%"}}>
      <h2 className="text-center text-light">Quiz Questions</h2>
      <Link to='/quiz-questions'><button className="btn btn-warning">Back</button></Link>
      </div>
      
      <div className="row mx-5">
        {questions.map((question) => (
          <div key={question.id} className="col-md-4 mb-3">
            <div className="card">
            <h3 className="text-center" style={{color:"red"}}>Question Type :{question.type}</h3>
              <div className="card-body">
                <h3 className="card-title">{question.id}.{question.text}</h3>
                {question.type === "single" ? (
                  <div className=" d-flex flex-column mb-3">                                          
                      {question.options.map((option, index) => (
                        <button key={index} value={option} className="btn btn-outline-secondary me-2 m-2 d-flex-column">
                          {option}
                        </button>
                      ))}
                    
                  </div>
                ) : (
                  <div>
                    {question.options.map((option, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`option-${index}`}
                          value={option}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`option-${index}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                <br />
                <div >
                  <h4 className="text-center">Correct Ans</h4>
                {question.type === "single" ? <p className="text-center">  {question.correctAnswer}</p> :  question.correctAnswer.map((ans)=> <p className="text-center">{ans}<br/></p>) }
                </div>
                <div className="d-flex justify-content-xl-between">
                <Link to={`/delete-question?selectdId=${question.id}`}>  <button className="btn btn-danger" >Delete</button> </Link>
                  <Link to={`/update-question?selectdId=${question.id}`}><button className="btn btn-warning" >Update</button></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      
    </>
  );
}

export default Read;
