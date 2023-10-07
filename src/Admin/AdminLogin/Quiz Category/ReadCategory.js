import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link} from 'react-router-dom'
function ReadCategory() {
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetchCategory();
  },[])
  const fetchCategory =()=>{
    axios.get(' http://localhost:8000/category')
    .then((res)=>{
        setCategories(res?.data)
        console.log(categories)
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
                    
                    </tr>
                </thead>
                <tbody>
                
        {categories.map(comp => (
            <tr key={categories.id} className="table-secondary ">
                <td>{comp.name}</td>
                {/* <td className="d-flex justify-content-center">
              
                </td> */}

            </tr>
         
    
        ))}
      
                </tbody>
            </table>
            <Link to={`/update-category/`} className="btn btn-primary mt-5" >Update</Link>
             <Link to='/delete-category'> <button className="btn btn-primary mt-5" > Delete</button></Link>
             
      <Link to='/create'><button className="btn btn-primary mt-5">Back</button></Link>
      </form>
    </div>
  );
}

export default ReadCategory;
