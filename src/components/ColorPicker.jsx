import React from 'react';
import './ColorPicker.css';

const PRESET_COLORS = [
  { name: 'Indigo', value: '#4f46e5', light: '#818cf8', bg: 'rgba(79, 70, 229, 0.15)' },
  { name: 'Cyan', value: '#0891b2', light: '#22d3ee', bg: 'rgba(8, 145, 178, 0.15)' },
  { name: 'Emerald', value: '#059669', light: '#34d399', bg: 'rgba(5, 150, 105, 0.15)' },
  { name: 'Amber', value: '#d97706', light: '#fbbf24', bg: 'rgba(217, 119, 6, 0.15)' },
  { name: 'Rose', value: '#e11d48', light: '#fb7185', bg: 'rgba(225, 29, 72, 0.15)' },
  { name: 'Purple', value: '#7c3aed', light: '#a78bfa', bg: 'rgba(124, 58, 237, 0.15)' },
  { name: 'Teal', value: '#0d9488', light: '#2dd4bf', bg: 'rgba(13, 148, 136, 0.15)' },
  { name: 'Pink', value: '#db2777', light: '#f472b6', bg: 'rgba(219, 39, 119, 0.15)' }
];

export { PRESET_COLORS };

export default function ColorPicker({ selectedColor, onSelectColor }) {
  return (
    <div className="color-picker-container">
      <label className="color-picker-label">Couleur de l'activité</label>
      <div className="color-picker-grid">
        {PRESET_COLORS.map((color) => {
          const isSelected = selectedColor === color.value;
          return (
            <button
              key={color.value}
              type="button"
              className={`color-bubble btn-tap ${isSelected ? 'selected' : ''}`}
              style={{ 
                '--bubble-color': color.value,
                '--bubble-border': isSelected ? color.light : 'transparent'
              }}
              onClick={() => onSelectColor(color.value)}
              aria-label={color.name}
            >
              {isSelected && (
                <svg className="color-bubble-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
