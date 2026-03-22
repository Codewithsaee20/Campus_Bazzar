import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(scrollY.get() > 50);
    };
    const unsubscribe = scrollY.on('change', updateScroll);
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: isScrolled ? '1rem 0' : '2rem 1rem',
        transition: 'padding 0.3s ease',
      }}
    >
      <div 
        className="container" 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: isScrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          border: isScrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
          borderRadius: '50px',
          padding: '0.75rem 2rem',
          transition: 'all 0.3s ease',
          boxShadow: isScrolled ? '0 8px 32px 0 rgba(0, 0, 0, 0.3)' : 'none'
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>
          Campus<span className="text-gradient">Bazar</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Marketplace</a>
          <a href="#stats" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Impact</a>
          <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
            Login / Sign Up
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
