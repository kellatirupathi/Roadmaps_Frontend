// client/src/components/Navbar/Navbar.jsx with loading state
import { useState, useEffect } from 'react';
import { Link, useLocation, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setPageLoading }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menu = document.querySelector('.navbar-menu');
      const toggle = document.querySelector('.mobile-menu-toggle');
      
      if (mobileMenuOpen && menu && toggle && 
          !menu.contains(event.target) && 
          !toggle.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Handle All Techstacks click with loading
  const handleAllTechStacksClick = (e) => {
    // If we're already on the all techstacks page, prevent default and do nothing
    if (location.pathname === '/alltechstacks') {
      e.preventDefault();
      return;
    }
    
    // Set loading state to true
    setPageLoading(true);
    
    // Navigate to all techstacks page
    navigate('/alltechstacks');
    
    // Reset loading state after a delay to simulate loading
    // In a real app, this would be handled by the data fetching logic
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  };

  return (
    <nav className={`app-navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="navbar-container">
        {/* Logo with link to home */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <img src="/logo.svg" alt="Tech Stack Roadmap" className="w-full h-full" />
          </div>
          <span className="brand-text">NIAT Roadmaps</span>
        </Link>
        
        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        {/* Navigation items */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="navbar-actions">
            <div className="nav-buttons">
              {/* Dashboard Button */}
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  isActive && location.pathname === "/" ? "dashboard-btn active-nav-btn" : "dashboard-btn"
                }
                end
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </NavLink>
              
              {/* All Techstacks Button with click handler for loading state */}
              <NavLink 
                to="/alltechstacks" 
                className={({isActive}) => 
                  isActive ? "roadmaps-btn active-nav-btn" : "roadmaps-btn"
                }
                onClick={handleAllTechStacksClick}
              >
                <i className="fas fa-list"></i>
                <span>All Techstacks</span>
              </NavLink>
              
              <NavLink 
                to="/roadmaps" 
                className={({isActive}) => 
                  isActive ? "roadmaps-btn active-nav-btn" : "roadmaps-btn"
                }
              >
                <i className="fas fa-map"></i>
                <span>Roadmaps</span>
              </NavLink>
              
              <NavLink 
                to="/newtechstack" 
                className={({isActive}) => 
                  isActive ? "add-tech-stack-btn active-nav-btn" : "add-tech-stack-btn"
                }
              >
                <i className="fas fa-plus"></i>
                <span>New Tech Stack</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
