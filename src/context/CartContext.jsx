import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const fetchCart = async () => {
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, config);
      setCart(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (food) => {
    if (!token) return alert('Please login to add to cart first! 🔐');
    try {
      console.log("Adding to Cart - UserID:", userInfo._id);
      console.log("Adding to Cart - Food Info:", food);

      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        userId: userInfo._id,
        food: {
          foodId: food._id,
          name: food.name,
          price: food.price,
          image: food.image,
          quantity: 1
        }
      }, config);
      setCart(data);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateQuantity = async (foodId, action) => {
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update`, { foodId, action }, config);
      setCart(data);
    } catch (error) {
      console.error('Update quantity failed:', error);
    }
  };

  const removeFromCart = async (foodId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove/${foodId}`, config);
      setCart(data);
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
