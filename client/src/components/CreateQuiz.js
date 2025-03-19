import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [currentCorrectAnswer, setCurrentCorrectAnswer] = useState('');    
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();    
  // const [jsonData, setJsonData] = useState(null);
  const token = localStorage.getItem('token');

  const handleAddQuestion = () => {
    const newQuestion = {
      question: currentQuestion,
      options: currentOptions,
      correctAnswer: currentCorrectAnswer
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCurrentCorrectAnswer('');
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };

  const resetQuestion= () => {
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCurrentCorrectAnswer('');
  }

  const handleSubmit = () => {
    const quizData = {
      title,
      questions
    };
    // console.log(JSON.stringify(quizData, null, 2));
    fetch("http://localhost:7000/api/quizzes/create", {
            method: "POST",
            headers: {                
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quizData, null, 2)
        })
        .then((response) => {
            if (!response.ok) {
                navigate('/login');
                throw new Error('Invalid token');
            }
            return response.json();
        })
        .then((result) => {
            // console.log(result);
            setMsg(result.message);
            navigate('/admin-dashboard');
        })
        .catch(err => alert(err.message));
  };

  const uploadXlsx = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const title = data[0][1];
      const questions = data.slice(2).map(row => ({
        question: row[0],
        options: [row[1], row[2], row[3], row[4]],
        correctAnswer: row[5]
      }));

      setTitle(title);
      setQuestions(questions);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h4>Create a Quiz</h4>      
        <label className='btn btn-info'>
            Upload Questions
            <input type="file" onChange={uploadXlsx} style={{ display: 'none' }} />
        </label>
      </div>
      <div>
        <label style={{ fontWeight: "bold" }}>Quiz Title:</label>
        <input
          className="form-control"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br></br>
      <div className='container'>
        <label style={{ fontWeight: "bold" }}>Question:</label>
        <input
          className="form-control"
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
        />
      </div>
      <div>
        {currentOptions.map((option, index) => (
          <div key={index} className='container'>
            <label style={{ fontWeight: "bold" }}>Option {index + 1}:</label>
            <input
              className="form-control"
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className='container'>
        <label style={{ fontWeight: "bold" }}>Correct Answer:</label>
        <input
          className="form-control"
          type="text"
          value={currentCorrectAnswer}
          onChange={(e) => setCurrentCorrectAnswer(e.target.value)}
        />
      </div>
      <br></br>
      <div className='d-flex justify-content-between align-items-center'>
        <button className='btn btn-secondary' onClick={handleAddQuestion}>Add Question</button>
        <button className='btn btn-light' onClick={resetQuestion}>Reset</button>
        <button className='btn btn-success' onClick={handleSubmit}>Create Quiz</button>
        <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/admin-dashboard') }}>Back to Dashboard</button>
      </div>
      
      <br></br>
      <h4 className='align-items-center'>Template</h4>
      <div className='container'>
          <h5>{title}</h5>
          {questions.map((question, idx) => (
                <>                
                <ul className="list-group">
                    <h5>{question.question}</h5>
                    {question.options.map((opt, optIdx) => (
                        <li key={optIdx} className="list-group-item d-flex justify-content-between align-items-center" style={{  border: "1px solid black", backgroundColor: question.correctAnswer === opt 
                            ? '#3bc43b' : '#ffffff'}}>
                            {opt}
                        </li>
                    ))}
                  </ul>
                  <br></br>
                </>
            ))}
            
        </div>
      {/* <pre>{JSON.stringify({ title, questions }, null, 2)}</pre> */}
      <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === ''? '#ffffff' : '#ffff89'}}>
          {msg}
      </div>
    </div>
  );
};

export default CreateQuiz;