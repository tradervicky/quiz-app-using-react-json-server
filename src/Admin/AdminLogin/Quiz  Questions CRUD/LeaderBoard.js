import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

function LeaderBoard() {
    const [viewUsers, setViewUsers] = useState([]);
    useEffect(()=>{
        fetchUsers();
      },[])
      const fetchUsers =()=>{
        axios.get('  http://localhost:8000/leaderboard')
        .then((response)=>{
            const data = response.data;
            const sortedLeaderboard = data.sort((a, b) => b.score - a.score);
            setViewUsers(sortedLeaderboard)
        })
        .catch(error => {
            console.error('Error fetching components:', error);
          })
      }
  return (
    <div  classNameName='container-fluid'>
        <form className="mx-auto ">
            <h4 className="text-center">Leader Board</h4>
            <table className="table mt-1">
                <thead>

                <tr>
                    
                    <th>Users Id</th>
                    <th>User Name</th>
                    <th>Users Score</th>
                    </tr>
                </thead>
                <tbody>
                {viewUsers.map(component => (
            <tr key={viewUsers.id} className="table-secondary ">
                
                <td>{component.id}</td>
                <td>{component.username}</td>
                <td>{component.score}</td>
                </tr>
         
    
         ))}
       
                 </tbody>
             </table>
             <Link to='/admin-page'><button className="btn btn-primary mt-5">Back</button></Link>
      </form>
    </div>
  )
}

export default LeaderBoard