import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axios.get('http://localhost:5000/api/wishlist', config);
      setWishlist(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  const toggleWishlist = async (foodId) => {
    if (!token) return alert('Please login to manage favorites');
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };
      const { data } = await axios.post('http://localhost:5000/api/wishlist/toggle', {
        foodId
      }, config);
      setWishlist(data);
    } catch (error) {
      console.error('Toggle wishlist failed:', error);
      alert('Failed to update wishlist');
    }
  };

  const isInWishlist = (foodId) => {
    return wishlist.items.some(item => (item.foodId._id || item.foodId) === foodId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
