import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {
    
    const [msg, setMsg] = useState('');
    const [colorVal, setValue] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        role: 'user' // Default role as 'user'
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { phone, password, role } = formData;

        try {
            const response = await fetch("http://localhost:7000/api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phone, password, role })
            });
            const result = await response.json();
            if (response.ok) {
                setMsg('Login Successful!');
                setValue(true)
                localStorage.setItem('token', result.token);
                if (role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/my-dashboard');
                }
            } else {
                setMsg(result.error);
                setValue(false)
            }
        } catch (error) {
            setMsg('Login failed');
            setValue(false);
        }
    };

    return (
        <div className='container'>
            <div className='row'></div>
            <form className='mx-auto' style={{ maxWidth: '600px' }} onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Login</button>
            </form>
            <div className='text-center mt-3'>
                <p>New here? <Link to="/">Register now</Link></p>
            </div>
            <div style={{ textAlign: "center", padding: "10px", backgroundColor: msg === ''? '#ffffff' : (colorVal? '#b1ffb1' : '#ff7676')}}>
          {msg}
          </div>
        </div>
    );
}

export default Login;