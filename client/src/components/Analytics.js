import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Analytics() {
    
    const { id } = useParams();
    const navigate = useNavigate();
    const [resultList, setResultList] = useState([]);
    const [quizData, setQuizData] = useState({});
    const [userData, setUserData] = useState({});
    const token = localStorage.getItem('token');

    function formatDate(mongoDate) {
        const date = new Date(mongoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    
    useEffect(() => {
        const getUserResults = () => {
            fetch(`http://localhost:7000/api/results/${id}`, {
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
                if (Array.isArray(result)) {
                    console.log(result);
                    setResultList(result);
                } else {
                    alert('Unexpected response format');
                }
            })
            .catch(err => alert(err.message));
        };

        getUserResults();
    }, [id, token, navigate]);

    useEffect(() => {
        const fetchQuizData = async () => {
            const quizDataMap = {};
            for (const result of resultList) {
                const response = await fetch(`http://localhost:7000/api/quizzes/${result.quizId}`, {
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (response.ok) {
                    const quiz = await response.json();
                    quizDataMap[result.quizId] = quiz;
                } else {
                    navigate('/login');
                    throw new Error('Invalid token');
                }
            }
            setQuizData(quizDataMap);
        };

        if (resultList.length > 0) {
            fetchQuizData();
        }
    }, [resultList, token, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch("http://localhost:7000/api/auth/data", {
                headers: {
                    'Authorization': `${token}`
                }
            });
            if (response.ok) {
                const users = await response.json();
                const userDataMap = {};
                users.forEach(user => {
                    userDataMap[user._id] = user;
                });
                setUserData(userDataMap);
            } else {
                navigate('/login');
                throw new Error('Invalid token');
            }
        };

        fetchUserData();
    }, [token, navigate]);

    return (
        <div className="container">
            {resultList.map((result, index) => {
                const quiz = quizData[result.quizId];
                const user = userData[result.userId];
                const formattedDate = formatDate(result.createdAt);
                return (
                    quiz && user && (
                        <div key={index} className="mb-4" style={{ boxShadow: "10px 10px 8px #999999", padding:"20px", border: "1px solid black"}}>
                            <h3>{quiz.title}</h3>
                            <h5>Attended on: {formattedDate}</h5>
                            <h5>User: {user.firstname} {user.lastname} ({user.username})</h5>
                            <h5>Score: {result.score}</h5>
                            <br></br>
                            {quiz.questions.map((question, qIndex) => {
                                const userAnswer = result.answers.find(answer => answer.questionId === question._id);
                                return (
                                    <div key={qIndex} className="mb-2">
                                        <h5>{question.question}</h5>
                                        <table className="table table-bordered">
                                            <tr>
                                                <th style={{ width:"20%" }}>Their Answer</th>
                                                <td>{userAnswer ? userAnswer.selectedAnswer : 'No answer provided'}</td>
                                            </tr>
                                            <tr className="table-success">
                                                <th style={{ width:"20%" }}>Correct Answer</th>
                                                <td>{question.correctAnswer}</td>
                                            </tr>      
                                        </table>
                                        <br></br>
                                    </div>
                                );
                            })}
                        </div>
                    )
                );
            })}
            <button type="button" className="btn btn-primary" onClick={()=>{ navigate('/admin-dashboard') }}>Back to Dashboard</button>
        </div>
    );
}

export default Analytics;