import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { HelpCircle, MessageCircle, FileText, Send, ChevronDown, ChevronUp, CheckCircle, UserPlus, ShoppingBag, XCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Help = ({ tab = 'faq' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab);
  const chatScrollRef = useRef(null);
  
  // Chat State
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Foodie Assistant. How can I help you today? 👋", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // FAQ State
  const [activeFaq, setActiveFaq] = useState(null);

  // Cancel State
  const [recentOrders, setRecentOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    if (activeTab === 'cancel' && userInfo?.token) {
      fetchRecentOrders();
    }
  }, [activeTab]);

  const fetchRecentOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders/user', config);
      // Only show cancellable orders
      setRecentOrders(data.filter(o => ['pending', 'confirmed'].includes(o.status)));
    } catch (error) {
      console.error("Error fetching orders for cancel:", error);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Confirm cancellation? Refund will be processed immediately.")) {
       try {
         const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
         await axios.put(`http://localhost:5000/api/orders/cancel/${id}`, {}, config);
         alert("Order Cancelled & Refund Processed ✅");
         fetchRecentOrders();
       } catch (error) {
         alert("Failed: " + (error.response?.data?.message || error.message));
       }
    }
  };

  // Auto-Scroll Logic
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const faqs = [
    { q: "How do I place an order?", a: "Browse our menu, add items to your cart, and proceed to checkout. Make sure your address is set in your profile!" },
    { q: "How can I cancel my order?", a: "Go to 'My Orders' in your dashboard or use the 'Cancel Order' tab in this Help Center. Refunds are processed instantly in demo mode." },
    { q: "What is the refund timeline?", a: "For cancelled orders, refunds are traditionally processed within 3-5 business days, though they are instant in this demo system." },
    { q: "What are the payment options?", a: "We support Credit/Debit Cards, UPI, and Cash on Delivery (COD)." },
    { q: "My payment failed, what should I do?", a: "If the amount was deducted, it will be refunded within 3-5 business days automatically." }
  ];

  const guides = [
    {
      title: "Getting Started with Ordering",
      icon: <ShoppingBag size={24} />,
      steps: [
        "Create an account and set your delivery address.",
        "Browse categories or search for specific dishes.",
        "Add delicious items to your cart.",
        "Choose a payment method and confirm your order."
      ]
    },
    {
      title: "Becoming a Seller Partner",
      icon: <UserPlus size={24} />,
      steps: [
        "Register for a new account with the 'Seller' role.",
        "Complete your hotel profile including name, logo, and location.",
        "Toggle your hotel status to 'Open' to appear in search.",
        "Add food items to your menu to start receiving orders."
      ]
    }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/help/chat', {
        message: input
      });
      
      setTimeout(() => {
        const botMsg = { text: data.reply, sender: 'bot' };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 700);
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
    }
  };

  return (
    <div className="help-page">
      <Header />
      <main className="help-main section-padding" style={{paddingTop: '160px'}}>
        <div className="container">
          <div className="help-header" style={{textAlign: 'center', marginBottom: '60px'}}>
             <h1 className="section-title">Support <span className="accent">Hub</span></h1>
             <p style={{color: 'var(--text-muted)', marginTop: '10px'}}>Instant help for your food cravings</p>
          </div>

          <div className="help-tabs-nav" style={{
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px', 
            marginBottom: '60px',
            flexWrap: 'wrap'
          }}>
             <button 
              className={`help-nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => { setActiveTab('chat'); navigate('/chat'); }}
              style={{
                background: activeTab === 'chat' ? 'var(--primary-color)' : 'var(--card-bg)',
                padding: '12px 24px', borderRadius: '12px', border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem'
              }}
             >
                <MessageCircle size={18} /> Live Chat
             </button>
             <button 
              className={`help-nav-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => { setActiveTab('faq'); navigate('/faq'); }}
              style={{
                background: activeTab === 'faq' ? 'var(--primary-color)' : 'var(--card-bg)',
                padding: '12px 24px', borderRadius: '12px', border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem'
              }}
             >
                <HelpCircle size={18} /> FAQs
             </button>
             <button 
              className={`help-nav-btn ${activeTab === 'cancel' ? 'active' : ''}`}
              onClick={() => { setActiveTab('cancel'); }}
              style={{
                background: activeTab === 'cancel' ? 'var(--primary-color)' : 'var(--card-bg)',
                padding: '12px 24px', borderRadius: '12px', border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem'
              }}
             >
                <XCircle size={18} /> Cancel Order
             </button>
             <button 
              className={`help-nav-btn ${activeTab === 'guides' ? 'active' : ''}`}
              onClick={() => { setActiveTab('guides'); navigate('/guides'); }}
              style={{
                background: activeTab === 'guides' ? 'var(--primary-color)' : 'var(--card-bg)',
                padding: '12px 24px', borderRadius: '12px', border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem'
              }}
             >
                <FileText size={18} /> Guides
             </button>
          </div>

          <div className="help-content-view" style={{maxWidth: '800px', margin: '0 auto'}}>
             {activeTab === 'chat' && (
                <div className="chat-interface" style={{
                  background: 'var(--card-bg)', 
                  borderRadius: '20px', 
                  height: '550px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                   <div className="chat-header" style={{padding: '15px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                      <div className="flex-center gap-3" style={{justifyContent: 'flex-start'}}>
                         <div className="bot-avatar" style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <MessageCircle size={18} color="white" />
                         </div>
                         <div>
                            <h4 style={{fontSize: '0.95rem'}}>Foodie AI Assistant</h4>
                            <p style={{fontSize: '0.7rem', color: '#00C853'}}>Online</p>
                         </div>
                      </div>
                   </div>

                   <div className="chat-messages" ref={chatScrollRef} style={{flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                      {messages.map((msg, i) => (
                        <div key={i} className={`msg-bubble ${msg.sender}`} style={{
                          maxWidth: '80%', padding: '10px 16px',
                          borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                          background: msg.sender === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                          alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                          fontSize: '0.9rem'
                        }}>
                           {msg.text}
                        </div>
                      ))}
                      {isTyping && (
                        <div className="typing-indicator" style={{color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '5px'}}>Assistant is typing...</div>
                      )}
                   </div>

                   <form onSubmit={handleSendMessage} className="chat-input-area" style={{padding: '15px 20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px'}}>
                      <input 
                        type="text" value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question..." 
                        style={{flex: 1, padding: '10px 20px', borderRadius: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontSize: '0.9rem'}}
                      />
                      <button type="submit" style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                         <Send size={18} />
                      </button>
                   </form>
                </div>
             )}

             {activeTab === 'cancel' && (
                <div className="cancel-view" style={{background: 'var(--card-bg)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'}}>
                   <h3 style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <XCircle size={24} className="primary-color" /> Cancel Active Order
                   </h3>
                   <p style={{color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '30px'}}>Orders can be cancelled and fully refunded before they enter 'Preparing' status.</p>
                   
                   {recentOrders.length > 0 ? (
                     <div className="cancel-orders-list" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {recentOrders.map(order => (
                          <div key={order._id} style={{padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                             <div>
                                <h4 style={{fontSize: '1rem'}}>Order #{order._id.substring(18)}</h4>
                                <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>${order.totalAmount.toFixed(2)} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                             </div>
                             <button onClick={() => handleCancelOrder(order._id)} className="secondary-btn-small" style={{borderColor: '#ff4d4d', color: '#ff4d4d'}}>Cancel ❌</button>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div style={{textAlign: 'center', padding: '40px'}}>
                        <CheckCircle size={48} style={{color: 'rgba(255,255,255,0.1)', marginBottom: '15px'}} />
                        <p style={{color: 'var(--text-muted)'}}>No active cancellable orders found.</p>
                     </div>
                   )}
                </div>
             )}

             {activeTab === 'faq' && (
                <div className="faq-list">
                   {faqs.map((faq, i) => (
                     <div key={i} className={`faq-card ${activeFaq === i ? 'active' : ''}`} style={{
                       background: 'var(--card-bg)', padding: '20px 25px', borderRadius: '15px', marginBottom: '15px',
                       border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'
                     }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <h4 style={{fontSize: '1.05rem'}}>{faq.q}</h4>
                           {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                        {activeFaq === i && <p style={{color: 'var(--text-muted)', marginTop: '12px', fontSize: '0.9rem', lineHeight: '1.5'}}>{faq.a}</p>}
                     </div>
                   ))}
                </div>
             )}

             {activeTab === 'guides' && (
                <div className="guides-container">
                   {guides.map((guide, i) => (
                     <div key={i} className="guide-card" style={{
                       background: 'var(--card-bg)', padding: '25px', borderRadius: '20px', marginBottom: '25px',
                       border: '1px solid rgba(255,255,255,0.05)'
                     }}>
                        <div className="flex-center gap-3" style={{justifyContent: 'flex-start', marginBottom: '15px'}}>
                           <div className="guide-icon" style={{color: 'var(--primary-color)'}}>{guide.icon}</div>
                           <h3 style={{fontSize: '1.2rem'}}>{guide.title}</h3>
                        </div>
                        <div className="guide-steps" style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                           {guide.steps.map((step, j) => (
                              <div key={j} style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                                 <span style={{
                                   width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', 
                                   display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                   fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0, marginTop: '2px'
                                 }}>{j + 1}</span>
                                 <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{step}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;
