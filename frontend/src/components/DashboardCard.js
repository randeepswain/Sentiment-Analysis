import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ title, value, subtitle, icon: Icon, colorClass, delay = 0 }) {
  // Map color class to specific HSL gradients
  const getCardStyles = () => {
    switch (colorClass) {
      case 'emerald':
        return {
          glow: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)',
          iconColor: '#10b981',
          gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.01) 100%)'
        };
      case 'rose':
        return {
          glow: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.3)',
          iconColor: '#f43f5e',
          gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(244, 63, 94, 0.01) 100%)'
        };
      case 'cyan':
      default:
        return {
          glow: 'rgba(0, 245, 255, 0.15)',
          border: 'rgba(0, 245, 255, 0.3)',
          iconColor: '#00f5ff',
          gradient: 'linear-gradient(135deg, rgba(0, 245, 255, 0.08) 0%, rgba(0, 245, 255, 0.01) 100%)'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, delay }}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        borderColor: styles.iconColor,
        boxShadow: `0 12px 40px ${styles.glow}`
      }}
      className="card"
      style={{
        background: styles.gradient,
        borderColor: styles.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        textAlign: 'left',
        padding: '30px',
        width: '280px',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '180px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '500', color: '#94a3b8', margin: 0 }}>
          {title}
        </h3>
        <div 
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.04)', 
            padding: '10px', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: styles.iconColor,
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <Icon size={22} />
        </div>
      </div>
      
      <div>
        <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#fff', margin: '10px 0 5px 0' }}>
          {value}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}
