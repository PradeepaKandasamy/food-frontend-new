import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Bike } from 'lucide-react';
import axios from 'axios';
import '../Auth.css';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        'http://localhost:5000/api/delivery/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Delivery Partner Login Successful!');
      navigate('/delivery');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
           <Link to="/" className="logo">FEAST<span className="accent">FLOW</span> <span className="role-badge">Delivery</span></Link>
           <h2>Partner Login</h2>
           <p>Log in to your delivery partner account.</p>
        </div>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
           <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                placeholder="partner@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
           </div>
           <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
           </div>
           <button type="submit" className="primary-btn full-width flex-center gap-2">
              Log In <LogIn size={20} />
           </button>
        </form>
        <div className="auth-footer">
           <p>Not a partner yet? <Link to="/signup" className="accent-color">Register as partner</Link></p>
        </div>
      </div>
      <div className="auth-promo" style={{backgroundColor: '#FF9800'}}>
         <h2>READY TO <br /> DELIVER <br /> <span className="primary-color">SMILES?</span></h2>
         <Bike className="promo-arrow" size={100} style={{transform: 'none'}} />
      </div>
    </div>
  );
};

export default DeliveryLogin;
