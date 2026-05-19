import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Battery, 
  Camera, 
  Star, 
  Tag, 
  Search, 
  Sparkles, 
  ArrowLeftRight,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Recommendations() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetailedProducts();
  }, []);

  const fetchDetailedProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://127.0.0.1:8000/detailed-products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching detailed products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="page recommendations-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        boxSizing: "border-box"
      }}
    >
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <h1 style={{ fontSize: '50px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', margin: '0 0 10px 0' }}>
          <Sparkles size={42} style={{ color: '#00f5ff' }} /> Smart Devices Showcase
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '18px', margin: 0 }}>
          Explore and filter our complete catalog of smartphones integrated with local specs & NLP reviews ranked from best to worst.
        </p>
      </div>

      {/* Modern Filter & Search Bar */}
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '20px 30px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by brand or model name (e.g. iPhone, Pixel, Galaxy...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '16px 20px 16px 50px',
              color: '#fff',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontFamily: 'Outfit, sans-serif',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(0, 245, 255, 0.4)';
              e.target.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ color: '#00f5ff', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} />
          <span>Showing {filteredProducts.length} of {products.length} Phones</span>
        </div>
      </div>

      {/* Catalog Cards Grid */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div 
            key="catalog-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '80px 0' }}
          >
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ fontSize: '18px', color: '#00f5ff', marginTop: '20px' }}>
              Querying database and compiling specifications...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="catalog-grid"
            className="recommendations-grid"
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.04
                }
              }
            }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '25px'
            }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.name}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -6, borderColor: 'rgba(0, 245, 255, 0.35)' }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '25px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '410px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease'
                }}
              >
                {/* Product Name & Brand Tag */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                      {product.name}
                    </h3>
                  </div>
 
                  {/* Specifications stack */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Tag size={15} style={{ color: '#8b5cf6' }} />
                      <span>Price: <strong>₹{product.price.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Star size={15} style={{ color: '#f59e0b' }} />
                      <span>Rating: <strong>{product.rating} / 5</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Battery size={15} style={{ color: '#10b981' }} />
                      <span>Battery: <strong>{product.battery}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Camera size={15} style={{ color: '#00f5ff' }} />
                      <span>Camera: <strong>{product.camera}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Smartphone size={15} style={{ color: '#f43f5e' }} />
                      <span>Display: <strong>{product.display}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Cpu size={15} style={{ color: '#00f5ff' }} />
                      <span>Processor: <strong>{product.processor || "Unknown"}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#cbd5e1' }}>
                      <Database size={15} style={{ color: '#8b5cf6' }} />
                      <span>RAM: <strong>{product.ram || "Unknown"}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Compare Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/compare')}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 245, 255, 0.08)',
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    color: '#00f5ff',
                    padding: '12px',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginTop: '20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(0, 245, 255, 0.15)';
                    e.target.style.boxShadow = '0 0 15px rgba(0, 245, 255, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(0, 245, 255, 0.08)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <ArrowLeftRight size={16} /> Run Comparison
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}
        >
          <p style={{ fontSize: '20px', margin: 0 }}>No smartphones found matching "{searchQuery}"</p>
          <p style={{ fontSize: '15px', color: '#64748b', marginTop: '5px' }}>Try searching another brand or clear search terms</p>
        </motion.div>
      )}
    </motion.div>
  );
}