import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FoodCard from '../components/food/FoodCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, loading } = useWishlist();

  if (loading) return <div className="loading">Loading Wishlist...</div>;

  return (
    <div className="wishlist-page">
      <Header />
      <main className="wishlist-main section-padding" style={{paddingTop: '160px'}}>
        <div className="container">
          <div className="section-header" style={{textAlign: 'center', marginBottom: '60px'}}>
             <Heart size={48} className="primary-color" style={{margin: '0 auto 20px'}} stroke="none" fill="var(--primary-color)" />
             <h1 className="section-title">Favorite <span className="accent">Dishes</span></h1>
             <p style={{color: 'var(--text-muted)', marginTop: '10px'}}>Items you've liked for later</p>
          </div>

          {wishlist.items.length > 0 ? (
            <div className="dishes-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
               {wishlist.items.map((item) => (
                  <FoodCard key={item.foodId._id} food={item.foodId} />
               ))}
            </div>
          ) : (
            <div className="empty-wishlist" style={{textAlign: 'center', padding: '100px 20px', backgroundColor: 'var(--card-bg)', borderRadius: '20px'}}>
              <ShoppingBag size={64} style={{color: 'rgba(255,255,255,0.1)', marginBottom: '20px'}} />
              <h3>Your wishlist is empty</h3>
              <p style={{color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '15px auto 30px'}}>Start browsing our delicious menu and save your favorite dishes for later.</p>
              <Link to="/categories" className="primary-btn">Explore Menu</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
