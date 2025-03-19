import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AdminViewQuiz() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const getQuizQuestions = () => {
            fetch(`http://localhost:7000/api/quizzes/${id}`, {
                headers: {
                    'Authorization': `${token}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    navigate('/login');
                    throw new Error('Invalid token');
                }
                return response.json();
            })
            .then(result => {
                
                console.log(result);
                if (result && result.questions) {
                    setQuiz([result]);
                } else {
                    alert('Unexpected response format');
                }
            })
            .catch(err => alert(err.message));
        };

        getQuizQuestions();
    }, [id, token, navigate]);

    return (
        <div className='container'>
            {quiz && quiz.map((item, index) => (
                <React.Fragment key={item._id}>
                    <h3>{item.title}</h3>
                    {Array.isArray(item.questions) && item.questions.map((question, idx) => (
                        <React.Fragment key={question._id}>
                            <ul className="list-group">
                                <p>{question.question}</p>
                                {question.options.map((opt, optIdx) => (
                                    <li key={optIdx} className="list-group-item d-flex justify-content-between align-items-center" style={{  border: "1px solid black", backgroundColor: question.correctAnswer === opt 
                                        ? '#3bc43b' : '#ffffff'}}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                            <br></br>
                        </React.Fragment>
                    ))}
                </React.Fragment>
            ))}
            <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/admin-dashboard') }}>Back to Dashboard</button>
        </div>
    );
}

export default AdminViewQuiz;