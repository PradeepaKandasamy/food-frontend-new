import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowRight, MapPin, Phone, Building, CreditCard, Bike, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    hotelName: '',
    phone: '',
    location: '',
    paymentMethod: 'UPI',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { name, email, password, role, hotelName, phone, location, paymentMethod } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      `${import.meta.env.VITE_API_URL}/api/auth/register`,
      formData,
      config
    );
      console.log('Registration Success:', data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      alert('Registration Successful!');
      
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
           <h2>Create Account</h2>
           <p>Join the community and start your foodie journey.</p>
        </div>
        {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
               <label>Join as</label>
               <div className="role-selection">
                  <div 
                    className={`join-option ${role === 'user' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                  >
                    <User size={18} /> User
                  </div>
                  <div 
                    className={`join-option ${role === 'seller' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'seller' })}
                  >
                    <Building size={18} /> Seller
                  </div>
                  <div 
                    className={`join-option ${role === 'delivery' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'delivery' })}
                  >
                    <Bike size={18} /> Delivery
                  </div>
               </div>
            </div>
           
           <div className="form-group">
              <label><User size={16} /> Full Name</label>
              <input 
                type="text" 
                name="name"
                value={name}
                onChange={onChange}
                placeholder="John Doe" 
                required 
              />
           </div>
           
           <div className="form-group">
              <label><Mail size={16} /> Email Address</label>
              <input 
                type="email" 
                name="email"
                value={email}
                onChange={onChange}
                placeholder="you@example.com" 
                required 
              />
           </div>

           {role === 'seller' && (
             <>
               <div className="form-group">
                  <label><Building size={16} /> Hotel Name</label>
                  <input 
                    type="text" 
                    name="hotelName"
                    value={hotelName}
                    onChange={onChange}
                    placeholder="Grand Plaza Hotel" 
                    required 
                  />
               </div>
               <div className="form-group">
                  <label><Phone size={16} /> Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    placeholder="+91 9876543210" 
                    required 
                  />
               </div>
               <div className="form-group">
                  <label><MapPin size={16} /> Location</label>
                  <input 
                    type="text" 
                    name="location"
                    value={location}
                    onChange={onChange}
                    placeholder="New Delhi, India" 
                    required 
                  />
               </div>
               <div className="form-group">
                  <label><CreditCard size={16} /> Payout Method</label>
                  <select name="paymentMethod" value={paymentMethod} onChange={onChange}>
                     <option value="UPI">UPI (Fast Payout)</option>
                     <option value="Bank">Bank Transfer</option>
                  </select>
               </div>
             </>
           )}

           {role === 'delivery' && (
             <>
               <div className="form-group">
                  <label><Phone size={16} /> Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={phone}
                    onChange={onChange}
                    placeholder="+91 9876543210" 
                    required 
                  />
               </div>
               <div className="form-group">
                  <label><Bike size={16} /> Vehicle Type</label>
                  <select name="vehicleType" value={formData.vehicleType || 'bike'} onChange={onChange}>
                     <option value="bike">Motorcycle / Bike</option>
                     <option value="cycle">Bicycle</option>
                  </select>
               </div>
             </>
           )}

            <div className="form-group">
               <label><Lock size={16} /> Password</label>
               <div className="password-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="••••••••" 
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
           <button type="submit" className="primary-btn full-width flex-center gap-2">
              Sign Up <UserPlus size={20} />
           </button>
        </form>
        <div className="auth-footer">
           <p>Already have an account? <Link to="/login" className="accent-color">Log in here</Link></p>
        </div>
      </div>
      <div className="auth-promo">
         <h2>JOIN THE <br /> REVOLUTION <br /> IN <span className="primary-color">FOOD</span></h2>
         <ArrowRight className="promo-arrow" size={60} />
      </div>
    </div>
  );
};

export default Signup;
