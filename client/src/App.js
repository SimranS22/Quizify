import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import './App.css';
import AdminDashboard from './components/AdminDashboard';
import AdminViewQuiz from './components/AdminViewQuiz';
import UserDashboard from './components/UserDashboard';
import TakeQuiz from './components/TakeQuiz';
import QuizResults from './components/QuizResults';
import Analytics from './components/Analytics';
import CreateQuiz from './components/CreateQuiz';
import ExcelToJson from './components/ExcelToJson';

function App() {
  const location = useLocation();
  const [colorVal, setValue] = useState(false);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    role: 'user' // Default 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fname, lname, email, phone, password, role } = formData;
    const username = `${fname}-${lname}`.toLowerCase();
    const firstname = fname;
    const lastname = lname;
    const data = { username, firstname, lastname, email, phone, password, role };

    try {
      const response = await fetch("http://localhost:7000/api/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      setMsg(result.message);
      setValue(true)
    } catch (error) {
      setMsg('Registration failed');
      setValue(false);
    }
  };
  


  return (
    <div className='container' style={{ marginTop: '50px', marginBottom: '50px' }}>
      <h2 style={{ textAlign: 'center' }}>Quizify</h2>
      <br />
      {location.pathname === '/' && (
        <>
          <div className='row'></div>
          <form className='mx-auto' style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="fname" style={{ fontWeight: 'bold' }}>First Name</label>
                <input type="text" className="form-control" id="fname" name="fname" onChange={handleChange} required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="lname" style={{ fontWeight: 'bold' }}>Last Name</label>
                <input type="text" className="form-control" id="lname" name="lname" onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label>
              <input type="email" className="form-control" id="email" name="email" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone" style={{ fontWeight: 'bold' }}>Phone</label>
              <input type="number" className="form-control" id="phone" name="phone" onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="password" style={{ fontWeight: 'bold' }}>Password</label>
                <input type="password" className="form-control" id="password" name="password" onChange={handleChange} required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="role" style={{ fontWeight: 'bold' }}>Role</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="user" value="user" onChange={handleChange} checked={formData.role === 'user'} />
                    <label className="form-check-label" htmlFor="user">User</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="role" id="admin" value="admin" onChange={handleChange} checked={formData.role === 'admin'} />
                    <label className="form-check-label" htmlFor="admin">Admin</label>
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Register</button>
          </form>
          <div className='text-center mt-3'>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>
          <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === ''? '#ffffff' : (colorVal? '#b1ffb1' : '#ff7676')}}>
          {msg}
          </div>
        </>
      )}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path="/admin-dashboard/view/:id" element={<AdminViewQuiz />} />         
        <Route path="/admin-dashboard/create" element={<CreateQuiz />} /> 
        <Route path='/my-dashboard' element={<UserDashboard />} /> 
        <Route path="/my-dashboard/quiz/:id" element={<TakeQuiz />} /> 
        <Route path="/my-dashboard/results" element={<QuizResults />} />        
        <Route path="/admin-dashboard/analytics/:id" element={<Analytics />} />          
        <Route path="/excel" element={<ExcelToJson />} /> 
      </Routes>
    </div>
  );
}

export default App;