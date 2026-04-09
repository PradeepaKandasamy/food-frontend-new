import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Package, Truck, Clock, CheckCircle, User, MapPin, CreditCard, Edit3, Camera, Map as MapIcon, Navigation, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './UserDashboard.css';

// Fix Leaflet marker icon issue
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    location: { lat: 20.5937, lng: 78.9629 } 
  });
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const token = userInfo?.token;

  const fetchProfile = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, config);
      setUser({
          ...data,
          location: data.location?.lat ? data.location : { lat: 20.5937, lng: 78.9629 }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user`, config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchOrders();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const setLocation = (latlng) => {
    setUser(prev => ({ ...prev, location: { lat: latlng.lat, lng: latlng.lng } }));
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUser(prev => ({
          ...prev,
          location: { lat: latitude, lng: longitude }
        }));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/update`, user, config);
      const updatedUserInfo = { ...userInfo, name: user.name };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order? Refund will be processed instantly.")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/orders/cancel/${id}`, {}, config);
        alert("Order Cancelled & Refund Processed ✅");
        fetchOrders();
      } catch (error) {
        alert("Cancellation Failed: " + (error.response?.data?.message || error.message));
      }
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-main section-padding" style={{paddingTop: '160px'}}>
        <div className="container">
          <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
              <div className="profile-image-container">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="profile" className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-fallback">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                {editMode && (
                  <label className="avatar-edit-btn">
                    <Camera size={16} />
                    <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
              <h3>{user.name || 'User'}</h3>
              <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              
              <nav className="dashboard-nav">
                <button 
                  className={`dash-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package size={20} /> My Orders
                </button>
                <button 
                  className={`dash-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={20} /> My Profile
                </button>
                <button 
                  className={`dash-nav-btn ${activeTab === 'address' ? 'active' : ''}`}
                  onClick={() => setActiveTab('address')}
                >
                  <MapPin size={20} /> My Address
                </button>
              </nav>
            </aside>

            <section className="dashboard-content">
              {activeTab === 'orders' && (
                <div className="orders-view">
                   <h2 className="view-title">Order History & Tracking</h2>
                   <div className="orders-list">
                      {orders.length > 0 ? orders.map((order) => (
                        <div key={order._id} className="order-item-card">
                           <div className="order-item-header">
                              <div>
                                 <h4>Order #{order._id.substring(18)}</h4>
                                 <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`order-status ${order.status}`}>
                                 {order.status === 'delivered' ? <CheckCircle size={14} /> : <Clock size={14} />} {order.status}
                              </span>
                           </div>
                           <div className="order-item-body">
                              <p><strong>Total Paid:</strong> ₹{(order.totalAmount * 83).toLocaleString('en-IN')}</p>
                              <div className="order-tracking-info" style={{marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                                 <h5 style={{color: 'var(--primary-color)', marginBottom: '10px'}}><Truck size={16} style={{marginRight: '8px'}}/> Delivery Assignment</h5>
                                 {order.deliveryPartner ? (
                                   <div className="partner-badge flex-center gap-3" style={{justifyContent: 'flex-start'}}>
                                      <div className="partner-avatar" style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white'}}>
                                         <User size={20} style={{margin: '0 auto'}}/>
                                      </div>
                                      <div>
                                         <p style={{fontWeight: '700', fontSize: '0.9rem'}}>{order.deliveryPartner.name}</p>
                                         <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}><Phone size={12} /> {order.deliveryPartner.phone}</p>
                                      </div>
                                   </div>
                                 ) : (
                                   <p style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>Finding the nearest delivery partner... ⏳</p>
                                 )}
                              </div>
                              <div className="order-item-footer" style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px'}}>
                                 <p style={{fontSize: '0.85rem'}}>Payment: <span style={{color: order.paymentStatus === 'refunded' ? '#ff4d4d' : '#8BC34A', fontWeight: '600'}}>{order.paymentStatus}</span></p>
                                 
                                 {['pending', 'confirmed'].includes(order.status) && (
                                   <button 
                                     className="secondary-btn-small" 
                                     onClick={() => cancelOrder(order._id)}
                                     style={{borderColor: '#ff4d4d', color: '#ff4d4d', padding: '5px 12px', borderRadius: '8px', border: '1px solid', background: 'none', cursor: 'pointer'}}
                                   >
                                     Cancel Order ❌
                                   </button>
                                 )}
                              </div>
                           </div>
                        </div>
                      )) : (
                        <div className="empty-orders flex-center flex-column" style={{padding: '60px', textAlign: 'center'}}>
                           <Package size={60} opacity={0.3} />
                           <p style={{marginTop: '20px'}}>You haven't placed any orders yet.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="profile-view">
                   <h2 className="view-title">My Profile</h2>
                   <div className="profile-details-card">
                      {!editMode ? (
                        <>
                          <div className="info-group">
                            <label>Full Name</label>
                            <p>{user.name}</p>
                          </div>
                          <div className="info-group">
                            <label>Email Address</label>
                            <p>{user.email}</p>
                          </div>
                          <div className="info-group">
                            <label>Phone Number</label>
                            <p>{user.phone || 'Not added'}</p>
                          </div>
                          <button 
                            className="primary-btn" 
                            onClick={() => setEditMode(true)}
                            style={{marginTop: '20px'}}
                          >
                            <Edit3 size={18} style={{marginRight: '8px'}} /> Edit Profile
                          </button>
                        </>
                      ) : (
                        <form onSubmit={handleUpdateProfile} className="edit-profile-form">
                           <div className="form-group">
                              <label>Full Name</label>
                              <input type="text" name="name" value={user.name} onChange={handleChange} required />
                           </div>
                           <div className="form-group">
                              <label>Phone Number</label>
                              <input type="text" name="phone" value={user.phone} onChange={handleChange} />
                           </div>
                           <div className="form-actions">
                              <button type="submit" className="primary-btn">Save Changes</button>
                              <button type="button" className="secondary-btn" onClick={() => setEditMode(false)} style={{marginLeft: '10px'}}>Cancel</button>
                           </div>
                        </form>
                      )}
                   </div>
                </div>
              )}

              {activeTab === 'address' && (
                <div className="address-view">
                  <h2 className="view-title">My Address & Location</h2>
                  <div className="address-container">
                    <div className="form-group">
                      <label>Delivery Address</label>
                      <textarea name="address" value={user.address} onChange={handleChange} placeholder="Enter your detailed address here..." className="address-textarea" />
                    </div>
                    
                    <div className="location-buttons">
                      <button className="location-btn current-loc" onClick={getLocation}>
                        <Navigation size={18} /> Use Current Location 📍
                      </button>
                      <button className="location-btn save-loc" onClick={handleUpdateProfile}>
                        Save Address & Location
                      </button>
                    </div>

                    <div className="map-picker-container">
                      <p className="map-instruction">Click on the map to set your precise delivery location</p>
                      <div className="map-wrapper">
                        <MapContainer 
                          center={[user.location.lat, user.location.lng]} 
                          zoom={13} 
                          style={{ height: '300px', width: '100%', borderRadius: '15px' }}
                        >
                          <ChangeView center={[user.location.lat, user.location.lng]} zoom={13} />
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <LocationPicker position={user.location} setPosition={setLocation} />
                          <Marker position={[user.location.lat, user.location.lng]} />
                        </MapContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;
