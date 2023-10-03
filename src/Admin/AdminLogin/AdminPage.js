import React from "react";
import { Link } from 'react-router-dom';

function AdminPage() {
  return (
    <div className="container-fluid">
      <div className="container-fluid">
        <form className="mx-auto my-5 " >
          <h4 className="text-center">Admin Dashboard</h4>
          
          
          
          <Link to='/users-list'><button type="submit" className="btn btn-primary mt-5">
            View All Users
          </button></Link>
          <Link to='/create'><button type="submit" className="btn btn-primary mt-5">
            Quiz Category
          </button></Link>
          <Link to="/quiz-questions"> <button type="submit" className="btn btn-primary mt-5">
            Quiz Questions
          </button></Link>
          <Link to="/leaderboard"> <button type="submit" className="btn btn-primary mt-5">
            Leaderboard
          </button></Link>
          <Link to="/admin"><button className="btn btn-danger mt-5">
            Log Out
          </button></Link>
        </form>
      </div>
    </div>
  );
}

export default AdminPage;
