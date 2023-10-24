import React, { useState } from "react";
import axios from "axios";
import {useSearchParams, Link} from 'react-router-dom';
import { useEffect } from "react";
import { toast } from "react-toastify";
function Delete() {
  const [searchParams] = useSearchParams();
  const questionId =parseInt( searchParams.get("selectdId"));
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  

const deleteQuestion =((questionId)=>{
    if(window.confirm("Do you want to delete?")){
        fetch(`http://localhost:8000/questions/${questionId}`,
        {method:"DELETE"})
        .then(()=>{
            toast.success("Deletd SuccessFully!", {
                position: "top-right",
                autoClose: 3000, // Auto close the notification after 3 seconds
              });
        })
        .catch((err)=>{
            console.log(err)
        })
    }

})


useEffect(()=>{
    axios.get(`http://localhost:8000/questions/${questionId}`)
    .then((response)=>setSelectedQuestion(response.data))
    
},[])
console.log(selectedQuestion)
  return (
    <div className="container-fluid">
        <form action="" className="mx-auto">
        <h3>{questionId}.{selectedQuestion.text}</h3>
        <div className=" d-flex flex-column mb-3">                                          
                      {selectedQuestion?.options?.map((option, index) => (
                        <button key={index} value={option} className="btn btn-outline-secondary me-2 m-2 d-flex-column">
                          {option}
                        </button>
                      ))}
                    
                 </div>
                 <div className="d-flex justify-content-lg-between">
      <Link to={'/read-quiz-questions'}><button className="btn btn-danger" onClick={()=>{deleteQuestion(questionId)}}>
        Delete
      </button></Link>
      <Link to={'/read-quiz-questions'}><button className="btn btn-warning" >
        Back
      </button></Link>
      </div>
      </form>
    </div>
  );
}

export default Delete;


