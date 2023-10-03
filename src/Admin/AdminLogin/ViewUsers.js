import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'

function ViewUsers() {
    const [viewUsers, setViewUsers] = useState([]);
    useEffect(()=>{
        fetchUsers();
      },[])
      const fetchUsers =()=>{
        axios.get(' http://localhost:8000/users')
        .then((res)=>{
            setViewUsers(res.data)
        })
        .catch(error => {
            console.error('Error fetching components:', error);
          })
      }
  return (
    <div  classNameName='container-fluid'>
        <form className="mx-auto ">
            <h4 className="text-center">Users List</h4>
            <table className="table mt-1">
                <thead>

                <tr>
                    <th>Users Id</th>
                    <th>Users Name</th>
                    <th>User Email</th>
                    </tr>
                </thead>
                <tbody>
                {viewUsers.map(component => (
            <tr key={viewUsers.id} className="table-secondary ">
                <td>{component.id}</td>
                <td>{component.name}</td>
                <td>{component.username}</td>
                </tr>        
    
         ))}
       
                 </tbody>
             </table>
             <Link to='/admin-page'><button className="btn btn-primary mt-5">Back</button></Link>
      </form>
    </div>
  )
}

export default ViewUsers