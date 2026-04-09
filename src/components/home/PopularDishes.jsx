import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodCard from '../food/FoodCard';
import './PopularDishes.css';

const PopularDishes = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/foods');
        setFoods(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  if (loading) return null; // Or a skeleton

  return (
    <section className="popular-dishes section-padding">
      <div className="container">
        <div className="section-header">
          <h4 className="section-subtitle">Foodies choice</h4>
          <h2 className="section-title">Popular Dishes</h2>
        </div>
        <div className="dishes-grid">
          {foods.length > 0 ? (
            foods.filter(food => food.sellerId?.isOpen).map((food) => (
              <FoodCard key={food._id} food={food} />
            ))
          ) : (
            <p className="no-data">Explore our delicious meals from active sellers!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularDishes;
