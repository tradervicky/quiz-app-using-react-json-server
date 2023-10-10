import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'


function ResultPage() {
  const [searchParams] = useSearchParams();
  const Score = searchParams.get("score")
  const nameLogin = searchParams.get("nameLogin")

  const noofQuestion = searchParams.get("numberOfQuestions")
  const ScorePercentage  = Math.floor((Score/noofQuestion)*100)



  const fetchLeaderBoard = async()=>{
    
      
      const response = await axios.post("http://localhost:8000/leaderboard",{
        score : ScorePercentage,
        username: nameLogin
      });
  
  }

  return (
    <div className='container-fluid'>
        <form className='mx-auto'>
        <h2>Quiz Result</h2>
        <p>Name : {nameLogin}</p>
      <p>Your Score: {ScorePercentage} </p>
     <Link to='/user-leaderboard'> <button className="btn btn-warning mt-3" onClick={fetchLeaderBoard}>LeaderBoard</button></Link>
     <Link to='/'> <button className="btn btn-danger mt-3" onClick={fetchLeaderBoard}>Log Out</button></Link>
        </form>

    </div>
  )
}

export default ResultPage