import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

function UserLeaderBoard() {
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetchCategory();
  },[])
  const fetchCategory =()=>{
    axios.get(' http://localhost:8000/leaderboard')
    .then((res)=>{
        setCategories(res.data)
    })
    .catch(error => {
        console.error('Error fetching components:', error);
      })
  }

  return (
    <div  classNameName='container-fluid'>
        <form className="mx-auto">
            <table className="table mt-1">
                <thead>
                    <tr><th>Category List</th>
                    <th>action</th>
                    </tr>
                </thead>
                <tbody>
                
        {categories.map(comp => (
            <tr key={categories.id} className="table-secondary">
                <td>{comp.category}</td>
                <td className="d-flex justify-content-center">
                <Link to={`/update-category/${categories.id}`} className="btn btn-success my-1" >Update</Link>
              <button className="btn ms-2 btn-danger" > Delete</button>
                </td>

            </tr>
         
    
        ))}
      
                </tbody>
            </table>
      <Link to='/create'><button className="btn btn-primary mt-5">Back</button></Link>
      </form>
    </div>
  );
}

export default UserLeaderBoard;