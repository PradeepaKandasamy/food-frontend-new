import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Plus, LayoutDashboard, Utensils, DollarSign, Package, TrendingUp, Trash2, Edit3, Camera, X } from 'lucide-react';
import './Seller.css';

const Seller = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: 10,
    category: '',
    image: ''
  });
  const [seller, setSeller] = useState({
    name: '',
    hotelName: '',
    phone: '',
    location: '',
    logo: '',
    isOpen: true,
    password: ''
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSeller((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchMyFoods = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/foods/seller/${userInfo._id}`);
      setFoods(data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const fetchSellerProfile = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.get(`http://localhost:5000/api/sellers/profile/${userInfo._id}`, config);
      setSeller({ 
        ...data, 
        isOpen: typeof data.isOpen === 'boolean' ? data.isOpen : (data.isOpen === 'false' ? false : true),
        password: '' 
      });
    } catch (error) {
      console.error('Error fetching seller profile:', error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMyFoods();
      fetchSellerProfile();
    }
  }, []);

  const handleDeleteFood = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };
        await axios.delete(`http://localhost:5000/api/foods/${id}`, config);
        setFoods(foods.filter(f => f._id !== id));
        alert('Food item deleted');
      } catch (error) {
        alert('Error deleting: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      await axios.put(`http://localhost:5000/api/foods/${id}`, { stock: newStock }, config);
      setFoods(foods.map(f => f._id === id ? {...f, stock: newStock} : f));
    } catch (error) {
       console.error('Error updating stock:', error);
    }
  };

  const handleEditClick = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      price: food.price,
      stock: food.stock,
      category: food.category,
      image: food.image
    });
    setActiveTab('add-food');
  };

  const handleUpdateFood = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        }
      };
      await axios.put(`http://localhost:5000/api/foods/${editingFood._id}`, formData, config);
      alert('Food updated successfully!');
      setEditingFood(null);
      setFormData({ name: '', price: '', stock: 10, category: '', image: '' });
      setActiveTab('my-foods');
      fetchMyFoods();
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        }
      };
      await axios.post('http://localhost:5000/api/foods/add', formData, config);
      alert('Food added successfully!');
      setActiveTab('my-foods');
      // Refresh list
      window.location.reload(); 
    } catch (error) {
      alert('Error adding food: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        }
      };
      // Use the actual seller ID from the state if available, or userInfo._id as fallback
      const updateId = seller._id || userInfo._id;
      const { data } = await axios.put(`http://localhost:5000/api/sellers/${updateId}`, seller, config);
      
      // Update local storage to keep header/other components in sync
      const updatedUserInfo = { ...userInfo, name: data.name };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      alert('Profile updated successfully!');
      setShowProfileModal(false);
      fetchSellerProfile();
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const stats = [
    { id: 1, label: 'Total Earnings', value: '$0.00', icon: <DollarSign size={24} />, color: '#4CAF50' },
    { id: 2, label: 'Total Orders', value: '0', icon: <Package size={24} />, color: '#2196F3' },
    { id: 3, label: 'Active Dishes', value: foods.length.toString(), icon: <Utensils size={24} />, color: '#FF9800' },
    { id: 4, label: 'Store Rating', value: 'N/A', icon: <TrendingUp size={24} />, color: '#F44336' },
  ];

  console.log("isOpen:", seller.isOpen);

  return (
    <div className="seller-page">
      <Header />
      <main className="seller-main section-padding">
        <div className="container">
          <div className="seller-container">
            <aside className="seller-sidebar">
              <div className="seller-profile" onClick={() => setShowProfileModal(true)} style={{cursor: 'pointer'}}>
                <div className="profile-img">
                  {seller.logo ? <img src={seller.logo} alt="logo" /> : (seller.name?.charAt(0) || 'S')}
                  <div className="edit-overlay"><Camera size={14} /></div>
                </div>
                <div className="profile-info">
                  <h3>{seller.name || 'Seller'}</h3>
                  <p>{seller.isOpen ? 'Open 🟢' : 'Closed 🔴'}</p>
                </div>
              </div>
              <nav className="seller-nav">
                <button 
                  className={`seller-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard size={20} /> Dashboard
                </button>
                <button 
                  className={`seller-nav-btn ${activeTab === 'add-food' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('add-food');
                    setEditingFood(null);
                    setFormData({ name: '', price: '', stock: 10, category: '', image: '' });
                  }}
                >
                  <Plus size={20} /> Add New Food
                </button>
                <button 
                  className={`seller-nav-btn ${activeTab === 'my-foods' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-foods')}
                >
                  <Utensils size={20} /> My Menu
                </button>
              </nav>
            </aside>

            <section className="seller-content">
              {activeTab === 'dashboard' && (
                <div className="dashboard-view">
                  <h2 className="view-title">Dashboard Overview</h2>
                  <div className="stats-grid">
                    {stats.map((stat) => (
                      <div key={stat.id} className="stat-card">
                         <div className="stat-icon" style={{color: stat.color, backgroundColor: `${stat.color}15`}}>
                            {stat.icon}
                         </div>
                         <div className="stat-details">
                            <h4 className="stat-label">{stat.label}</h4>
                            <p className="stat-value">{stat.value}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="recent-orders">
                     <h3 className="sub-title">Recent Orders</h3>
                     <p className="no-data">No orders yet.</p>
                  </div>
                </div>
              )}

               {activeTab === 'add-food' && (
                <div className="add-food-view">
                  <h2 className="view-title">{editingFood ? "Edit Food Item" : "Add New Food Item"}</h2>
                  <form className="add-food-form" onSubmit={editingFood ? handleUpdateFood : handleAddFood}>
                     <div className="form-grid">
                        <div className="form-group full-width">
                           <label>Food Name</label>
                           <input 
                             type="text" 
                             placeholder="e.g. Gourmet Pizza" 
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                             required 
                           />
                        </div>
                        <div className="form-group">
                           <label>Price ($)</label>
                           <input 
                             type="number" 
                             step="0.01" 
                             placeholder="0.00" 
                             value={formData.price}
                             onChange={(e) => setFormData({...formData, price: e.target.value})}
                             required 
                           />
                        </div>
                        <div className="form-group">
                           <label>Stock Quantity</label>
                           <input 
                             type="number" 
                             placeholder="50" 
                             value={formData.stock}
                             onChange={(e) => setFormData({...formData, stock: e.target.value})}
                             required 
                           />
                        </div>
                        <div className="form-group">
                           <label>Category</label>
                           <input 
                              type="text"
                              placeholder="e.g. Burger, Pizza"
                              value={formData.category}
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              required
                           />
                        </div>
                        <div className="form-group full-width">
                           <label>Food Image URL</label>
                           <input 
                             type="text" 
                             placeholder="https://image-url.com" 
                             value={formData.image}
                             onChange={(e) => setFormData({...formData, image: e.target.value})}
                             required 
                           />
                        </div>
                     </div>
                     <button type="submit" className="primary-btn">
                        {editingFood ? "Update Food Item" : "Add to Menu"}
                     </button>
                     {editingFood && (
                        <button 
                          type="button" 
                          className="secondary-btn" 
                          style={{marginLeft: '10px'}}
                          onClick={() => { setEditingFood(null); setFormData({name: '', price: '', stock: 10, category: '', image: ''}); }}
                        >
                          Cancel
                        </button>
                     )}
                  </form>
                </div>
              )}

              {activeTab === 'my-foods' && (
                <div className="my-foods-view">
                   <h2 className="view-title">My Menu Management</h2>
                   <div className="food-manage-grid">
                      {foods.length > 0 ? (
                        <table className="orders-table">
                           <thead>
                              <tr>
                                 <th>Image</th>
                                 <th>Name</th>
                                 <th>Category</th>
                                 <th>Price</th>
                                 <th>Stock</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {foods.map((food) => (
                                <tr key={food._id}>
                                  <td><img src={food.image} alt={food.name} className="table-row-img" style={{width: '40px', height: '40px', borderRadius: '5px'}}/></td>
                                  <td>{food.name}</td>
                                  <td>{food.category}</td>
                                  <td>${food.price.toFixed(2)}</td>
                                  <td>
                                     <input 
                                       type="number" 
                                       className="stock-input" 
                                       value={food.stock} 
                                       onChange={(e) => handleUpdateStock(food._id, parseInt(e.target.value))}
                                     />
                                  </td>
                                  <td>
                                     <div className="action-btns flex-center gap-2">
                                        <button className="edit-btn" onClick={() => handleEditClick(food)} style={{color: '#2196F3', background: 'none', border: 'none', cursor: 'pointer'}} title="Edit">
                                           <Edit3 size={18} />
                                        </button>
                                        <button className="del-btn" onClick={() => handleDeleteFood(food._id)} style={{color: '#F44336', background: 'none', border: 'none', cursor: 'pointer'}} title="Delete">
                                           <Trash2 size={18} />
                                        </button>
                                     </div>
                                  </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                      ) : (
                        <p className="no-data">You haven't added any dishes yet.</p>
                      )}
                   </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {showProfileModal && (
        <div className="modal-overlay">
          <div className="modal-content profile-edit-modal">
            <div className="modal-header">
              <h3>Edit Seller Profile</h3>
              <button 
                type="button" 
                className="close-btn" 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-color)' }}
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleProfileUpdate}>
               <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Logo Image URL</label>
                    <input 
                      type="text" 
                      name="logo"
                      value={seller.logo} 
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Seller Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={seller.name} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hotel Name</label>
                    <input 
                      type="text" 
                      name="hotelName"
                      value={seller.hotelName} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      name="phone"
                      value={seller.phone} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={seller.location} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password (Optional)</label>
                    <input 
                      type="password" 
                      name="password"
                      value={seller.password} 
                      autoComplete="new-password"
                      onChange={handleChange}
                      placeholder="Leave blank to keep same"
                    />
                  </div>
                  <div className="form-group full-width">
                    <div className="status-box">
                      <span className="status-label">Hotel Status</span>
                      <div className="status-right">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            name="isOpen"
                            checked={seller.isOpen} 
                            onChange={handleChange}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className={seller.isOpen ? "open" : "closed"}>
                          {seller.isOpen ? "Open 🟢" : "Closed 🔴"}
                        </span>
                      </div>
                    </div>
                  </div>
               </div>
               <div className="modal-actions">
                  <button type="submit" className="primary-btn full-width">Save Changes</button>
               </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Seller;
