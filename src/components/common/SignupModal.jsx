import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, UserPlus, Gift } from 'lucide-react';
import './SignupModal.css';

const SignupModal = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has visited before or is already logged in
    const hasVisited = localStorage.getItem('visited');
    const userInfo = localStorage.getItem('userInfo');

    if (!hasVisited && !userInfo) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000); // Show after 2 seconds for better UX

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    localStorage.setItem('visited', 'true');
  };

  const handleSignup = () => {
    setShowModal(false);
    localStorage.setItem('visited', 'true');
    navigate('/signup');
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="modal-icon-wrapper">
          <Gift size={40} color="white" />
        </div>

        <h2>Join the Feast! 🍕</h2>
        <p>
          Signup today and get exclusive access to thousands of home-cooked meals 
          and special weekend offers.
        </p>

        <div className="modal-actions">
          <button className="signup-action-btn primary" onClick={handleSignup}>
            Create Free Account
          </button>
          <button className="signup-action-btn secondary" onClick={handleClose}>
            Maybe later, I'm just looking
          </button>
        </div>

        <div style={{ marginTop: '24px', fontSize: '0.8rem', color: '#666' }}>
          By joining, you agree to our Terms of Service.
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
