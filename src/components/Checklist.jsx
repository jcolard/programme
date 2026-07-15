import React, { useState } from 'react';
import './Checklist.css';

export default function Checklist({ items = [], onAddItem, onDeleteItem, themeColor = '#6366f1' }) {
  const [newItemText, setNewItemText] = useState('');
  const [selectedDetailText, setSelectedDetailText] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  return (
    <div className="checklist-container">
      <div className="checklist-progress-header">
        <span className="checklist-progress-title">Éléments de la liste</span>
        <span className="checklist-progress-count">{items.length} au total</span>
      </div>

      <ul className="checklist-items">
        {items.map((item) => (
          <li key={item.id} className="checklist-item">
            <span className="checklist-item-bullet" style={{ backgroundColor: themeColor }} />
            <span 
              className="checklist-item-text" 
              onClick={() => setSelectedDetailText(item.text)}
              style={{ cursor: 'pointer' }}
              title="Cliquez pour voir en entier"
            >
              {item.text}
            </span>
            
            <button 
              type="button" 
              className="checklist-delete-btn btn-tap" 
              onClick={() => onDeleteItem(item.id)}
              aria-label="Supprimer l'élément"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="checklist-empty-state">La liste est vide</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="checklist-add-form">
        <input
          type="text"
          placeholder="Ajouter quelque chose..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="checklist-add-input"
        />
        <button 
          type="submit" 
          className="checklist-add-btn btn-tap"
          style={{ backgroundColor: themeColor }}
          disabled={!newItemText.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </form>

      {/* Read-only detail modal */}
      {selectedDetailText && (
        <div 
          className="checklist-detail-modal"
          onClick={() => setSelectedDetailText(null)}
        >
          <div className="checklist-detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <p>{selectedDetailText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
