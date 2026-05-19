import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ThumbsUp, ThumbsDown, HelpCircle, Sparkles } from 'lucide-react';

export default function ChatBubble({ role, content, prediction, confidence, delay = 0 }) {
  const isUser = role === 'user';
  
  // Decide badge styling based on predicted sentiment
  const getBadgeDetails = () => {
    if (!prediction) return null;
    if (confidence < 0.6) {
      return {
        label: 'Neutral Sentiment',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        icon: HelpCircle
      };
    }
    if (prediction === 'Positive') {
      return {
        label: 'Positive Feedback',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        icon: ThumbsUp
      };
    } else {
      return {
        label: 'Negative Feedback',
        color: '#f43f5e',
        bgColor: 'rgba(244, 63, 94, 0.1)',
        borderColor: 'rgba(244, 63, 94, 0.3)',
        icon: ThumbsDown
      };
    }
  };

  const badge = getBadgeDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14, delay }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '25px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: '15px',
          maxWidth: '80%'
        }}
      >
        {/* Avatar Ring */}
        <div
          style={{
            backgroundColor: isUser ? 'rgba(124, 58, 237, 0.15)' : 'rgba(0, 245, 255, 0.15)',
            border: isUser ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(0, 245, 255, 0.3)',
            color: isUser ? '#a78bfa' : '#00f5ff',
            padding: '12px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isUser ? '0 0 15px rgba(124, 58, 237, 0.2)' : '0 0 15px rgba(0, 245, 255, 0.2)'
          }}
        >
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Message bubble */}
        <div
          style={{
            background: isUser 
              ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
            border: isUser ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px 24px',
            borderRadius: isUser ? '24px 4px 24px 24px' : '4px 24px 24px 24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2)',
            textAlign: 'left',
            position: 'relative'
          }}
        >
          {/* Sparkles on high confidence positive classification */}
          {!isUser && prediction === 'Positive' && confidence >= 0.8 && (
            <div style={{ position: 'absolute', top: '10px', right: '12px', color: '#10b981', opacity: 0.8 }}>
              <Sparkles size={16} />
            </div>
          )}

          <p style={{ margin: 0, fontSize: '17px', lineHeight: '1.6', color: '#f1f5f9' }}>
            {content}
          </p>

          {/* AI Metrics Badges inside AI bubbles */}
          {!isUser && badge && (
            <div 
              style={{ 
                marginTop: '15px', 
                display: 'flex', 
                gap: '12px', 
                flexWrap: 'wrap',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '12px'
              }}
            >
              {/* Classification Tag */}
              <div 
                style={{
                  backgroundColor: badge.bgColor,
                  border: `1px solid ${badge.borderColor}`,
                  color: badge.color,
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <badge.icon size={14} />
                {badge.label}
              </div>

              {/* Confidence Tag */}
              <div 
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '30px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Confidence: <strong style={{ color: '#fff' }}>{Math.round(confidence * 100)}%</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
