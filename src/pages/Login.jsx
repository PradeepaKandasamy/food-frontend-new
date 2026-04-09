import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
        config
      );

      console.log('Login Success:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Login Successful!');
      
      // Redirect based on role
      if (data.role === 'seller') {
        navigate('/seller');
      } else if (data.role === 'delivery') {
        navigate('/delivery');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
           <Link to="/" className="logo">FEAST<span className="accent">FLOW</span></Link>
           <h2>Welcome Back</h2>
           <p>Log in to your account to continue ordering.</p>
        </div>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
           <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
           </div>
           <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <div className="password-input-wrapper">
                 <input 
                   type={showPassword ? "text" : "password"} 
                   placeholder="••••••••" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required 
                 />
                 <button 
                   type="button" 
                   className="password-toggle-btn" 
                   onClick={() => setShowPassword(!showPassword)}
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
           </div>
           <div className="form-options">
              <label><input type="checkbox" /> Remember Me</label>
              <a href="#">Forgot Password?</a>
           </div>
           <button type="submit" className="primary-btn full-width flex-center gap-2">
              Log In <LogIn size={20} />
           </button>
        </form>
        <div className="auth-footer">
           <p>Don't have an account? <Link to="/signup" className="accent-color">Sign up for free</Link></p>
        </div>
      </div>
      <div className="auth-promo">
         <h2>THE FASTEST <br /> DELIVERY IN <br /> <span className="primary-color">TOWN</span></h2>
         <ArrowRight className="promo-arrow" size={60} />
      </div>
    </div>
  );
};

export default Login;
