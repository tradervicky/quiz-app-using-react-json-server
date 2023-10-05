import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLoginPage from './Admin/AdminLogin/AdminLoginPage';
import AdminPage from './Admin/AdminLogin/AdminPage';
import AdminRegister from './Admin/AdminLogin/AdminRegister';
// import AddCategory from './Admin/AdminLogin/Quiz Category/AddCategory';
import CreateCategory from './Admin/AdminLogin/CreateCategory';
import QuizQuestionCreate from './Admin/AdminLogin/Quiz  Questions CRUD/Create/QuizQuestionCreate';
import LeaderBoard from './Admin/AdminLogin/Quiz  Questions CRUD/LeaderBoard';
import QuizQuestions from './Admin/AdminLogin/Quiz  Questions CRUD/QuizQuestions';
import Read from './Admin/AdminLogin/Quiz  Questions CRUD/Read/Read';
import DeleteCategory from './Admin/AdminLogin/Quiz Category/DeleteCategory';
import ReadCategory from './Admin/AdminLogin/Quiz Category/ReadCategory';
import UpdateCategory from './Admin/AdminLogin/Quiz Category/UpdateCategory';
import ViewUsers from './Admin/AdminLogin/ViewUsers';
import './App.css';
import UserLeader from './User/LeaderBoard/UserLeader';
import Dashboard from './User/Login/Dashboard';
import UserLogin from './User/Login/UserLogin';
import UserRegister from './User/Login/UserRegister';
import ResultPage from './User/Start Quiz/ResultPage';
import StartQuiz from './User/Start Quiz/StartQuiz';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<UserLogin />}/>     
      <Route path="/user-register" element={<UserRegister />}/>
      <Route path="/user-dashboard" element={<Dashboard />}/>
      <Route path="/start-quiz" element={<StartQuiz />}/>
      <Route path="/result" element={<ResultPage />}/>
      <Route path="/user-leaderboard" element={<UserLeader />}/>


        <Route path="/admin" element={<AdminLoginPage />}/>
        <Route path="/admin-page" element={<AdminPage />}/>
        <Route path="/admin-register" element={<AdminRegister />}/>
        <Route path="/create" element={<CreateCategory />}/>
        <Route path="/read-category" element={<ReadCategory />}/>
        <Route path="/update-category" element={<UpdateCategory />}/>
        <Route path="/delete-category" element={<DeleteCategory />}/>
        <Route path="/users-list" element={<ViewUsers />}/>
        <Route path="/quiz-questions" element={<QuizQuestions />}/>
        <Route path="/create-question" element={<QuizQuestionCreate />}/>
        <Route path="/read-quiz-questions" element={<Read />}/>                
        <Route path="/leaderboard" element={<LeaderBoard />}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
