import React from 'react';
import './SlotCard.css';
import { PRESET_COLORS } from './ColorPicker';
import { timeToDecimal } from './Timeline';

export default function SlotCard({ slot, style, onClick }) {
  const colorPreset = PRESET_COLORS.find(c => c.value === slot.color) || {
    value: slot.color,
    light: slot.color,
    bg: 'rgba(255, 255, 255, 0.1)'
  };

  const totalItems = slot.items?.length || 0;
  const hasItems = totalItems > 0;

  // Compute duration to apply compact layout for short slots
  const startDec = timeToDecimal(slot.startTime);
  const endDec = timeToDecimal(slot.endTime);
  const duration = endDec - startDec;
  const isShort = duration <= 1.0; // 1 hour or less
  const isVeryShort = duration <= 0.5; // 30 minutes or less

  return (
    <div 
      className={`slot-card btn-tap ${isVeryShort ? 'slot-card-very-short' : isShort ? 'slot-card-short' : ''}`}
      style={{
        ...style,
        '--card-theme-color': slot.color,
        '--card-theme-bg': colorPreset.bg,
        '--card-theme-border': colorPreset.light
      }}
      onClick={onClick}
    >
      <div className="slot-card-border" />
      <div className="slot-card-content">
        <div className="slot-card-time">{slot.startTime} - {slot.endTime}</div>
        <div className="slot-card-title">{slot.title}</div>
        
        {hasItems && !isShort && (
          <div className="slot-card-badge">
            <svg 
              className="slot-card-badge-icon" 
              width="10" 
              height="10" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3.5"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span className="slot-card-badge-text">
              {totalItems}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
