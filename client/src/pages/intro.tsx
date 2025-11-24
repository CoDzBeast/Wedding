import React, { useState, useEffect } from 'react';
import '../styles/intro.css';

const IntroPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    setIsExiting(true);
    // Extended animation time for smoother transition
    setTimeout(() => {
      window.location.href = '/home'; // Redirect to home page (without /Wedding prefix)
    }, 1000); // Longer duration for more elaborate exit animation
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleRedirect();
    }
  };

  return (
    <div className={`intro-page-wrapper ${isExiting ? 'exiting' : ''}`}>
      <div className={`intro-content ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
        {/* Header text: "INTRODUCING" */}
        <h2 className="intro-header">INTRODUCING</h2>
        
        {/* Main title: "the McNears" */}
        <h1 className="intro-main-title">
          <span className="intro-the">the</span>
          <span className="intro-mc-nears">McNears</span>
        </h1>
        
        <div 
          className="intro-envelope-container"
          onClick={handleRedirect}
          onKeyDown={handleKeyPress}
          tabIndex={0}
          role="button"
          aria-label="Open invitation"
        >
          <img 
            src="/assets/landing/envelope.png" 
            alt="Wedding invitation envelope" 
            className="intro-envelope-image"
          />
          <img 
            src="/assets/landing/seal.png" 
            alt="Wax seal" 
            className="intro-seal-image"
          />
        </div>
        
        {/* Call-to-action: "CLICK TO OPEN…" */}
        <p className="intro-cta">CLICK TO OPEN…</p>
        
        {/* Footer text: "elegant interactive wedding website" - REMOVED AS PER REQUEST */}
      </div>
    </div>
  );
};

export default IntroPage;