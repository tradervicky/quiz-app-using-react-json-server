import React from 'react'
import { Link } from 'react-router-dom';
function QuizQuestions() {
  return (
    <div className="container-fluid">
      <div className="container-fluid">
        <form className="mx-auto mt-5 " >
          <h4 className="text-center">Quiz Questions</h4>
          
          
          
          <Link to='/create-question'><button type="submit" className="btn btn-primary mt-5">
            Add New Question
          </button></Link>
          <Link to='/read-quiz-questions'><button type="submit" className="btn btn-primary mt-5">
            View Questions
          </button></Link>
          <Link to="/"> <button type="submit" className="btn btn-primary mt-5">
            Update Question
          </button></Link>
          <Link to="/"> <button type="submit" className="btn btn-primary mt-5">
            Delete Question
          </button></Link>
          <Link to="/admin-page"><button className="btn btn-danger mt-5">
            Back
          </button></Link>
        </form>
      </div>
    </div>
    )
}

export default QuizQuestions