import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [userData, setUserData] = useState([]);
  const [searchParams] = useSearchParams();
  const userNameLogin = searchParams.get("username");
  const [questionData, setQuestionData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/users")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const nameLogin = userData.find((u) => u.username === userNameLogin);
  const nameLoginSend = nameLogin?.name;

  useEffect(() => {
    axios
      .get("http://localhost:8000/category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  useEffect(() => {
    axios.get('http://localhost:8000/questions')
      .then((res) => setQuestionData(res.data))
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  const handleStartQuiz = (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedType) {
      alert("Please select a category and type before starting the quiz.");
      return;
    }

    const selectedCategoryData = categories.find(
      (category) => category.name === selectedCategory
    );

    if (!selectedCategoryData) {
      alert("Invalid category selected.");
      return;
    }

    const questionsAvailable = questionData.filter(
      (question) =>
        question.catId === selectedCategoryData.id && question.type === selectedType
    );

    if (questionsAvailable.length < numberOfQuestions) {
      setError(true);
      return;
    } else {
      navigate(`/start-quiz?UserName=${userNameLogin}&selectedCategory=${selectedCategoryData.id}&selectedType=${selectedType}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLoginSend}`);
    }
  };

  return (
    <div className="container-fluid mt-3">
      <form className="mt-3 mx-auto">
        <h4 className="text-center">Welcome {nameLogin?.name}</h4>
        <div>
          {error ? (
            <p style={{ color: "red" }}>Not enough questions. Please select another combination.</p>
          ) : null}
          <h3 className="text-center">Quiz Settings</h3>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select Category:
            </label>
            <select
              id="category"
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Select Type:
            </label>
            <select
              id="type"
              className="form-select"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <option value="">Select a type</option>
              <option value="single">Single</option>
              <option value="multiple">Multiple</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="numberOfQuestions" className="form-label">
              Number of Questions:
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              className="form-control"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={handleStartQuiz}>
            Start Quiz
          </button>
          <Link to="/">
            <button className="btn btn-warning mt-3">Quit Quiz</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useSearchParams} from "react-router-dom"; 
// function Dashboard() {
    
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedType, setSelectedType] = useState("");
//     const [numberOfQuestions, setNumberOfQuestions] = useState(5); 
//     const [userData, setUserData]= useState([])
//     const [searchParams] = useSearchParams();
//     const userNameLogin = searchParams.get("username");
//     const [questionData, setQuestionData]=useState([]);
//     const [error, setError] = useState(false)
//     const navigate = useNavigate();
//     //get name send by login user
//     useEffect(() => {
//       axios
//         .get("http://localhost:8000/users") 
//         .then((response) => {
//           setUserData(response.data)
//         })
//         .catch((error) => {
//           console.error("Error fetching categories:", error);
//         });
//     }, []);


//     const nameLogin = userData.find((u)=>u.username === userNameLogin)
//     // console.log(nameLogin)
//     const nameLoginSend = nameLogin?.name
//     //fetching category from quizzes for setting quiz
//     useEffect(() => {
//       axios
//         .get(" http://localhost:8000/category") 
//         .then((response) => {
//           setCategories(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching categories:", error);
//         });
//     }, []);
  
// // category selected 
//     const handleCategoryChange = (e) => {
//       setSelectedCategory(e.target.value);
//       console.log(selectedCategory)
//     };
//   // type selected
//     const handleTypeChange = (e) => {
//       setSelectedType(e.target.value);
//     };
//     useEffect(()=>{
//       axios.get('http://localhost:8000/questions')
//       .then((res)=> setQuestionData(res.data))
      
//     },[])
  
// // onclick function and filter the conditions
//     const handleStartQuiz = (e) => {
//       e.preventDefault()
//       if (!selectedCategory || !selectedType) {
//         alert("Please select a category and type before starting the quiz.");
//         return;
//       }
//       const selectedCategoryData = questionData.find(
//         (quiz) => quiz.category === selectedCategory
//       );
//       const questionsAvailable = selectedCategoryData.questions.filter(
//         (question) => question.type === selectedType
//       );
//       console.log("This is no "+ questionsAvailable.length)
    
//       // Check if the number of questions entered by the user is more than the available questions
//       if (questionsAvailable.length < numberOfQuestions) {
//         setError(true)
        
//         return;
//       }
//       else{
//         navigate(`/start-quiz?UserName=${userNameLogin}&selectedCategory=${selectedCategory}&selectedType=${selectedType}&numberOfQuestions=${numberOfQuestions}&nameLogin=${nameLoginSend}`)
//       }


//     };
    
  
//     return (
//       <div className="container-fluid mt-3"  >
//         <form className="mt-3  mx-auto" >
//         <h4 className="text-center">Welcome {nameLogin?.name} </h4>
//         <div>
//           {error? <p style={{color:"red"}}>Not enough question Please select other combination </p>: null}
//           <h3 className="text-center">Quiz Settings</h3>
//           <div className="mb-3">
//             <label htmlFor="category" className="form-label">
//               Select Category:
//             </label>
//             <select
//               id="category"
//               className="form-select"
//               value={selectedCategory}
//               onChange={handleCategoryChange}
//             >
//               <option value="">Select a category</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.name}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="type" className="form-label">
//               Select Type:
//             </label>
//             <select
//               id="type"
//               className="form-select"
//               value={selectedType}
//               onChange={handleTypeChange}
//             >
//               <option value="">Select a type</option>
//               <option value="single">single</option>
//               <option value="multiple">multiple</option>
//             </select>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="numberOfQuestions" className="form-label">
//               Number of Questions:
//             </label>
//             <input
//               type="number"
//               id="numberOfQuestions"
//               className="form-control"
//               value={numberOfQuestions}
//               onChange={(e) => setNumberOfQuestions(e.target.value)}
//             />
//           </div>
          
          
//           <button className="btn btn-primary" onClick={handleStartQuiz}>
//             Start Quiz
//           </button>
          
//           <Link to="/"><button className="btn btn-warning mt-3">Quit Quiz</button></Link>
//         </div>
//         </form>
//       </div>
//     );
//   }
  
//   export default Dashboard;
  