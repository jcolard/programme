import React, { useState, useEffect } from 'react';
import Timeline, { timeToDecimal, decimalToTime } from './components/Timeline';
import BottomSheet from './components/BottomSheet';
import ColorPicker, { PRESET_COLORS } from './components/ColorPicker';
import Checklist from './components/Checklist';
import './App.css';

// Initial demo slots unified
const INITIAL_SLOTS = [
  {
    id: 'demo-1',
    title: 'Rituel matinal & Café',
    color: '#7c3aed',
    hasTime: true,
    startTime: '07:30',
    endTime: '08:30',
    emoji: '☕',
    items: [
      { id: 't1', text: 'Boire un grand verre d\'eau' },
      { id: 't2', text: '10 min de méditation' },
      { id: 't3', text: 'Moudre le café frais' }
    ]
  },
  {
    id: 'demo-2',
    title: 'Développement App Mobile',
    color: '#4f46e5',
    hasTime: true,
    startTime: '09:00',
    endTime: '11:30',
    emoji: '🚀',
    items: [
      { id: 't4', text: 'Créer le design system CSS' },
      { id: 't5', text: 'Implémenter le bottom sheet tactile' },
      { id: 't6', text: 'Gérer la logique de chevauchement' }
    ]
  },
  {
    id: 'demo-3',
    title: 'Session running',
    color: '#059669',
    hasTime: true,
    startTime: '12:30',
    endTime: '13:30',
    emoji: '🏃',
    items: [
      { id: 't8', text: 'S\'échauffer les articulations' },
      { id: 't9', text: 'Parcours de 6 km' }
    ]
  },
  {
    id: 'demo-4',
    title: 'Courses',
    color: '#eab308', 
    hasTime: false,
    startTime: '12:00', 
    endTime: '13:00',
    emoji: '🛒',
    items: [
      { id: 'c1', text: 'Pâtes complètes' },
      { id: 'c2', text: 'Lait d\'avoine' },
      { id: 'c3', text: 'Avocats mûrs' }
    ]
  },
  {
    id: 'demo-5',
    title: 'Idées',
    color: '#0ea5e9',
    hasTime: false,
    startTime: '14:00',
    endTime: '15:00',
    emoji: '💡',
    items: [
      { id: 'i1', text: 'Apprendre le piano' },
      { id: 'i2', text: 'Réserver vacances d\'été' }
    ]
  }
];

export default function App() {
  const [slots, setSlots] = useState(() => {
    // Read from new key first
    const savedUnified = localStorage.getItem('day_scheduler_unified_slots');
    if (savedUnified) return JSON.parse(savedUnified);

    // Migration from previous separate collections
    const oldSlotsStr = localStorage.getItem('day_scheduler_slots');
    const oldColsStr = localStorage.getItem('day_scheduler_collections');
    
    if (oldSlotsStr || oldColsStr) {
      let merged = [];
      if (oldSlotsStr) {
        const oldSlots = JSON.parse(oldSlotsStr);
        merged = [...merged, ...oldSlots.map(s => ({...s, hasTime: true, emoji: s.emoji || '📝'}))];
      }
      if (oldColsStr) {
        const oldCols = JSON.parse(oldColsStr);
        merged = [...merged, ...oldCols.map(c => ({
          ...c, 
          hasTime: false, 
          color: '#6366f1', 
          startTime: '12:00', 
          endTime: '13:00'
        }))];
      }
      return merged;
    }
    
    return INITIAL_SLOTS;
  });

  // Selection state for viewing details
  const [selectedItem, setSelectedItem] = useState(null); 
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Editor states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create'); // 'create' or 'edit'

  // Unified editor fields
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editColor, setEditColor] = useState('#4f46e5');
  const [editEmoji, setEditEmoji] = useState('📝');
  const [editHasTime, setEditHasTime] = useState(true);
  const [editStartTime, setEditStartTime] = useState('09:00');
  const [editEndTime, setEditEndTime] = useState('10:00');
  const [editItems, setEditItems] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('day_scheduler_unified_slots', JSON.stringify(slots));
  }, [slots]);

  // Derived filtered lists
  const timelineSlots = slots.filter(s => s.hasTime);
  const footerSlots = slots.filter(s => !s.hasTime);

  // --- ACTIONS ---

  const handleAddSlotAtTime = (start, end) => {
    setEditorMode('create');
    setEditId(null);
    setEditTitle('');
    setEditColor('#4f46e5');
    setEditEmoji('📝');
    setEditHasTime(true);
    setEditStartTime(start);
    setEditEndTime(end);
    setEditItems([]);
    setIsEditOpen(true);
  };

  const handleAddFooterSlot = () => {
    setEditorMode('create');
    setEditId(null);
    setEditTitle('');
    setEditColor('#6366f1');
    setEditEmoji('📝');
    setEditHasTime(false);
    setEditStartTime('12:00'); 
    setEditEndTime('13:00');
    setEditItems([]);
    setIsEditOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditorMode('edit');
    setEditId(slot.id);
    setEditTitle(slot.title);
    setEditColor(slot.color || '#4f46e5');
    setEditEmoji(slot.emoji || '📝');
    setEditHasTime(slot.hasTime ?? true);
    setEditStartTime(slot.startTime || '12:00');
    setEditEndTime(slot.endTime || '13:00');
    setEditItems([...(slot.items || [])]);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteSlot = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet élément ?')) {
      setSlots(prev => prev.filter(s => s.id !== id));
      setIsDetailOpen(false);
      setIsEditOpen(false);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  };

  const handleStartTimeChange = (newStart) => {
    setEditStartTime(newStart);
    const startDec = timeToDecimal(newStart);
    const endDec = timeToDecimal(editEndTime);
    if (startDec >= endDec) {
      setEditEndTime(decimalToTime(Math.min(24, startDec + 1)));
    }
  };

  const handleAddDetailItem = (text) => {
    if (!selectedItem) return;
    const newItem = { id: `item-${Date.now()}`, text };
    const updatedSlot = { ...selectedItem, items: [...(selectedItem.items || []), newItem] };
    setSelectedItem(updatedSlot);
    setSlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleDeleteDetailItem = (itemId) => {
    if (!selectedItem) return;
    const updatedSlot = { ...selectedItem, items: selectedItem.items.filter(item => item.id !== itemId) };
    setSelectedItem(updatedSlot);
    setSlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleSaveEditor = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    let startDec = timeToDecimal(editStartTime);
    let endDec = timeToDecimal(editEndTime);
    let finalEndTime = editEndTime;

    if (endDec <= startDec) {
      finalEndTime = decimalToTime(Math.min(24, startDec + 1));
    }

    const emojiVal = editEmoji.trim() || '📝';
    const singleCharEmoji = [...emojiVal][0] || '📝';

    const slotData = {
      title: editTitle.trim(),
      color: editColor,
      emoji: singleCharEmoji,
      hasTime: editHasTime,
      startTime: editStartTime,
      endTime: finalEndTime,
      items: editItems
    };

    if (editorMode === 'create') {
      const newSlot = {
        id: `slot-${Date.now()}`,
        ...slotData
      };
      setSlots(prev => [...prev, newSlot]);
    } else {
      const updatedSlot = {
        id: editId,
        ...slotData
      };
      setSlots(prev => prev.map(s => s.id === editId ? updatedSlot : s));
      if (selectedItem && selectedItem.id === editId) {
        setSelectedItem(updatedSlot);
      }
    }

    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
  };

  return (
    <div className="app-container">
      <main className="app-main">
        <Timeline 
          slots={timelineSlots} 
          onSelectSlot={(slot) => {
            setSelectedItem(slot);
            setIsDetailOpen(true);
          }}
          onAddSlotAtTime={handleAddSlotAtTime}
        />
      </main>

      <footer className="app-footer">
        <div className="footer-carousel">
          {footerSlots.map(slot => (
            <button
              key={slot.id}
              type="button"
              className="carousel-item-btn btn-tap"
              style={{ '--btn-theme-color': slot.color }}
              onClick={() => {
                setSelectedItem(slot);
                setIsDetailOpen(true);
              }}
              title={slot.title}
            >
              <span className="carousel-item-emoji">{slot.emoji}</span>
              <span className="carousel-item-title">{slot.title}</span>
            </button>
          ))}
          
          <button
            type="button"
            className="carousel-add-btn btn-tap"
            onClick={handleAddFooterSlot}
            title="Créer un bouton libre"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </footer>

      {/* 1. Detail Popup / Bottom Sheet */}
      <BottomSheet
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={selectedItem ? `${selectedItem.emoji} ${selectedItem.title}` : ''}
      >
        {selectedItem && (
          <div 
            className="slot-detail-container" 
            style={{ '--theme-color': selectedItem.color }}
          >
            {selectedItem.hasTime && (
              <div className="slot-detail-meta">
                <span className="slot-detail-time-badge" style={{ backgroundColor: `${selectedItem.color}25`, color: selectedItem.color }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {selectedItem.startTime} - {selectedItem.endTime}
                </span>
              </div>
            )}

            <div className="slot-detail-checklist">
              <Checklist
                items={selectedItem.items || []}
                onAddItem={handleAddDetailItem}
                onDeleteItem={handleDeleteDetailItem}
                themeColor={selectedItem.color}
              />
            </div>

            <div className="slot-detail-actions">
              <button 
                type="button" 
                className="action-btn action-edit btn-tap"
                onClick={() => handleOpenEdit(selectedItem)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Modifier
              </button>
              
              <button 
                type="button" 
                className="action-btn action-delete btn-tap"
                onClick={() => handleDeleteSlot(selectedItem.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* 2. Create / Edit Bottom Sheet */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={editorMode === 'create' ? 'Nouvel élément' : 'Modifier l\'élément'}
      >
        <form onSubmit={handleSaveEditor} className="slot-editor-form">
          
          <div className="editor-group-row">
            <div className="editor-group" style={{ flex: '0 0 80px' }}>
              <label className="editor-label">Émoji</label>
              <input
                type="text"
                placeholder="📝"
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                maxLength={2}
                className="editor-input-title"
                style={{ textAlign: 'center', fontSize: '24px', padding: '10px' }}
                required
              />
            </div>
            <div className="editor-group">
              <label className="editor-label">Titre</label>
              <input
                type="text"
                placeholder="Ex: Réunion, Courses..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="editor-input-title"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="editor-group border-top">
            <label className="editor-switch-label">
              <div className="editor-switch-text">
                <span className="editor-label" style={{ margin: 0 }}>Assigner un horaire</span>
                <span className="editor-desc">Afficher dans le calendrier</span>
              </div>
              <input 
                type="checkbox" 
                checked={editHasTime} 
                onChange={(e) => setEditHasTime(e.target.checked)} 
                className="editor-switch-checkbox"
              />
              <span className="editor-switch-slider"></span>
            </label>
          </div>

          {editHasTime && (
            <div className="editor-group-row">
              <div className="editor-group">
                <label className="editor-label">Début</label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="editor-input-time"
                />
              </div>
              <div className="editor-group">
                <label className="editor-label">Fin</label>
                <input
                  type="time"
                  value={editEndTime}
                  onChange={(e) => setEditEndTime(e.target.value)}
                  className="editor-input-time"
                />
              </div>
            </div>
          )}

          <div className="editor-group border-top">
             <label className="editor-label">Couleur</label>
            <ColorPicker
              selectedColor={editColor}
              onSelectColor={setEditColor}
            />
          </div>

          <div className="editor-submit-area">
            <button 
              type="submit" 
              className="editor-save-btn btn-tap"
              style={{ backgroundColor: editColor }}
            >
              Enregistrer
            </button>
            
            {editorMode === 'edit' && (
              <button 
                type="button" 
                className="editor-delete-btn btn-tap"
                onClick={() => handleDeleteSlot(editId)}
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
