import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FoodCard from '../components/food/FoodCard';
import { Filter, Search, ChevronDown } from 'lucide-react';

const Categories = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

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

  const categories = ['All', 'Burger', 'Pizza', 'Salad', 'Beverage', 'Dessert', 'Sandwich'];

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
    const isSellerOpen = food.sellerId?.isOpen;
    return matchesSearch && matchesCategory && isSellerOpen;
  });

  if (loading) return null;

  return (
    <div className="categories-page">
      <Header />
      <main className="categories-main section-padding" style={{paddingTop: '160px'}}>
        <div className="container">
           <div className="cat-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px'}}>
              <div>
                 <h1 className="section-title">Explore Our <span className="accent">Menu</span></h1>
                 <p style={{color: 'var(--text-muted)', marginTop: '10px'}}>Browse from {filteredFoods.length} delicious items</p>
              </div>
              <div className="cat-filters" style={{display: 'flex', gap: '20px'}}>
                 <div className="search-pill" style={{backgroundColor: 'var(--card-bg)', padding: '12px 25px', borderRadius: '30px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <Search size={18} color="var(--text-muted)" />
                    <input 
                      type="text" 
                      placeholder="Search dish..." 
                      style={{background: 'none', border: 'none', color: 'white', outline: 'none', width: '150px'}}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
              </div>
           </div>

           <div className="cat-tags" style={{display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '60px'}}>
              {categories.map((cat) => (
                 <button 
                  key={cat} 
                  className={`tag ${activeCategory === cat ? 'active' : ''}`} 
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '10px 25px', 
                    borderRadius: '25px', 
                    background: activeCategory === cat ? 'var(--primary-color)' : 'var(--card-bg)', 
                    color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                 >
                   {cat}
                 </button>
              ))}
           </div>

           <div className="dishes-grid" style={{
             display: 'grid',
             gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
             gap: '30px'
           }}>
              {filteredFoods.length > 0 ? (
                filteredFoods.map((dish) => (
                   <FoodCard key={dish._id} food={dish} />
                ))
              ) : (
                <p className="no-data" style={{gridColumn: 'span 4', textAlign: 'center', padding: '100px', fontSize: '18px', color: 'var(--text-muted)'}}>
                  No dishes found matching your criteria.
                </p>
              )}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
