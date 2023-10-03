import axios from 'axios'
import React from 'react'
import { useState } from 'react'

function CreatedQue() {
    const [ques, setQues] = useState()

  return (
    <div>
        <h2>Add New Question</h2>
        <div>
        <label htmlFor="question">Question</label>
        <input type="text" value={Question} onChange={handleChange}/>
        </div>
        <div>
        <label htmlFor="option">Options</label>
        <input type="text" />
        </div>
    </div>
  )
}

export default CreatedQue

// const [question, setQuestion] = useState("");
// const [options, setOptions] = useState(["", "", "", ""]);
// const [correctAnswer, setCorrectAnswer] = useState(0); 
// const [questionType, setQuestionType] = useState("single");
// const [categories, setCategories] = useState([]);
// const [selectedCategory, setSelectedCategory] = useState("");
// useEffect(() => {
    
//   fetchCategories();
// }, []);

// const fetchCategories = async () => {
//   try {
//     const response = await axios.get("http://localhost:8000/quizzes/{quizId}/questions");
//     setCategories(response.data);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

// const handleOptionChange = (index, value) => {
//   const newOptions = [...options];
//   newOptions[index] = value;
//   setOptions(newOptions);
// };

// const handleCreateQuestion = async () => {
//   const newQuestion = {
//     type: questionType,
//     text: question,
//     options,
//     correctAnswer: questionType === "single" ? options[correctAnswer] : correctAnswer.map(i => options[i]),
//     category: selectedCategory,
//   };

//   try {
//     const response = await axios.post("http://localhost:8000/quizzes/{quizId}/questions", newQuestion);
//     console.log("Question created successfully:", response.data);
//     // Clear the form
//     setQuestion("");
//     setOptions(["", "", "", ""]);
//     setCorrectAnswer(0);
//     setQuestionType("single");
//     setSelectedCategory("");
//   } catch (error) {
//     console.error("Error creating question:", error);
//   }
// };

{/* <h2>Create Question</h2>
      <div>
        <label htmlFor="question">Question Text</label>
        <input
          type="text"
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      <div>
        <label>Question Type</label>
        <div>
          <label>
            Single Choice
            <input
              type="radio"
              value="single"
              checked={questionType === "single"}
              onChange={() => setQuestionType("single")}
            />
          </label>
          <label>
            Multiple Choice
            <input
              type="radio"
              value="multiple"
              checked={questionType === "multiple"}
              onChange={() => setQuestionType("multiple")}
            />
          </label>
        </div>
      </div>
      <div>
        <label>Options</label>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div>
        <label>Correct Answer</label>
        {questionType === "single" ? (
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            {options.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div>
            {options.map((option, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  checked={correctAnswer.includes(index)}
                  onChange={() => {
                    const newCorrectAnswer = correctAnswer.includes(index)
                      ? correctAnswer.filter((i) => i !== index)
                      : [...correctAnswer, index];
                    setCorrectAnswer(newCorrectAnswer);
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
      <div>
        <label>Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateQuestion}>Create Question</button> */}