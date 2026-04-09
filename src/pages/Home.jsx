import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import CategoryPreview from '../components/home/CategoryPreview';
import HotelSection from '../components/home/HotelSection';
import PopularDishes from '../components/home/PopularDishes';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      <main>
        <Hero />
        <CategoryPreview />
        <HotelSection />
        <PopularDishes />
        {/* Adds more sections here if needed: Offers, Testimonials */}
        <section className="section-padding">
           <div className="container">
              <div className="cta-box primary-btn" style={{textAlign: 'center', height: 'auto', padding: '60px'}}>
                  <h2 style={{fontSize: '32px', marginBottom: '20px'}}>Special Weekend Offer!</h2>
                  <p style={{marginBottom: '30px', textTransform: 'none'}}>Get 30% off on all home-cooked meals this Saturday and Sunday.</p>
                  <button className="accent-btn">Claim Offer</button>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
