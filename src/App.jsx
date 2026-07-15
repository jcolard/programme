import React, { useState, useEffect } from 'react';
import Timeline, { timeToDecimal, decimalToTime } from './components/Timeline';
import BottomSheet from './components/BottomSheet';
import ColorPicker, { PRESET_COLORS } from './components/ColorPicker';
import Checklist from './components/Checklist';
import './App.css';

// Initial demo slots (no done state)
const INITIAL_SLOTS = [
  {
    id: 'demo-1',
    title: 'Rituel matinal & Café ☕',
    color: '#7c3aed',
    startTime: '07:30',
    endTime: '08:30',
    items: [
      { id: 't1', text: 'Boire un grand verre d\'eau' },
      { id: 't2', text: '10 min de méditation' },
      { id: 't3', text: 'Moudre le café frais' }
    ]
  },
  {
    id: 'demo-2',
    title: 'Développement App Mobile 🚀',
    color: '#4f46e5',
    startTime: '09:00',
    endTime: '11:30',
    items: [
      { id: 't4', text: 'Créer le design system CSS' },
      { id: 't5', text: 'Implémenter le bottom sheet tactile' },
      { id: 't6', text: 'Gérer la logique de chevauchement' }
    ]
  },
  {
    id: 'demo-3',
    title: 'Session running 🏃‍♂️',
    color: '#059669',
    startTime: '12:30',
    endTime: '13:30',
    items: [
      { id: 't8', text: 'S\'échauffer les articulations' },
      { id: 't9', text: 'Parcours de 6 km' }
    ]
  }
];

// Initial collections (standalone lists)
const INITIAL_COLLECTIONS = [
  {
    id: 'col-1',
    emoji: '🛒',
    title: 'Courses',
    items: [
      { id: 'c1', text: 'Pâtes complètes' },
      { id: 'c2', text: 'Lait d\'avoine' },
      { id: 'c3', text: 'Avocats mûrs' }
    ]
  },
  {
    id: 'col-2',
    emoji: '💡',
    title: 'Idées',
    items: [
      { id: 'i1', text: 'Apprendre le piano' },
      { id: 'i2', text: 'Réserver vacances d\'été' }
    ]
  },
  {
    id: 'col-3',
    emoji: '🍿',
    title: 'Films à voir',
    items: [
      { id: 'f1', text: 'Interstellar' },
      { id: 'f2', text: 'Inception' }
    ]
  }
];

export default function App() {
  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem('day_scheduler_slots');
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
  });

  const [collections, setCollections] = useState(() => {
    const saved = localStorage.getItem('day_scheduler_collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  // Selection states for viewing details
  const [selectedItem, setSelectedItem] = useState(null); // slot or collection
  const [selectedType, setSelectedType] = useState(null); // 'slot' or 'collection'
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Editor states (Slot or Collection)
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editorType, setEditorType] = useState('slot'); // 'slot' or 'collection'
  const [editorMode, setEditorMode] = useState('create'); // 'create' or 'edit'

  // Slot editor fields
  const [editSlotId, setEditSlotId] = useState(null);
  const [editSlotTitle, setEditSlotTitle] = useState('');
  const [editSlotColor, setEditSlotColor] = useState('#4f46e5');
  const [editSlotStartTime, setEditSlotStartTime] = useState('09:00');
  const [editSlotEndTime, setEditSlotEndTime] = useState('10:00');
  const [editSlotItems, setEditSlotItems] = useState([]);

  // Collection editor fields
  const [editColId, setEditColId] = useState(null);
  const [editColEmoji, setEditColEmoji] = useState('📝');
  const [editColTitle, setEditColTitle] = useState('');
  const [editColItems, setEditColItems] = useState([]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('day_scheduler_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('day_scheduler_collections', JSON.stringify(collections));
  }, [collections]);

  // --- SLOT ACTIONS ---

  const handleAddSlotAtTime = (start, end) => {
    setEditorType('slot');
    setEditorMode('create');
    setEditSlotId(null);
    setEditSlotTitle('');
    setEditSlotColor('#4f46e5');
    setEditSlotStartTime(start);
    setEditSlotEndTime(end);
    setEditSlotItems([]);
    setIsEditOpen(true);
  };

  const handleOpenEditSlot = (slot) => {
    setEditorType('slot');
    setEditorMode('edit');
    setEditSlotId(slot.id);
    setEditSlotTitle(slot.title);
    setEditSlotColor(slot.color);
    setEditSlotStartTime(slot.startTime);
    setEditSlotEndTime(slot.endTime);
    setEditSlotItems([...slot.items]);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteSlot = (id) => {
    setSlots(prev => prev.filter(s => s.id !== id));
    setIsDetailOpen(false);
    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const handleStartTimeChange = (newStart) => {
    setEditSlotStartTime(newStart);
    const startDec = timeToDecimal(newStart);
    const endDec = timeToDecimal(editSlotEndTime);
    if (startDec >= endDec) {
      setEditSlotEndTime(decimalToTime(Math.min(24, startDec + 1)));
    }
  };

  // --- COLLECTION ACTIONS ---

  const handleOpenCreateCollection = () => {
    setEditorType('collection');
    setEditorMode('create');
    setEditColId(null);
    setEditColEmoji('📝');
    setEditColTitle('');
    setEditColItems([]);
    setIsEditOpen(true);
  };

  const handleOpenEditCollection = (col) => {
    setEditorType('collection');
    setEditorMode('edit');
    setEditColId(col.id);
    setEditColEmoji(col.emoji);
    setEditColTitle(col.title);
    setEditColItems([...col.items]);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteCollection = (id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
    setIsDetailOpen(false);
    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  // --- GLOBAL SUB-ITEM ACTIONS (Within Detail Sheets) ---

  const handleAddDetailItem = (text) => {
    if (!selectedItem) return;

    const newItem = { id: `item-${Date.now()}`, text };
    
    if (selectedType === 'slot') {
      const updatedSlot = { ...selectedItem, items: [...selectedItem.items, newItem] };
      setSelectedItem(updatedSlot);
      setSlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    } else {
      const updatedCol = { ...selectedItem, items: [...selectedItem.items, newItem] };
      setSelectedItem(updatedCol);
      setCollections(prev => prev.map(c => c.id === selectedItem.id ? updatedCol : c));
    }
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleDeleteDetailItem = (itemId) => {
    if (!selectedItem) return;

    if (selectedType === 'slot') {
      const updatedSlot = { ...selectedItem, items: selectedItem.items.filter(item => item.id !== itemId) };
      setSelectedItem(updatedSlot);
      setSlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    } else {
      const updatedCol = { ...selectedItem, items: selectedItem.items.filter(item => item.id !== itemId) };
      setSelectedItem(updatedCol);
      setCollections(prev => prev.map(c => c.id === selectedItem.id ? updatedCol : c));
    }
    if (navigator.vibrate) navigator.vibrate(10);
  };

  // --- SAVE BUTTON HANDLERS ---

  const handleSaveEditor = (e) => {
    e.preventDefault();

    if (editorType === 'slot') {
      if (!editSlotTitle.trim()) return;
      let startDec = timeToDecimal(editSlotStartTime);
      let endDec = timeToDecimal(editSlotEndTime);
      let finalEndTime = editSlotEndTime;

      if (endDec <= startDec) {
        finalEndTime = decimalToTime(Math.min(24, startDec + 1));
      }

      if (editorMode === 'create') {
        const newSlot = {
          id: `slot-${Date.now()}`,
          title: editSlotTitle.trim(),
          color: editSlotColor,
          startTime: editSlotStartTime,
          endTime: finalEndTime,
          items: []
        };
        setSlots(prev => [...prev, newSlot]);
      } else {
        const updatedSlot = {
          id: editSlotId,
          title: editSlotTitle.trim(),
          color: editSlotColor,
          startTime: editSlotStartTime,
          endTime: finalEndTime,
          items: editSlotItems
        };
        setSlots(prev => prev.map(s => s.id === editSlotId ? updatedSlot : s));
        if (selectedItem && selectedItem.id === editSlotId) {
          setSelectedItem(updatedSlot);
        }
      }
    } else {
      if (!editColTitle.trim()) return;
      
      const emojiVal = editColEmoji.trim() || '📝';
      const singleCharEmoji = [...emojiVal][0] || '📝'; // Extract first character/emoji safely

      if (editorMode === 'create') {
        const newCol = {
          id: `col-${Date.now()}`,
          emoji: singleCharEmoji,
          title: editColTitle.trim(),
          items: []
        };
        setCollections(prev => [...prev, newCol]);
      } else {
        const updatedCol = {
          id: editColId,
          emoji: singleCharEmoji,
          title: editColTitle.trim(),
          items: editColItems
        };
        setCollections(prev => prev.map(c => c.id === editColId ? updatedCol : c));
        if (selectedItem && selectedItem.id === editColId) {
          setSelectedItem(updatedCol);
        }
      }
    }

    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
  };

  return (
    <div className="app-container">
      {/* Timeline occupies full top area now (header removed) */}
      <main className="app-main">
        <Timeline 
          slots={slots} 
          onSelectSlot={(slot) => {
            setSelectedItem(slot);
            setSelectedType('slot');
            setIsDetailOpen(true);
          }}
          onAddSlotAtTime={handleAddSlotAtTime}
        />
      </main>

      {/* Footer containing collections horizontal carousel */}
      <footer className="app-footer">
        <div className="footer-carousel">
          {collections.map(col => (
            <button
              key={col.id}
              type="button"
              className="carousel-item-btn btn-tap"
              onClick={() => {
                setSelectedItem(col);
                setSelectedType('collection');
                setIsDetailOpen(true);
              }}
              title={col.title}
            >
              <span className="carousel-item-emoji">{col.emoji}</span>
              <span className="carousel-item-title">{col.title}</span>
            </button>
          ))}
          
          {/* Add Collection Button */}
          <button
            type="button"
            className="carousel-add-btn btn-tap"
            onClick={handleOpenCreateCollection}
            title="Créer une collection"
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
        title={selectedItem ? `${selectedType === 'collection' ? selectedItem.emoji + ' ' : ''}${selectedItem.title}` : ''}
      >
        {selectedItem && (
          <div 
            className="slot-detail-container" 
            style={{ '--theme-color': selectedType === 'slot' ? selectedItem.color : 'var(--accent)' }}
          >
            {selectedType === 'slot' && (
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
                items={selectedItem.items}
                onAddItem={handleAddDetailItem}
                onDeleteItem={handleDeleteDetailItem}
                themeColor={selectedType === 'slot' ? selectedItem.color : 'var(--accent)'}
              />
            </div>

            <div className="slot-detail-actions">
              <button 
                type="button" 
                className="action-btn action-edit btn-tap"
                onClick={() => {
                  if (selectedType === 'slot') {
                    handleOpenEditSlot(selectedItem);
                  } else {
                    handleOpenEditCollection(selectedItem);
                  }
                }}
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
                onClick={() => {
                  if (selectedType === 'slot') {
                    handleDeleteSlot(selectedItem.id);
                  } else {
                    handleDeleteCollection(selectedItem.id);
                  }
                }}
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
        title={
          editorType === 'slot'
            ? (editorMode === 'create' ? 'Nouveau créneau' : 'Modifier le créneau')
            : (editorMode === 'create' ? 'Nouvelle collection' : 'Modifier la collection')
        }
      >
        <form onSubmit={handleSaveEditor} className="slot-editor-form">
          {editorType === 'slot' ? (
            /* --- SLOT FORM --- */
            <>
              <div className="editor-group">
                <label className="editor-label">Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Réunion de projet, Sport..."
                  value={editSlotTitle}
                  onChange={(e) => setEditSlotTitle(e.target.value)}
                  className="editor-input-title"
                  required
                  autoFocus
                />
              </div>

              <div className="editor-group-row">
                <div className="editor-group">
                  <label className="editor-label">Début</label>
                  <input
                    type="time"
                    value={editSlotStartTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="editor-input-time"
                  />
                </div>
                <div className="editor-group">
                  <label className="editor-label">Fin</label>
                  <input
                    type="time"
                    value={editSlotEndTime}
                    onChange={(e) => setEditSlotEndTime(e.target.value)}
                    className="editor-input-time"
                  />
                </div>
              </div>

              <div className="editor-group">
                <ColorPicker
                  selectedColor={editSlotColor}
                  onSelectColor={setEditSlotColor}
                />
              </div>
            </>
          ) : (
            /* --- COLLECTION FORM --- */
            <>
              <div className="editor-group-row">
                <div className="editor-group" style={{ flex: '0 0 80px' }}>
                  <label className="editor-label">Émoji</label>
                  <input
                    type="text"
                    placeholder="📝"
                    value={editColEmoji}
                    onChange={(e) => {
                      const val = e.target.value;
                      // Keep only the first character (handling compound emojis is tricky, but browser max length works best)
                      setEditColEmoji(val);
                    }}
                    maxLength={2} // Emojis are sometimes 2 characters in JS strings
                    className="editor-input-title"
                    style={{ textAlign: 'center', fontSize: '24px', padding: '10px' }}
                    required
                  />
                </div>
                <div className="editor-group">
                  <label className="editor-label">Titre de la collection</label>
                  <input
                    type="text"
                    placeholder="Ex: Courses, Livres..."
                    value={editColTitle}
                    onChange={(e) => setEditColTitle(e.target.value)}
                    className="editor-input-title"
                    required
                    autoFocus
                  />
                </div>
              </div>
            </>
          )}

          <div className="editor-submit-area">
            <button 
              type="submit" 
              className="editor-save-btn btn-tap"
              style={{ backgroundColor: editorType === 'slot' ? editSlotColor : 'var(--accent)' }}
            >
              Enregistrer
            </button>
            
            {editorMode === 'edit' && (
              <button 
                type="button" 
                className="editor-delete-btn btn-tap"
                onClick={() => {
                  if (editorType === 'slot') {
                    handleDeleteSlot(editSlotId);
                  } else {
                    handleDeleteCollection(editColId);
                  }
                }}
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
