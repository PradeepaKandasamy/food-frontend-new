import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bike, MapPin, Package, CheckCircle, Navigation, TrendingUp } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchOrders = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      };
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/delivery/orders`, config);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchOrders();
    }
  }, [userInfo]);

  const updateStatus = async (orderId, newStatus) => {
     try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' }
        };
        await axios.put(`${import.meta.env.VITE_API_URL}/api/delivery/status/${orderId}`, { status: newStatus }, config);
        fetchOrders();
        alert('Status updated successfully!');
     } catch (error) {
        alert('Update failed: ' + (error.response?.data?.message || error.message));
     }
  };

  return (
    <div className="delivery-dashboard-page">
      <Header />
      <main className="dashboard-main section-padding">
        <div className="container">
          <header className="dashboard-header">
             <div className="partner-profile">
                <div className="avatar-circle">
                   <Bike size={32} />
                </div>
                <div>
                   <h2>{userInfo.name}</h2>
                   <p className="role-tag">Delivery Partner</p>
                </div>
             </div>
             <div className="daily-stats">
                 <div className="stat-pill">
                    <TrendingUp size={16} /> <span>Today: $45.20</span>
                 </div>
                 <div className="stat-pill online">
                    <div className="dot"></div> <span>Online</span>
                 </div>
             </div>
          </header>

          <section className="orders-section">
             <h3 className="section-title">Assigned Deliveries</h3>
             
             {loading ? (
                <p>Loading deliveries...</p>
             ) : orders.length > 0 ? (
               <div className="delivery-grid">
                  {orders.map((order) => (
                    <div key={order._id} className="delivery-card">
                       <div className="card-header">
                          <span className="order-no">Order #{order._id.substring(18)}</span>
                          <span className={`status-badge ${order.status}`}>{order.status}</span>
                       </div>

                       <div className="locations">
                          <div className="loc-item">
                             <div className="loc-icon pickup"><Navigation size={18} /></div>
                             <div className="loc-text">
                                <label>Pickup Location (Hotel)</label>
                                <p>{order.sellerId?.hotelName}, {order.sellerId?.location}</p>
                             </div>
                          </div>
                          <div className="loc-item">
                             <div className="loc-icon drop"><MapPin size={18} /></div>
                             <div className="loc-text">
                                <label>Delivery Location (User)</label>
                                <p>{order.userId?.name}, {order.userId?.phone}</p>
                             </div>
                          </div>
                       </div>

                       <div className="card-footer">
                          {order.status === 'accepted' || order.status === 'preparing' ? (
                             <button className="primary-btn full-width" onClick={() => updateStatus(order._id, 'picked')}>
                                Mark as Picked <Package size={18} style={{marginLeft: '10px'}}/>
                             </button>
                          ) : order.status === 'picked' ? (
                             <button className="success-btn full-width" onClick={() => updateStatus(order._id, 'delivered')}>
                                Mark as Delivered <CheckCircle size={18} style={{marginLeft: '10px'}}/>
                             </button>
                          ) : (
                             <div className="delivery-done flex-center gap-2">
                                <CheckCircle size={20} color="green" /> Delivery Completed
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
                <div className="no-orders flex-center flex-column">
                   <Bike size={60} opacity={0.3} />
                   <p>No deliveries assigned currently.</p>
                </div>
             )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryDashboard;
