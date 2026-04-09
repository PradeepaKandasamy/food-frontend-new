import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pizza, GlassWater, Sandwich, Salad, IceCream, Utensils } from 'lucide-react';
import './CategoryPreview.css';

const categoryIcons = {
  'Burger': <Pizza size={32} />, // Using Pizza as fallback for Burger icon
  'Pizza': <Pizza size={32} />,
  'Beverage': <GlassWater size={32} />,
  'Salad': <Salad size={32} />,
  'Dessert': <IceCream size={32} />,
  'Sandwich': <Sandwich size={32} />
};

const CategoryPreview = () => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/foods`);
        const grouped = data.reduce((acc, food) => {
          if (food.sellerId?.isOpen) {
            acc[food.category] = (acc[food.category] || 0) + 1;
          }
          return acc;
        }, {});
        setCounts(grouped);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const availableCategories = Object.keys(counts).filter(cat => counts[cat] > 0);

  if (loading) return null;

  return (
    <section className="category-preview section-padding">
      <div className="container">
        <div className="section-header">
          <h4 className="section-subtitle">What's your food mood?</h4>
          <h2 className="section-title">Explore Categories</h2>
        </div>
        <div className="category-grid">
          {availableCategories.length > 0 ? (
            availableCategories.map((cat) => (
              <div key={cat} className="category-card" style={{cursor: 'pointer'}}>
                <div className="category-icon-bg">
                  {categoryIcons[cat] || <Utensils size={32} />}
                </div>
                <h3 className="category-name">{cat}</h3>
                <p className="category-count">{counts[cat]} items available</p>
              </div>
            ))
          ) : (
             <p className="no-data" style={{textAlign: 'center', gridColumn: 'span 6', padding: '40px'}}>
               Start adding delicious meals to see them here!
             </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryPreview;
