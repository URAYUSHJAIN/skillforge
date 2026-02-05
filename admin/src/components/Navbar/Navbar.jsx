import React, { useState, useEffect, useRef } from 'react';

const navStyles = {
  navbar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1e293b',
    padding: '1rem 2rem',
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    transition: 'transform 0.3s ease',
  },
  hidden: {
    transform: 'translateY(-100%)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  menuContainer: {
    display: 'flex',
    gap: '0.5rem',
  },
  menuButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'background-color 0.2s ease',
  },
  menuButtonActive: {
    backgroundColor: '#3b82f6',
  },
};

const Navbar = ({ currentPage, setCurrentPage }) => {
  const [isVisible, setIsVisible] = useState(true);
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'add-course', label: '➕ Add Course' },
    { id: 'courses', label: '📚 Courses' },
    { id: 'bookings', label: '📋 Bookings' },
    { id: 'contacts', label: '📧 Messages' },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav style={{ ...navStyles.navbar, ...(isVisible ? {} : navStyles.hidden) }}>
      <div style={navStyles.container}>
        <div style={navStyles.logo} onClick={() => setCurrentPage('dashboard')}>
          🎓 LMS Admin
        </div>
        <div style={navStyles.menuContainer} ref={menuRef}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...navStyles.menuButton,
                ...(currentPage === item.id ? navStyles.menuButtonActive : {}),
              }}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
