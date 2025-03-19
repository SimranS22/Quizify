import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [msg, setMsg] = useState('');
    const token = localStorage.getItem('token');

    // Date in DD-MM-YYYY HH:MM:SS
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

    // GET Quiz List for User
    useEffect(() => {
        const getUserQuiz = () => {
            fetch("http://localhost:7000/api/quizzes", {
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
                    setQuizList(result);
                } else {
                    setMsg('Unexpected response format');
                }
            })
            .catch(err => setMsg(err.message));
        };

        getUserQuiz();
    }, [token, navigate]);

    // GET Quiz Attendance for User
    useEffect(() => {
        const getUserResults = () => {
            fetch("http://localhost:7000/api/results", {
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
                    setResultList(result);
                } else {
                    setMsg('Unexpected response format');
                }
            })
            .catch(err => setMsg(err.message));
        };
    
        getUserResults();
    }, [token, navigate]);

    // NAVIGATE User to take Quiz
    const takeQuiz = (id) => {
        navigate(`/my-dashboard/quiz/${id}`);
    }

    // NAVIGATE to view Quizzes Attended
    const viewQuizHistory = () => {
        navigate(`/my-dashboard/results`);
    }

    // User Logout
    const logoutUser = () => {
        localStorage.removeItem('token');
        navigate(`/login`);
    }

    return (
        <div className="container">
            <div className='d-flex justify-content-between align-items-center'>
                <h3>User Dashboard</h3>
                <div>
                    <button className='btn btn-success' style={{margin: '0 5px'}} onClick={()=>viewQuizHistory()}>Quiz History</button>
                    <button className='btn btn-dark' style={{margin: '0 5px'}} onClick={()=>logoutUser()}>Logout</button>
                </div>
            </div>
            <br></br>
            <ul className="list-group">
                {Array.isArray(quizList) && quizList.map((item, index) => {
                    const result = resultList.find(result => result.quizId === item._id);
                    const formattedDate = result ? formatDate(result.createdAt) : null;
                    return (
                        <React.Fragment key={index}>
                            <li className="list-group-item d-flex justify-content-between align-items-center" style={{ boxShadow: "10px 10px 8px #999999", border: "1px solid black"}}>
                                <div>
                                <b>{item.title}</b>
                                <br></br>
                                {result && <span>Attended On: {formattedDate}</span>}
                                </div>
                                <button className='btn btn-info' onClick={()=>takeQuiz(item._id)} disabled={!!result}>Take Quiz</button>
                            </li>
                            <br />
                        </React.Fragment>
                    );
                })}
            </ul>
            <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === ''? '#ffffff' : '#ffff89'}}>
          {msg}
          </div>
        </div>
    );
}

export default UserDashboard;