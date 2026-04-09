import React from 'react';
import { Share2, Send, Camera, Video, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="logo">FEAST<span className="accent">FLOW</span></h2>
            <p className="footer-desc">
              Discover the best food from hotels and home kitchens. Fast delivery and premium service.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><Share2 size={20} /></a>
              <a href="#" className="social-link"><Send size={20} /></a>
              <a href="#" className="social-link"><Camera size={20} /></a>
              <a href="#" className="social-link"><Video size={20} /></a>
            </div>
          </div>
          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/categories">Menu</a></li>
              <li><a href="/game">Food AI</a></li>
              <li><a href="/seller">Sell Food</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h3 className="footer-title">Customer Care</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><a href="/wishlist">Wishlist</a></li>
              <li><a href="/login">Account</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-item">
              <Phone size={18} />
              <span>+1 234 567 8900</span>
            </div>
            <div className="contact-item">
              <Mail size={18} />
              <span>support@feastflow.com</span>
            </div>
            <div className="contact-item">
              <MapPin size={18} />
              <span>123 Foodie Street, New York, NY</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 FeastFlow. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
