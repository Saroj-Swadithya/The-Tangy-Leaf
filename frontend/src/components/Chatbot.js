import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './chat.css';
import { FaComments, FaRobot, FaMinus, FaPaperPlane } from 'react-icons/fa';

const RESTAURANT_CONTEXT = `You are "Tangy Assistant," the friendly and helpful AI chatbot for "The Tangy Leaf," a cafe known for its fresh, zesty flavors.

**Your Core Task:**
Your primary goal is to assist customers. Be friendly, conversational, and accurate.

**Restaurant Information:**
- **Name:** The Tangy Leaf
- **Specialties:** Fresh sandwiches, zesty burgers, refreshing mojitos.
- **Operating Hours:** Mon-Fri 11 AM - 10 PM, Sat-Sun 10 AM - 11 PM.
- **Delivery:** Free for orders over ₹500. A standard ₹49 fee applies otherwise.
- **Payment Options:** Credit/Debit Cards, UPI, and Cash on Delivery.
- **Locations:** Downtown, Mallside, and Beach Road.

**Full Menu & Prices:**
- **Sandwiches:**
  - Citrus Blast Sandwich: ₹249 (Avocado, lime zest, grilled chicken)
  - Veggie Delight: ₹219 (Fresh vegetables, herb mayo, multigrain bread)
- **Burgers:**
  - Tangy Leaf Burger: ₹299 (Signature lime sauce, crisp lettuce)
  - Spicy Chicken Burger: ₹319 (Crispy chicken, spicy mayo, pickles)
- **Sides:**
  - Zesty French Fries: ₹199 (Lime-seasoned potato perfection)
- **Drinks:**
  - Classic Peach Lime Mojito: ₹179 (Fresh mint, lime, soda water)

**Your Capabilities & Instructions:**
1.  **Answer Factual Questions:** Use the information above to answer questions about the menu, hours, delivery, etc.
2.  **Give Food Recommendations:** Be creative and empathetic when recommending food based on a user's mood.
3.  **Handle Unrelated Questions:** Gently steer non-restaurant conversations back to your purpose.
4.  **Keep Responses Concise:** Provide clear and direct answers.`;


const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Tangy Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (open && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const fullPrompt = `${RESTAURANT_CONTEXT}\n\nCustomer: ${currentInput}\n\nTangy Assistant:`;

    try {
      // --- FIX: Use a relative URL ---
      const res = await axios.post('/api/chat', {
        prompt: fullPrompt
      });

      const botResponse = res.data.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

    } catch (err) {
      console.error("Error from backend proxy:", err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I seem to be having trouble connecting. Please try again in a moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <>
      <button className="chat-toggle" onClick={() => setOpen(o => !o)}>
        <FaComments />
      </button>
      <div className="chat-widget" style={{ display: open ? 'flex' : 'none' }}>
        <div className="chat-header">
          <div className="chat-title">
            <FaRobot />
            <span>Tangy Assistant</span>
          </div>
          <button className="minimize-chat" onClick={() => setOpen(false)}>
            <FaMinus />
          </button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="message bot-message typing-indicator">
                <span className="typing-dots"><span></span><span></span><span></span></span>
              </div>
            )}
          </div>
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !input.trim()}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;