import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, LogOut, LayoutDashboard, Package, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          FEAST<span className="accent">FLOW</span>
        </Link>
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>Menu</Link>
          
          {userInfo && userInfo.role === 'seller' && (
            <>
              <Link to="/seller" className="nav-link" onClick={() => setMenuOpen(false)}>Sell Food</Link>
              <Link to="/seller" className="nav-link" onClick={() => setMenuOpen(false)}>Orders</Link>
            </>
          )}

          {userInfo && userInfo.role === 'user' && (
            <Link to="/user-dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
          )}

          {userInfo && userInfo.role === 'delivery' && (
            <Link to="/delivery" className="nav-link" onClick={() => setMenuOpen(false)}>Deliveries</Link>
          )}

          <Link to="/help" className="nav-link" onClick={() => setMenuOpen(false)}>Help</Link>
        </nav>
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
          </div>
          <Link to="/wishlist" className="action-link">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="action-link cart-link">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          
          {userInfo ? (
            <div className="user-dropdown">
              <button className="action-link profile-link" title={userInfo.name}>
                <User size={20} />
              </button>
              <div className="dropdown-content">
                <div className="dropdown-header">
                  <p className="user-name">{userInfo.name}</p>
                  <p className="user-role">{userInfo.role}</p>
                </div>
                <Link 
                  to={
                    userInfo.role === 'seller' ? '/seller' : 
                    userInfo.role === 'delivery' ? '/delivery' : 
                    '/user-dashboard'
                  } 
                  className="dropdown-item"
                >
                  {userInfo.role === 'seller' ? <LayoutDashboard size={16} /> : <Package size={16} />} Dashboard
                </Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="action-link profile-link">
              <User size={20} />
            </Link>
          )}
          
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
