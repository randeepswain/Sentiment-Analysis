import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  Battery, 
  Camera, 
  Award, 
  Star, 
  Tag, 
  Sparkles, 
  ArrowLeftRight,
  Cpu,
  Database
} from 'lucide-react';
import './CompareProducts.css';

const fallbackProducts = [
  "iPhone 15",
  "Samsung S24",
  "OnePlus 12",
  "iPhone 15 Pro Max",
  "Samsung S24 Ultra",
  "Google Pixel 8 Pro",
  "OnePlus 12R",
  "Nothing Phone (2a)",
  "Moto Edge 50 Pro",
  "Xiaomi 14",
  "Asus ROG Phone 8",
  "iPhone 15 Plus",
  "Samsung S24+",
  "Google Pixel 8a",
  "Samsung A55",
  "Sony Xperia 1 VI",
  "OnePlus Open",
  "Nothing Phone (2)",
  "Xiaomi Redmi Note 13 Pro",
  "Motorola Edge 50 Ultra",
  "Samsung Galaxy Z Fold5",
  "Samsung Galaxy Z Flip5",
  "Asus Zenfone 11 Ultra",
  "Sony Xperia 5 V",
  "Realme 12 Pro+",
  "Xiaomi Poco F6 Pro",
  "Tecno Camon 30 Premier",
  "Google Pixel Fold",
  "Xiaomi Redmi Note 13",
  "Realme 12 Pro",
  "Motorola Moto G84",
  "Samsung Galaxy A35",
  "Samsung Galaxy A25",
  "Asus Zenfone 10",
  "Sony Xperia 10 V",
  "Xiaomi Poco X6 Pro",
  "Infinix GT 20 Pro",
  "Tecno Spark 20 Pro+"
];

const CompareProducts = () => {
    const [products, setProducts] = useState(fallbackProducts);
    const [product1, setProduct1] = useState('');
    const [product2, setProduct2] = useState('');
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/products'
            );
            if (response.data && response.data.products && response.data.products.length > 0) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error("Using local fallback smartphone catalog list:", error);
        }
    };

    const compareProducts = async () => {
        if (!product1 || !product2) {
            alert('Please select both products');
            return;
        }

        setLoading(true);
        setComparison(null); // Reset comparison for mount animation

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/compare',
                { product1, product2 }
            );
            setComparison(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <motion.div 
            className="compare-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '52px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <ArrowLeftRight size={44} style={{ color: '#00f5ff' }} /> AI Comparison Engine
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '20px', marginTop: '10px' }}>
                    Select two products to run cross-examination on detailed specifications and customer feedback scores.
                </p>
            </div>

            {/* Premium Selector Glass Box */}
            <div 
                className="selection-box"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  padding: '30px 40px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  maxWidth: '750px',
                  margin: '0 auto 50px auto'
                }}
            >
                <select
                    value={product1}
                    onChange={(e) => setProduct1(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      fontSize: '17px',
                      outline: 'none',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                >
                    <option value="" style={{ background: '#0e1026', color: '#64748b' }}>Select Product 1</option>
                    {products.map((product, index) => (
                        <option key={index} value={product} style={{ background: '#0e1026', color: '#fff' }}>
                            {product}
                        </option>
                    ))}
                </select>

                <select
                    value={product2}
                    onChange={(e) => setProduct2(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      fontSize: '17px',
                      outline: 'none',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                >
                    <option value="" style={{ background: '#0e1026', color: '#64748b' }}>Select Product 2</option>
                    {products.map((product, index) => (
                        <option key={index} value={product} style={{ background: '#0e1026', color: '#fff' }}>
                            {product}
                        </option>
                    ))}
                </select>

                <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={compareProducts}
                    style={{
                      padding: '16px 32px',
                      fontSize: '18px',
                      fontWeight: '600',
                      borderRadius: '16px',
                      background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                      boxShadow: '0 0 20px rgba(0, 245, 255, 0.25)',
                      margin: 0
                    }}
                >
                    Compare Specifications
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '40px' }}
                    >
                        <div className="spinner"></div>
                        <p style={{ fontSize: '18px', color: '#00f5ff', marginTop: '15px' }}>
                            Cross-referencing spec matrices and compiling review scores...
                        </p>
                    </motion.div>
                )}

                {comparison && (
                    <motion.div 
                        key="comparison-results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 16 }}
                        className="comparison-section"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginTop: '30px' }}
                    >
                        {/* Product 1 Card */}
                        <motion.div 
                          className="product-card"
                          whileHover={{ y: -6, borderColor: 'rgba(0, 245, 255, 0.4)' }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '24px',
                            padding: '35px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            textAlign: 'left'
                          }}
                        >
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#00f5ff', margin: '0 0 25px 0' }}>
                                {comparison.product1.name}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Tag size={18} style={{ color: '#8b5cf6' }} />
                                    <span>Price: <strong>₹{comparison.product1.details.price}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Star size={18} style={{ color: '#f59e0b' }} />
                                    <span>Rating: <strong>{comparison.product1.details.rating} / 5</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Battery size={18} style={{ color: '#10b981' }} />
                                    <span>Battery: <strong>{comparison.product1.details.battery}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Camera size={18} style={{ color: '#00f5ff' }} />
                                    <span>Camera: <strong>{comparison.product1.details.camera}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Smartphone size={18} style={{ color: '#f43f5e' }} />
                                    <span>Display: <strong>{comparison.product1.details.display}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Cpu size={18} style={{ color: '#00f5ff' }} />
                                    <span>Processor: <strong>{comparison.product1.details.processor || "Unknown"}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Database size={18} style={{ color: '#8b5cf6' }} />
                                    <span>RAM: <strong>{comparison.product1.details.ram || "Unknown"}</strong></span>
                                </div>
                            </div>

                            {/* Sentiment score with emerald neon bar */}
                            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', color: '#94a3b8' }}>Review Sentiment Rating</span>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>{comparison.product1.sentiment_score}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '12px' }}>
                                    <div style={{ width: `${comparison.product1.sentiment_score}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #10b981)', borderRadius: '10px' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Keywords</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {comparison.product1.keywords.map((word, index) => (
                                        <span key={index} style={{ backgroundColor: 'rgba(0, 245, 255, 0.08)', border: '1px solid rgba(0, 245, 255, 0.2)', color: '#00f5ff', padding: '6px 14px', borderRadius: '30px', fontSize: '13px' }}>
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Product 2 Card */}
                        <motion.div 
                          className="product-card"
                          whileHover={{ y: -6, borderColor: 'rgba(139, 92, 246, 0.4)' }}
                          style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '24px',
                            padding: '35px',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            textAlign: 'left'
                          }}
                        >
                            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#8b5cf6', margin: '0 0 25px 0' }}>
                                {comparison.product2.name}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Tag size={18} style={{ color: '#8b5cf6' }} />
                                    <span>Price: <strong>₹{comparison.product2.details.price}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Star size={18} style={{ color: '#f59e0b' }} />
                                    <span>Rating: <strong>{comparison.product2.details.rating} / 5</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Battery size={18} style={{ color: '#10b981' }} />
                                    <span>Battery: <strong>{comparison.product2.details.battery}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Camera size={18} style={{ color: '#00f5ff' }} />
                                    <span>Camera: <strong>{comparison.product2.details.camera}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Smartphone size={18} style={{ color: '#f43f5e' }} />
                                    <span>Display: <strong>{comparison.product2.details.display}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Cpu size={18} style={{ color: '#8b5cf6' }} />
                                    <span>Processor: <strong>{comparison.product2.details.processor || "Unknown"}</strong></span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '17px', color: '#cbd5e1' }}>
                                    <Database size={18} style={{ color: '#00f5ff' }} />
                                    <span>RAM: <strong>{comparison.product2.details.ram || "Unknown"}</strong></span>
                                </div>
                            </div>

                            {/* Sentiment score with purple neon bar */}
                            <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '25px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '16px', color: '#94a3b8' }}>Review Sentiment Rating</span>
                                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>{comparison.product2.sentiment_score}%</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '12px' }}>
                                    <div style={{ width: `${comparison.product2.sentiment_score}%`, height: '100%', background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)', borderRadius: '10px' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: '25px' }}>
                                <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Keywords</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                                    {comparison.product2.keywords.map((word, index) => (
                                        <span key={index} style={{ backgroundColor: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.2)', color: '#8b5cf6', padding: '6px 14px', borderRadius: '30px', fontSize: '13px' }}>
                                            {word}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Premium Golden Victory Banner */}
                        <motion.div 
                          className="recommendation-box"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring', stiffness: 80, delay: 0.2 }}
                          style={{
                            gridColumn: 'span 2',
                            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.03) 100%)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            boxShadow: '0 15px 45px rgba(245, 158, 11, 0.15)',
                            padding: '40px',
                            borderRadius: '28px',
                            marginTop: '25px',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px'
                          }}
                        >
                            <div style={{ position: 'absolute', top: '15px', left: '20px', color: '#f59e0b', opacity: 0.2 }}><Sparkles size={28} /></div>
                            <div style={{ position: 'absolute', bottom: '15px', right: '20px', color: '#f59e0b', opacity: 0.2 }}><Sparkles size={28} /></div>
                            
                            <div 
                              style={{ 
                                backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                                border: '1px solid rgba(245, 158, 11, 0.3)', 
                                padding: '16px', 
                                borderRadius: '50%',
                                color: '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                                <Award size={36} />
                            </div>

                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#f59e0b', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '10px' }}>
                                AI Decision Winner
                            </span>
                            <h1 style={{ fontSize: '48px', fontWeight: '900', color: '#fff', margin: 0, textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>
                                {comparison.recommended}
                            </h1>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CompareProducts;