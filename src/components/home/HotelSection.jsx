import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChefHat, MapPin, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './HotelSection.css';

const HotelSection = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/sellers`);
        setHotels(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollLeft -= 300;
    } else {
      current.scrollLeft += 300;
    }
  };

  if (loading) return null;

  return (
    <section className="hotel-section section-padding">
      <div className="container">
        <div className="section-header flex-center-between">
          <div className="header-text">
            <h2 className="section-title">Available Hotels</h2>
            <p className="section-subtitle">Discover the best culinary spots in town</p>
          </div>
          <div className="scroll-controls">
            <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="hotel-scroll-container" ref={scrollRef}>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <div className="hotel-card" key={hotel._id}>
                <div className="hotel-image">
                  <div className="hotel-placeholder">
                    <ChefHat size={40} />
                  </div>
                  <div className="hotel-badge">Top Rated</div>
                </div>
                <div className="hotel-info">
                  <div className="hotel-main">
                    <h3>{hotel.hotelName}</h3>
                    <div className="hotel-rating">
                      <Star size={14} fill="var(--primary-color)" stroke="var(--primary-color)" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <p className="hotel-location">
                    <MapPin size={14} /> {hotel.location}
                  </p>
                  <div className="hotel-tags">
                    <span className="tag">Free Delivery</span>
                    <span className="tag">30-40 min</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No hotels available right now.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelSection;
