import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Compass, 
  ArrowLeftRight,
  BarChart2,
  Clock,
  Info,
  LogOut
} from "lucide-react";
import ChatBubble from "../components/ChatBubble";
import { useNavigate } from "react-router-dom";

function ChatbotPage({ setIsLoggedIn }) {
  const [review, setReview] = useState("");
  const [activeSession, setActiveSession] = useState(0);
  const [sessions, setSessions] = useState([
    {
      id: 0,
      title: "NLP Review Assistant",
      messages: [
        {
          id: 1,
          role: "bot",
          content: "Hello! I am your AI Review Assistant. Enter a customer review below, and I will analyze its preprocessed text using Natural Language Processing (NLP) and detect whether the feedback is positive, negative, or neutral.",
          prediction: null,
          confidence: null
        }
      ]
    },
    {
      id: 1,
      title: "iPhone 15 Camera Sentiment",
      messages: [
        { id: 1, role: "user", content: "Amazing camera quality and smooth performance. Truly premium!" },
        { id: 2, role: "bot", content: "Analysis complete! Positive Feedback identified with a high confidence score of 98%. The review indicates high customer satisfaction, appreciation of quality, or smooth usability.", prediction: "Positive", confidence: 0.98 }
      ]
    },
    {
      id: 2,
      title: "Battery Friction Flag",
      messages: [
        { id: 1, role: "user", content: "Battery backup is extremely poor. S24 drains in 4 hours." },
        { id: 3, role: "bot", content: "Sentiment flag: Negative Feedback detected with a certainty of 92%. The feedback indicates customer frustration or friction, pointing to areas requiring prompt attention.", prediction: "Negative", confidence: 0.92 }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }
    navigate("/login");
  };

  // Find the active session object
  const currentSession = sessions.find(s => s.id === activeSession) || sessions[0];
  const messages = currentSession.messages;

  // Smooth scroll scoped strictly to the chat container
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);



  // Create a brand new session channel
  const startNewChat = () => {
    const newId = Date.now();
    const newSession = {
      id: newId,
      title: "New Chat Session",
      messages: [
        {
          id: Date.now() + 1,
          role: "bot",
          content: "Hello! I am your AI Review Assistant. Enter a customer review below, and I will analyze its preprocessed text using Natural Language Processing (NLP) and detect whether the feedback is positive, negative, or neutral.",
          prediction: null,
          confidence: null
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSession(newId);
  };

  // Delete a specific session channel
  const deleteSession = (id, e) => {
    e.stopPropagation(); // Prevent activating deleted session
    if (sessions.length <= 1) {
      alert("You must keep at least one session active!");
      return;
    }
    const index = sessions.findIndex(s => s.id === id);
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);

    // If deleting the currently active session, navigate to the first available one
    if (activeSession === id) {
      const fallbackIndex = index === 0 ? 0 : index - 1;
      setActiveSession(updated[fallbackIndex]?.id || updated[0].id);
    }
  };

  const analyzeReview = async (textToSend) => {
    const reviewContent = textToSend || review;
    if (!reviewContent.trim()) {
      alert("Please enter a review to analyze");
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: reviewContent.trim()
    };

    // Update session immediately with user's message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession) {
        // Dynamically rename the session title if it was named "New Chat Session"
        const titleText = s.title === "New Chat Session" || s.title === "NLP Review Assistant"
          ? (userMessage.content.length > 24 ? userMessage.content.substring(0, 24) + "..." : userMessage.content)
          : s.title;

        return {
          ...s,
          title: titleText,
          messages: [...s.messages, userMessage]
        };
      }
      return s;
    }));

    setReview(""); // Clear input bar
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        { review: userMessage.content }
      );

      const prediction = response.data.prediction;
      const confidence = response.data.confidence;

      // Frame bot's descriptive conversational reply
      let description = "";
      if (confidence < 0.6) {
        description = `Pre-processing analysis finished. Our Bayesian model detected Neutral or Mixed Sentiment (Confidence: ${Math.round(confidence * 100)}%). The feedback contains a balanced perspective or conflicting customer signals.`;
      } else if (prediction === "Positive") {
        description = `Analysis complete! Positive Feedback identified with a high confidence score of ${Math.round(confidence * 100)}%. The review indicates high customer satisfaction, appreciation of quality, or smooth usability.`;
      } else {
        description = `Sentiment flag: Negative Feedback detected with a certainty of ${Math.round(confidence * 100)}%. The feedback indicates customer frustration or friction, pointing to areas requiring prompt attention.`;
      }

      const botMessage = {
        id: Date.now() + 1,
        role: "bot",
        content: description,
        prediction,
        confidence
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession) {
          return {
            ...s,
            messages: [...s.messages, botMessage]
          };
        }
        return s;
      }));

      // Store in dynamic history (last 5 runs)
      try {
        const savedHistory = JSON.parse(localStorage.getItem("sentiment_history") || "[]");
        const newRun = {
          id: Date.now(),
          review: userMessage.content,
          prediction,
          confidence
        };
        const updatedHistory = [newRun, ...savedHistory].slice(0, 5);
        localStorage.setItem("sentiment_history", JSON.stringify(updatedHistory));
      } catch (err) {
        console.error("Failed to save sentiment history to localStorage:", err);
      }
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 2,
        role: "bot",
        content: "API Server Connection Error. Please verify the backend FastAPI server is running on localhost:8000 and try again."
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSession) {
          return {
            ...s,
            messages: [...s.messages, errorMessage]
          };
        }
        return s;
      }));
    }
    setLoading(false);
  };

  // Starter Cards for dynamic user engagement
  const starterPrompts = [
    {
      title: "Analyze Excitement",
      subtitle: "🤩 Positive Review Prompt",
      prompt: "Oh my god, the camera lens takes absolutely spectacular photos!"
    },
    {
      title: "Analyze Battery",
      subtitle: "😢 Negative Review Prompt",
      prompt: "This phone is a total laggy disaster, battery backup is poor!"
    },
    {
      title: "Analyze Mid-Range",
      subtitle: "😐 Neutral Review Prompt",
      prompt: "The screen is bright but the performance is just ordinary."
    },
    {
      title: "Analyze Dynamic",
      subtitle: "🤔 Mixed Review Prompt",
      prompt: "Design looks decent but charging takes extremely long."
    }
  ];

  return (
    <div className="chatgpt-layout">
      {/* 1. ChatGPT Left Sidebar Session Navigator */}
      <div className="chatgpt-sidebar">
        <div>
          {/* New Chat Button */}
          <button onClick={startNewChat} className="chatgpt-new-chat-btn">
            <Plus size={18} /> New Chat
          </button>

          {/* Sessions List */}
          <div className="chatgpt-history-list">
            {sessions.map(s => (
              <div 
                key={s.id} 
                onClick={() => setActiveSession(s.id)}
                className={`chatgpt-history-item ${activeSession === s.id ? "active" : ""}`}
              >
                <MessageSquare size={16} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {s.title}
                </span>
                <Trash2 
                  size={14} 
                  className="trash-icon"
                  style={{ opacity: 0.5, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => e.target.style.opacity = 1}
                  onMouseLeave={(e) => e.target.style.opacity = 0.5}
                  onClick={(e) => deleteSession(s.id, e)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer Options */}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px', 
            paddingTop: '15px', 
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            maxHeight: '320px',
            overflowY: 'auto'
          }}
          className="custom-chat-stream"
        >
          {/* 1. Dashboard */}
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#cbd5e1', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <BarChart2 size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Analytics Dashboard</span>
          </div>

          {/* 2. Product Comparer */}
          <div 
            onClick={() => navigate('/compare')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#cbd5e1', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <ArrowLeftRight size={16} style={{ color: '#00f5ff' }} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Product Comparer</span>
          </div>

          {/* 3. Devices Showcase */}
          <div 
            onClick={() => navigate('/recommendations')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#cbd5e1', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Compass size={16} style={{ color: '#8b5cf6' }} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Devices Showcase</span>
          </div>

          {/* 4. Review History */}
          <div 
            onClick={() => navigate('/history')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#cbd5e1', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Clock size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>Review History</span>
          </div>

          {/* 5. About Analyzer */}
          <div 
            onClick={() => navigate('/about')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#cbd5e1', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Info size={16} style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '15px', fontWeight: '500' }}>About Analyzer</span>
          </div>

          {/* 6. Logout */}
          <div 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', cursor: 'pointer', color: '#f43f5e', transition: 'background 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={16} style={{ color: '#f43f5e' }} />
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Logout Session</span>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Space */}
      <div className="chatgpt-main">
        {/* Messages Stream OR ChatGPT style Empty Welcome State */}
        {messages.length === 1 ? (
          <div className="chatgpt-welcome-container">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="pulse-bot-glow"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0, 245, 255, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
                border: "1px solid rgba(0, 245, 255, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "25px"
              }}
            >
              <Bot size={45} style={{ color: "#00f5ff" }} />
            </motion.div>

            <motion.h2
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "32px", fontWeight: "800", color: "#fff", margin: "0 0 10px 0" }}
            >
              NLP Sentiment Console
            </motion.h2>
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: "#64748b", fontSize: "16px", maxWidth: "500px", margin: 0, lineHeight: 1.5 }}
            >
              Submit custom product reviews. Our local Bayesian model will vectorize, clean, and classify feedback targets in real time.
            </motion.p>

            {/* Quick Starters Grid */}
            <motion.div 
              className="chatgpt-starter-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {starterPrompts.map((starter, i) => (
                <div 
                  key={i} 
                  className="chatgpt-starter-card"
                  onClick={() => analyzeReview(starter.prompt)}
                >
                  <div>
                    <h4>{starter.title}</h4>
                    <p>{starter.subtitle}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
                      "{starter.prompt}"
                    </span>
                    <Send size={12} style={{ color: '#00f5ff', opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Actual Message Stream */
          <div
            ref={chatContainerRef}
            className="custom-chat-stream"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "40px 40px 20px 40px",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.1) transparent"
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <ChatBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    prediction={msg.prediction}
                    confidence={msg.confidence}
                    delay={index === 0 ? 0.1 : 0}
                  />
                ))}
              </AnimatePresence>

              {/* Loader inside message logs */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", marginTop: "20px" }}
                >
                  <div 
                    style={{
                      backgroundColor: "rgba(0, 245, 255, 0.15)",
                      border: "1px solid rgba(0, 245, 255, 0.3)",
                      color: "#00f5ff",
                      padding: "10px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Bot size={18} className="pulse-icon" />
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span className="dot" style={{ animationDelay: "0s" }}>.</span>
                    <span className="dot" style={{ animationDelay: "0.2s" }}>.</span>
                    <span className="dot" style={{ animationDelay: "0.4s" }}>.</span>
                    <span style={{ fontSize: "15px", color: "#64748b", marginLeft: "10px" }}>
                      AI is tokenizing and vectorizing the input...
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Centered Capsule Input Pill */}
        <div className="chatgpt-input-area">
          <div className="chatgpt-pill">
            <input
              type="text"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeReview()}
              placeholder="Message NLP Review Assistant..."
              disabled={loading}
            />

            <button 
              onClick={() => analyzeReview()} 
              disabled={loading || !review.trim()}
              className={`chatgpt-send-circle ${review.trim() ? "active" : ""}`}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="chatgpt-footer-note">
            AI Review Analyzer can process typos and slang. Natural Language Pre-Processing (NLP) is applied locally.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;