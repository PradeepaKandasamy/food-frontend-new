import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, X } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="hero">
      {showVideo && (
        <div className="video-modal-overlay" onClick={() => setShowVideo(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-video-btn" onClick={() => setShowVideo(false)}>
              <X size={24} />
            </button>
            <div className="iframe-container">
              <iframe
                src="https://www.youtube.com/embed/xPPLbEFbCAo?autoplay=1&mute=1"
                title="Food Promo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="promo-video-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <div className="container hero-container">
        <div className="hero-content">
          <h4 className="hero-subtitle">Premium Food Experience</h4>
          <h1 className="hero-title">
            DELICIOUS FOOD <br />
            <span className="text-outline">DELIVERED TO YOUR </span> <br />
            <span className="accent">DOORSTEP</span>
          </h1>
          <p className="hero-description">
            Experience the finest culinary delights from top hotels and local homes. 
            Fast, fresh, and flavored just for you.
          </p>
          <div className="hero-btns">
            <button className="primary-btn flex-center gap-2" onClick={() => navigate('/categories')}>
              Order Now <ArrowRight size={20} />
            </button>
            <button className="play-btn flex-center" onClick={() => setShowVideo(true)}>
              <span className="play-icon-container flex-center">
                <Play size={18} fill="currentColor" />
              </span>
              Watch Video
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Partner Hotels</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-blob"></div>
          {/* I'll generate a high quality food image for this */}
          <div className="hero-img-overlay" onClick={() => setShowVideo(true)} style={{cursor: 'pointer'}}>
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600" alt="Delicious Food" className="hero-img" />
            <div className="img-play-overlay flex-center">
              <div className="img-play-btn flex-center">
                <Play size={32} fill="white" color="white" />
              </div>
            </div>
          </div>
          <div className="floating-card top-right">
            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100" />
            <div>
              <span>Healthy Bowl</span>
              <div className="rating">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
          <div className="floating-card bottom-left">
            <span>Fastest Delivery</span>
            <p>Under 30 mins</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
