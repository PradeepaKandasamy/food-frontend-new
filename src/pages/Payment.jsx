import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { CreditCard, Smartphone, Truck, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default to card

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userInfo?.token) return;
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        };
        const { data } = await axios.get('http://localhost:5000/api/users/me', config);
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching profile in Payment:', error);
      }
    };
    fetchUserProfile();
  }, []);

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.00 : 0.00;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    // 1. Validation
    if (!paymentMethod) {
      alert("Please select a payment method before proceeding!");
      return;
    }

    if (!userProfile?.address || !userProfile?.location?.lat) {
      alert("❌ Delivery details incomplete! Please save your address and mark your location on the map in your profile first.");
      return navigate('/user-dashboard');
    }

    setLoading(true);
    try {
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        }
      };

      // 2. Mock Payment Simulation
      console.log(`Processing payment via ${paymentMethod.toUpperCase()}...`);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderData = {
        sellerId: cart.items[0]?.foodId?.sellerId || "64f1a2b3c4d5e6f7a8b9c0d1", 
        items: cart.items.map(item => ({
          foodId: item.foodId._id || item.foodId,
          quantity: item.quantity
        })),
        totalAmount: total,
        address: userProfile.address,
        location: userProfile.location,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid'
      };

      // 3. Create Order
      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, config);
      
      console.log('Order Successfully Created ✅', data);
      setPaymentSuccess(true);
      fetchCart(); 
      
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2500);

    } catch (error) {
      console.error('Payment/Order Error:', error);
      alert('Order Placement Failed: ' + (error.response?.data?.message || 'Server connection error'));
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <Header />
        <main className="payment-main section-padding flex-center flex-column" style={{minHeight: '80vh', textAlign: 'center'}}>
          <CheckCircle size={80} color="#00C853" style={{marginBottom: '20px'}} />
          <h1 className="section-title">Order Placed <span className="accent">Successfully!</span></h1>
          <p style={{color: 'var(--text-muted)', maxWidth: '500px', margin: '20px auto'}}>
            Your payment has been processed and a delivery partner is being assigned. 
            Redirecting you to your dashboard to track your order...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Header />
      <main className="payment-main section-padding" style={{paddingTop: '160px'}}>
        <div className="container">
           <div className="payment-grid">
              <div className="payment-methods">
                 <h2 className="view-title">Choose Payment Method</h2>
                 
                 <div 
                  className={`method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                 >
                    <CreditCard size={24} />
                    <div className="method-info">
                       <h3>Credit / Debit Card</h3>
                       <p>Pay securely with your card</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'card'} name="payment" onChange={() => setPaymentMethod('card')} />
                 </div>

                 <div 
                  className={`method-card ${paymentMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                 >
                    <Smartphone size={24} />
                    <div className="method-info">
                       <h3>UPI / GPay</h3>
                       <p>Fast and instant payment</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'upi'} name="payment" onChange={() => setPaymentMethod('upi')} />
                 </div>

                 <div 
                  className={`method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                 >
                    <Truck size={24} />
                    <div className="method-info">
                       <h3>Cash on Delivery</h3>
                       <p>Pay when food arrives</p>
                    </div>
                    <input type="radio" checked={paymentMethod === 'cod'} name="payment" onChange={() => setPaymentMethod('cod')} />
                 </div>

                 {paymentMethod === 'card' && (
                   <div className="card-details-form animate-in">
                      <div className="form-group">
                         <label>Card Number</label>
                         <input type="text" placeholder="XXXX XXXX XXXX XXXX" defaultValue="4242 4242 4242 4242" />
                      </div>
                      <div className="form-row" style={{display: 'flex', gap: '20px'}}>
                         <div className="form-group" style={{flex: 1}}>
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" defaultValue="12/25" />
                         </div>
                         <div className="form-group" style={{flex: 1}}>
                            <label>CVV</label>
                            <input type="password" placeholder="***" defaultValue="123" />
                         </div>
                      </div>
                   </div>
                 )}

                 {paymentMethod === 'upi' && (
                   <div className="upi-details animate-in" style={{marginTop: '20px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)'}}>
                      <label style={{display: 'block', marginBottom: '10px'}}>Enter UPI ID</label>
                      <input type="text" placeholder="username@okaxis" style={{width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '10px'}} />
                   </div>
                 )}

                 {userProfile && !userProfile.address && (
                   <p className="address-warning" style={{ color: "#ff4d4d", fontSize: "0.85rem", marginTop: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                     ⚠️ No delivery address found. Please update your profile.
                   </p>
                 )}
              </div>

              <aside className="order-details-card">
                 <h3 className="summary-title">Order Summary</h3>
                 {userProfile && !userProfile.address && (
                   <div style={{ backgroundColor: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", padding: "10px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.85rem" }}>
                      Please provide a delivery address in your profile to enable checkout.
                   </div>
                 )}
                 <div className="summary-row" style={{fontSize: '32px', color: 'var(--primary-color)', fontWeight: '700', margin: '20px 0'}}>
                    <span>Amount</span>
                    <span>${total.toFixed(2)}</span>
                 </div>
                 <div className="payment-assurance">
                    <ShieldCheck size={18} />
                    <span>Your payment is 100% secure</span>
                 </div>
                 <button 
                  className="primary-btn full-width flex-center gap-2" 
                  style={{marginTop: '30px'}}
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.items.length === 0}
                 >
                   {loading ? "Processing..." : <>Confirm & Pay <ArrowRight size={18} /></>}
                 </button>
              </aside>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
