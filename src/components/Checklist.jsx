import React, { useState } from 'react';
import './Checklist.css';

export default function Checklist({ 
  items = [], 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem, 
  themeColor = '#6366f1' 
}) {
  const [newItemText, setNewItemText] = useState('');
  const [editingItem, setEditingItem] = useState(null); // { id, text }
  const [editText, setEditText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditText(item.text);
  };

  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editingItem) return;
    const trimmed = editText.trim();
    if (!trimmed) return;
    
    if (onUpdateItem) {
      onUpdateItem(editingItem.id, trimmed);
    }
    setEditingItem(null);
  };

  const handleDeleteFromModal = () => {
    if (!editingItem) return;
    onDeleteItem(editingItem.id);
    setEditingItem(null);
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
              onClick={() => handleOpenEdit(item)}
              title="Cliquez pour afficher et modifier"
            >
              {item.text}
            </span>
            
            <button 
              type="button" 
              className="checklist-edit-btn btn-tap" 
              onClick={() => handleOpenEdit(item)}
              aria-label="Modifier l'élément"
              title="Modifier"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>

            <button 
              type="button" 
              className="checklist-delete-btn btn-tap" 
              onClick={() => onDeleteItem(item.id)}
              aria-label="Supprimer l'élément"
              title="Supprimer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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
          title="Ajouter"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </form>

      {/* Edit / Detail Modal */}
      {editingItem && (
        <div 
          className="checklist-detail-modal"
          onClick={() => setEditingItem(null)}
        >
          <div className="checklist-detail-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="checklist-modal-header">
              <h3 className="checklist-modal-title">Détail & Modification</h3>
              <button 
                type="button" 
                className="checklist-modal-close-btn btn-tap" 
                onClick={() => setEditingItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="checklist-modal-form">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="checklist-modal-textarea"
                placeholder="Texte de l'élément..."
                autoFocus
                rows={4}
                required
              />

              <div className="checklist-modal-actions">
                <button 
                  type="submit" 
                  className="checklist-modal-save-btn btn-tap"
                  style={{ backgroundColor: themeColor }}
                  disabled={!editText.trim()}
                >
                  Enregistrer
                </button>
                
                <button 
                  type="button" 
                  className="checklist-modal-delete-btn btn-tap"
                  onClick={handleDeleteFromModal}
                >
                  Supprimer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
