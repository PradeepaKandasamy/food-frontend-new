import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const isOutOfStock = food.stock === 0;
  const isHotelOpen = food.isHotelOpen !== false;

  const handleAddToCart = async () => {
    await addToCart(food);
    navigate('/cart');
  };

  const isLiked = isInWishlist(food._id);

  return (
    <div className={`food-card ${!isHotelOpen ? 'hotel-closed' : ''}`}>
      <div className="food-img-container">
        <img src={food.image} alt={food.name} className="food-img" />
        
        {!isHotelOpen && (
          <div className="overlay">
            <div className="overlay-content">
              <h3>Hotel Closed 😴</h3>
            </div>
          </div>
        )}

        <button 
          className={`wishlist-btn ${isLiked ? 'active' : ''}`}
          onClick={() => toggleWishlist(food._id)}
        >
          <Heart size={18} fill={isLiked ? "var(--primary-color)" : "none"} stroke={isLiked ? "var(--primary-color)" : "currentColor"} />
        </button>
        <div className="food-rating flex-center">
          <Star size={12} fill="currentColor" />
          <span>4.5</span>
        </div>
      </div>
      <div className="food-info">
        <div className="food-header">
          <h3 className="food-name">{food.name}</h3>
          <span className="food-price">₹{(food.price * 83).toLocaleString('en-IN')}</span>
        </div>
        <p className="food-category">{food.category}</p>
        <p className="food-seller">By {food.sellerId?.hotelName || 'Special Seller'}</p>
        
        <button 
          className="add-to-cart-btn flex-center gap-2" 
          disabled={isOutOfStock || !isHotelOpen}
          onClick={handleAddToCart}
        >
          {!isHotelOpen ? (
            "Closed"
          ) : isOutOfStock ? (
            "OUT OF STOCK"
          ) : (
            <><ShoppingCart size={18} /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
