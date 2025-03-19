import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    const [quizList, setQuizList] = useState([]);    
    const [msg, setMsg] = useState('');    
    const [userData, setUserData] = useState([]);
    const token = localStorage.getItem('token');

    const getAdminQuiz = () => {
        fetch("http://localhost:7000/api/quizzes/admin", {
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
            // console.log(result);
            if (Array.isArray(result)) {
                setQuizList(result);
            } else {
                setMsg('Unexpected response format');
            }
        })
        .catch(err => setMsg(err.message));
    };

    useEffect(() => {
        getAdminQuiz();
    }, [token, navigate]);

    const createQuiz = () => {
        navigate(`/admin-dashboard/create`);
    };

    const viewQuiz = (id) => {
        navigate(`/admin-dashboard/view/${id}`);
    };

    // const updateQuiz = (id) => {};

    const deleteQuiz = (id) => {
        fetch(`http://localhost:7000/api/quizzes/${id}`, {
            method: 'DELETE',
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
            // console.log(result);
            setMsg(result.message);
            getAdminQuiz();
        })
        .catch(err => setMsg(err.message));
    };

    const analytics = (id) => {
        navigate(`/admin-dashboard/analytics/${id}`);
    };

    useEffect(() => {
        const fetchUserData = () => {
            fetch(`http://localhost:7000/api/auth/data`, {
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
                // console.log(result);
                if (result) {
                    setUserData(result);
                } else {
                    alert('Unexpected response format');
                }
            })
            .catch(err => alert(err.message));
        };

        fetchUserData();
    }, [token, navigate]);

    const logoutUser = () => {
        localStorage.removeItem('token');
        navigate(`/login`);
    }

    return (
        <div className="container">
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Admin Dashboard</h3>
                <div>
                    <button className='btn btn-success' style={{margin: '0 5px'}} onClick={()=>createQuiz()}>Create Quiz</button>
                    <button className='btn btn-dark' style={{margin: '0 5px'}} onClick={()=>logoutUser()}>Logout</button>
                </div>
            </div>
            <br></br>
            
            <h4>My Quizzes</h4>
            <br></br>
            <ul className="list-group">
                {Array.isArray(quizList) && quizList.map((item, index) => (
                    <React.Fragment key={index}>
                        <li className="list-group-item d-flex justify-content-between align-items-center">{item.title}
                            <div>
                                <button className='btn btn-info' style={{margin: '0 5px'}} onClick={()=>analytics(item._id)}>Analytics</button>
                                <button className='btn btn-secondary' style={{margin: '0 5px'}} onClick={()=>viewQuiz(item._id)}>View</button>
                                {/* <button className='btn btn-warning' style={{margin: '0 5px'}} onClick={()=>updateQuiz(item._id)}>Update</button> */}
                                <button className='btn btn-danger' style={{margin: '0 5px'}} onClick={()=>deleteQuiz(item._id)}>Delete</button>
                            </div>
                        </li>
                        <br />
                    </React.Fragment>
                ))}
            </ul>
            <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === ''? '#ffffff' : '#ffff89'}}>
          {msg}
          </div>
          <div className='container'>
            <h4>Users</h4>
            <br></br>
            <>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody> 
                {userData.map((item,idx)=>(
                    <tr>
                        <td>{idx+1}</td>
                        <td>{item.username}</td>
                        <td>{item.firstname}</td>
                        <td>{item.lastname}</td>
                        <td>{item.phone}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </>
          </div>
        </div>
    );
}

export default AdminDashboard;