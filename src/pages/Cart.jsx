import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 5.00 : 0.00;
  const total = subtotal + delivery;

  const formatCurrency = (amount) => {
    return '₹' + (amount * 83).toLocaleString('en-IN');
  };

  if (loading) return <div className="loading">Loading Cart...</div>;

  return (
    <div className="cart-page">
      <Header />
      <main className="cart-main section-padding">
        <div className="container">
          <div className="cart-header">
             <ShoppingBag size={32} className="primary-color" />
             <h1 className="cart-title">Your Food <span className="accent">Cart</span></h1>
          </div>
          
          <div className="cart-grid">
             <div className="cart-items-section">
                {cart.items.length > 0 ? (
                  cart.items.map((item) => (
                    <div key={item.foodId} className="cart-item">
                       <img src={item.image} alt={item.name} className="cart-item-img" />
                       <div className="cart-item-info">
                          <h3>{item.name}</h3>
                          <p className="price">{formatCurrency(item.price)}</p>
                       </div>
                       <div className="quantity-controls">
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.foodId, 'decrease')}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty">{item.quantity}</span>
                          <button 
                            className="qty-btn" 
                            onClick={() => updateQuantity(item.foodId, 'increase')}
                          >
                            <Plus size={14} />
                          </button>
                       </div>
                       <div className="item-total">
                          {formatCurrency(item.price * item.quantity)}
                       </div>
                       <button 
                         className="remove-btn" 
                         onClick={() => removeFromCart(item.foodId)}
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <Link to="/" className="primary-btn">Go Shopping</Link>
                  </div>
                )}
             </div>

             <aside className="cart-summary">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-row">
                   <span>Subtotal</span>
                   <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                   <span>Delivery Fee</span>
                   <span>{formatCurrency(delivery)}</span>
                </div>
                <div className="summary-total summary-row">
                   <span>Total</span>
                   <span>{formatCurrency(total)}</span>
                </div>
                <button 
                  className="primary-btn full-width flex-center gap-2"
                  disabled={cart.items.length === 0}
                  onClick={() => navigate('/payment')}
                >
                   Proceed to Payment <ArrowRight size={20} />
                </button>
             </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
