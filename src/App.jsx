import React, { useState, useEffect } from 'react';
import Timeline, { timeToDecimal, decimalToTime } from './components/Timeline';
import BottomSheet from './components/BottomSheet';
import ColorPicker from './components/ColorPicker';
import Checklist from './components/Checklist';
import { uploadToDrive, downloadFromDrive, DEFAULT_APPS_SCRIPT_URL } from './services/syncService';
import './App.css';

// Initial demo slots for Day 1
const INITIAL_SLOTS_DAY1 = [
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

const INITIAL_SLOTS_DAY2 = [
  {
    id: 'day2-1',
    title: 'Entraînement physique',
    color: '#059669',
    hasTime: true,
    startTime: '08:00',
    endTime: '09:30',
    emoji: '💪',
    items: [
      { id: 'd2-1', text: 'Échauffement articulaire' },
      { id: 'd2-2', text: 'Circuit renforcement' },
      { id: 'd2-3', text: 'Étirements et récupération' }
    ]
  },
  {
    id: 'day2-2',
    title: 'Travail Approfondi & Focus',
    color: '#4f46e5',
    hasTime: true,
    startTime: '10:00',
    endTime: '12:30',
    emoji: '🎯',
    items: [
      { id: 'd2-4', text: 'Projet prioritaire' },
      { id: 'd2-5', text: 'Rédaction technique' }
    ]
  },
  {
    id: 'day2-3',
    title: 'Revue & Organisation',
    color: '#0ea5e9',
    hasTime: true,
    startTime: '14:30',
    endTime: '16:00',
    emoji: '📋',
    items: [
      { id: 'd2-6', text: 'Traitement des e-mails' },
      { id: 'd2-7', text: 'Planifier les urgences' }
    ]
  },
  {
    id: 'day2-4',
    title: 'Notes & Idées',
    color: '#eab308',
    hasTime: false,
    startTime: '12:00',
    endTime: '13:00',
    emoji: '💡',
    items: [
      { id: 'd2-8', text: 'Idée de voyage' }
    ]
  }
];

const INITIAL_SLOTS_DAY3 = [
  {
    id: 'day3-1',
    title: 'Matinée Créative & Écriture',
    color: '#7c3aed',
    hasTime: true,
    startTime: '09:00',
    endTime: '11:00',
    emoji: '✍️',
    items: [
      { id: 'd3-1', text: 'Brainstorming idées' },
      { id: 'd3-2', text: 'Rédaction du compte-rendu' }
    ]
  },
  {
    id: 'day3-2',
    title: 'Détente & Loisirs',
    color: '#ec4899',
    hasTime: true,
    startTime: '14:00',
    endTime: '16:00',
    emoji: '🎧',
    items: [
      { id: 'd3-3', text: 'Écoute de podcasts' },
      { id: 'd3-4', text: 'Lecture 30 pages' }
    ]
  },
  {
    id: 'day3-3',
    title: 'Objectifs de la semaine',
    color: '#3b82f6',
    hasTime: false,
    startTime: '12:00',
    endTime: '13:00',
    emoji: '🎯',
    items: [
      { id: 'd3-5', text: 'Faire le point hebdo' }
    ]
  }
];

const DEFAULT_DAYS_STATE = {
  activeDayId: 'day1',
  days: {
    day1: { id: 'day1', name: 'Jour 1', slots: INITIAL_SLOTS_DAY1 },
    day2: { id: 'day2', name: 'Jour 2', slots: INITIAL_SLOTS_DAY2 },
    day3: { id: 'day3', name: 'Jour 3', slots: INITIAL_SLOTS_DAY3 }
  }
};

export default function App() {
  // App data state (multi-day)
  const [appData, setAppData] = useState(() => {
    // 1. Try loading full multi-day state
    const savedAppData = localStorage.getItem('day_scheduler_app_data');
    if (savedAppData) {
      try {
        const parsed = JSON.parse(savedAppData);
        if (parsed.days && parsed.activeDayId) {
          return parsed;
        }
      } catch (err) {
        console.error('Erreur de parsing appData:', err);
      }
    }

    // 2. Migration from single day unified slots
    const savedUnified = localStorage.getItem('day_scheduler_unified_slots');
    if (savedUnified) {
      try {
        const slotsDay1 = JSON.parse(savedUnified);
        return {
          ...DEFAULT_DAYS_STATE,
          days: {
            ...DEFAULT_DAYS_STATE.days,
            day1: { id: 'day1', name: 'Jour 1', slots: slotsDay1 }
          }
        };
      } catch (err) {
        console.error('Erreur migration unified_slots:', err);
      }
    }

    // 3. Migration from very old separate storage
    const oldSlotsStr = localStorage.getItem('day_scheduler_slots');
    const oldColsStr = localStorage.getItem('day_scheduler_collections');
    if (oldSlotsStr || oldColsStr) {
      let merged = [];
      if (oldSlotsStr) {
        const oldSlots = JSON.parse(oldSlotsStr);
        merged = [...merged, ...oldSlots.map(s => ({ ...s, hasTime: true, emoji: s.emoji || '📝' }))];
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
      return {
        ...DEFAULT_DAYS_STATE,
        days: {
          ...DEFAULT_DAYS_STATE.days,
          day1: { id: 'day1', name: 'Jour 1', slots: merged }
        }
      };
    }

    return DEFAULT_DAYS_STATE;
  });

  // Google Apps Script Web App URL state
  const [appsScriptUrl, setAppsScriptUrl] = useState(() => {
    return localStorage.getItem('day_scheduler_script_url') || DEFAULT_APPS_SCRIPT_URL;
  });

  // Sync / Cloud state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // { type: 'success' | 'error' | 'info', message: string }
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempScriptUrl, setTempScriptUrl] = useState('');

  // Active day and slots helper
  const activeDayId = appData.activeDayId || 'day1';
  const currentDay = appData.days[activeDayId] || appData.days['day1'];
  const currentSlots = currentDay?.slots || [];

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

  // Auto-hide sync toast after 4 seconds
  useEffect(() => {
    if (syncStatus) {
      const timer = setTimeout(() => {
        setSyncStatus(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [syncStatus]);

  // Persist appData to localStorage
  useEffect(() => {
    localStorage.setItem('day_scheduler_app_data', JSON.stringify(appData));
    // Also keep unified key updated for backward compatibility
    if (appData.days && appData.days[activeDayId]) {
      localStorage.setItem('day_scheduler_unified_slots', JSON.stringify(appData.days[activeDayId].slots));
    }
  }, [appData, activeDayId]);

  // Derived filtered lists for current day
  const timelineSlots = currentSlots.filter(s => s.hasTime);
  const footerSlots = currentSlots.filter(s => !s.hasTime);

  // --- DAY SWITCHER ---
  const handleSelectDay = (dayId) => {
    if (dayId === activeDayId) return;
    setAppData(prev => ({
      ...prev,
      activeDayId: dayId
    }));
    setSelectedItem(null);
    setIsDetailOpen(false);
    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const updateCurrentDaySlots = (updater) => {
    setAppData(prev => {
      const prevSlots = prev.days[activeDayId]?.slots || [];
      const newSlots = typeof updater === 'function' ? updater(prevSlots) : updater;
      return {
        ...prev,
        days: {
          ...prev.days,
          [activeDayId]: {
            ...prev.days[activeDayId],
            slots: newSlots
          }
        }
      };
    });
  };

  // --- CLOUD SYNC ACTIONS ---
  const handleUploadToDrive = async () => {
    const urlToUse = appsScriptUrl.trim() || DEFAULT_APPS_SCRIPT_URL;
    if (!urlToUse) {
      setTempScriptUrl('');
      setIsSettingsOpen(true);
      setSyncStatus({
        type: 'info',
        message: 'Veuillez configurer l\'URL du Google Apps Script pour sauvegarder.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncStatus({ type: 'info', message: 'Sauvegarde vers Google Drive en cours...' });

    try {
      await uploadToDrive(urlToUse, appData);
      setSyncStatus({
        type: 'success',
        message: '✅ Sauvegarde réussie sur Google Drive !'
      });
      if (navigator.vibrate) navigator.vibrate([20, 30, 40]);
    } catch (err) {
      console.error('Erreur upload drive:', err);
      setSyncStatus({
        type: 'error',
        message: `❌ Erreur sauvegarde : ${err.message || 'Impossible de joindre Apps Script'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadFromDrive = async () => {
    const urlToUse = appsScriptUrl.trim() || DEFAULT_APPS_SCRIPT_URL;
    if (!urlToUse) {
      setTempScriptUrl('');
      setIsSettingsOpen(true);
      setSyncStatus({
        type: 'info',
        message: 'Veuillez configurer l\'URL du Google Apps Script pour restaurer.'
      });
      return;
    }

    const confirmed = window.confirm(
      'Voulez-vous remplacer vos données locales actuelles par celles enregistrées sur Google Drive ?'
    );
    if (!confirmed) return;

    setIsSyncing(true);
    setSyncStatus({ type: 'info', message: 'Téléchargement depuis Google Drive...' });

    try {
      const remoteData = await downloadFromDrive(urlToUse);
      
      if (!remoteData || !remoteData.days) {
        throw new Error('Format de données invalide reçu du Google Drive.');
      }

      setAppData({
        activeDayId: remoteData.activeDayId || 'day1',
        days: {
          day1: remoteData.days.day1 || DEFAULT_DAYS_STATE.days.day1,
          day2: remoteData.days.day2 || DEFAULT_DAYS_STATE.days.day2,
          day3: remoteData.days.day3 || DEFAULT_DAYS_STATE.days.day3,
        }
      });

      setSelectedItem(null);
      setIsDetailOpen(false);
      setIsEditOpen(false);

      setSyncStatus({
        type: 'success',
        message: '✅ Données restaurées depuis Google Drive avec succès !'
      });
      if (navigator.vibrate) navigator.vibrate([30, 20, 30]);
    } catch (err) {
      console.error('Erreur download drive:', err);
      setSyncStatus({
        type: 'error',
        message: `❌ Erreur restauration : ${err.message || 'Impossible de charger le fichier'}`
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const cleanUrl = tempScriptUrl.trim();
    setAppsScriptUrl(cleanUrl);
    localStorage.setItem('day_scheduler_script_url', cleanUrl);
    setIsSettingsOpen(false);
    setSyncStatus({
      type: 'success',
      message: 'Configuration Google Apps Script enregistrée !'
    });
  };

  const handleOpenSettings = () => {
    setTempScriptUrl(appsScriptUrl);
    setIsSettingsOpen(true);
  };

  // --- SLOT ACTIONS ---

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
      updateCurrentDaySlots(prev => prev.filter(s => s.id !== id));
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
    updateCurrentDaySlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleUpdateDetailItem = (itemId, newText) => {
    if (!selectedItem) return;
    const updatedSlot = {
      ...selectedItem,
      items: (selectedItem.items || []).map(item =>
        item.id === itemId ? { ...item, text: newText } : item
      )
    };
    setSelectedItem(updatedSlot);
    updateCurrentDaySlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleDeleteDetailItem = (itemId) => {
    if (!selectedItem) return;
    const updatedSlot = { ...selectedItem, items: (selectedItem.items || []).filter(item => item.id !== itemId) };
    setSelectedItem(updatedSlot);
    updateCurrentDaySlots(prev => prev.map(s => s.id === selectedItem.id ? updatedSlot : s));
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
      updateCurrentDaySlots(prev => [...prev, newSlot]);
    } else {
      const updatedSlot = {
        id: editId,
        ...slotData
      };
      updateCurrentDaySlots(prev => prev.map(s => s.id === editId ? updatedSlot : s));
      if (selectedItem && selectedItem.id === editId) {
        setSelectedItem(updatedSlot);
      }
    }

    setIsEditOpen(false);
    if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
  };

  const dayTabs = [
    { id: 'day1', label: 'Jour 1' },
    { id: 'day2', label: 'Jour 2' },
    { id: 'day3', label: 'Jour 3' },
  ];

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {syncStatus && (
        <div className={`sync-toast toast-${syncStatus.type}`}>
          <span>{syncStatus.message}</span>
          <button 
            type="button" 
            className="toast-close-btn" 
            onClick={() => setSyncStatus(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* App Header with Multi-Day Tabs & Cloud Actions */}
      <header className="app-header">
        <div className="day-tabs-container">
          {dayTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`day-tab-btn btn-tap ${activeDayId === tab.id ? 'active' : ''}`}
              onClick={() => handleSelectDay(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cloud-actions-container">
          <button
            type="button"
            className="cloud-btn cloud-save btn-tap"
            onClick={handleUploadToDrive}
            disabled={isSyncing}
            title="Sauvegarder les 3 jours sur Google Drive"
          >
            {isSyncing ? (
              <span className="cloud-btn-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                <polyline points="12 11 12 17 12 11"/>
                <polyline points="9 14 12 11 15 14"/>
              </svg>
            )}
            <span className="cloud-btn-text">Sauvegarder</span>
          </button>

          <button
            type="button"
            className="cloud-btn cloud-restore btn-tap"
            onClick={handleDownloadFromDrive}
            disabled={isSyncing}
            title="Restaurer les données depuis Google Drive"
          >
            {isSyncing ? (
              <span className="cloud-btn-spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                <polyline points="12 17 12 11 12 17"/>
                <polyline points="9 14 12 17 15 14"/>
              </svg>
            )}
            <span className="cloud-btn-text">Restaurer</span>
          </button>

          <button
            type="button"
            className="cloud-settings-btn btn-tap"
            onClick={handleOpenSettings}
            title="Paramètres de synchronisation Google Apps Script"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Timeline View */}
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

      {/* Bottom Footer Carousel */}
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
                onUpdateItem={handleUpdateDetailItem}
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
            <div className="editor-group editor-emoji-group">
              <label className="editor-label">Émoji</label>
              <input
                type="text"
                placeholder="📝"
                value={editEmoji}
                onChange={(e) => setEditEmoji(e.target.value)}
                maxLength={2}
                className="editor-input-title"
                style={{ textAlign: 'center', fontSize: '22px', padding: '10px 4px' }}
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

      {/* 3. Cloud / Google Apps Script Settings Bottom Sheet */}
      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="☁️ Synchronisation Google Drive"
      >
        <form onSubmit={handleSaveSettings} className="settings-form">
          <p className="settings-desc">
            La synchronisation permet de sauvegarder ou restaurer vos 3 jours types sur votre fichier JSON Google Drive via Google Apps Script.
          </p>

          <div className="editor-group">
            <label className="editor-label">URL Web App Google Apps Script</label>
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={tempScriptUrl}
              onChange={(e) => setTempScriptUrl(e.target.value)}
              className="editor-input-title"
              style={{ fontSize: '13px', wordBreak: 'break-all' }}
            />
            <span className="settings-hint">
              ID Fichier Google Drive : <code>1tMm3y6prKb251h2Hq70rUt0ehfGWt2kB</code>
            </span>
          </div>

          <div className="settings-actions">
            <button type="submit" className="editor-save-btn btn-tap" style={{ backgroundColor: '#4f46e5' }}>
              Enregistrer l'URL
            </button>
          </div>
        </form>
      </BottomSheet>
    </div>
  );
}
