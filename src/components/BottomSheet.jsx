import React, { useEffect, useState } from 'react';
import './BottomSheet.css';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animateClose, setAnimateClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimateClose(false);
      // Prevent body scrolling when open
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      setAnimateClose(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimateClose(false);
      }, 300); // match CSS transition duration
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const handleClose = () => {
    setAnimateClose(true);
    setTimeout(() => {
      onClose();
    }, 280);
  };

  return (
    <div className={`bottom-sheet-overlay ${animateClose ? 'fade-out' : 'fade-in'}`} onClick={handleClose}>
      <div 
        className={`bottom-sheet-container ${animateClose ? 'slide-down' : 'slide-up'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-handle-wrapper" onClick={handleClose}>
          <div className="bottom-sheet-handle" />
        </div>
        
        {title && (
          <div className="bottom-sheet-header">
            <h2>{title}</h2>
            <button className="bottom-sheet-close-btn btn-tap" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}
        
        <div className="bottom-sheet-content">
          {children}
        </div>
      </div>
    </div>
  );
}
