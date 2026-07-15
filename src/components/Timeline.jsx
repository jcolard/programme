import React, { useRef, useEffect } from 'react';
import SlotCard from './SlotCard';
import './Timeline.css';

const DAY_START = 6; // 06:00
const DAY_END = 24;  // 24:00
const HOUR_HEIGHT = 40; // pixels per hour

// Helper to convert HH:MM to decimal hours
export function timeToDecimal(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + minutes / 60;
}

// Helper to convert decimal hours to HH:MM
export function decimalToTime(decimal) {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}`;
}

export default function Timeline({ slots = [], onSelectSlot, onAddSlotAtTime }) {
  const containerRef = useRef(null);
  const hours = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i);

  // Auto-scroll to current hour or first slot on load
  useEffect(() => {
    if (containerRef.current) {
      const currentHour = new Date().getHours();
      const targetHour = Math.max(DAY_START, Math.min(DAY_END - 3, currentHour - 1));
      const scrollTop = (targetHour - DAY_START) * HOUR_HEIGHT;
      containerRef.current.scrollTop = scrollTop;
    }
  }, []);

  const handleTimelineClick = (e) => {
    // Check if the click was directly on the timeline grid (not on a card)
    if (!e.target.classList.contains('timeline-grid-overlay') && !e.target.classList.contains('timeline-grid-row')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top + e.currentTarget.scrollTop;
    const decimalHour = DAY_START + relativeY / HOUR_HEIGHT;
    
    // Round to nearest 30 mins
    const roundedHour = Math.round(decimalHour * 2) / 2;
    
    // Clamp inside limits
    const startHour = Math.max(DAY_START, Math.min(DAY_END - 0.5, roundedHour));
    const endHour = Math.min(DAY_END, startHour + 1);

    onAddSlotAtTime(decimalToTime(startHour), decimalToTime(endHour));
  };

  // Algorithm to compute columns for overlapping slots
  const computeOverlaps = () => {
    // 1. Sort slots
    const sorted = [...slots].sort((a, b) => timeToDecimal(a.startTime) - timeToDecimal(b.startTime));
    const layouts = [];

    // 2. Group slots into clusters that overlap
    let currentCluster = [];
    let clusterEnd = 0;

    for (const slot of sorted) {
      const start = timeToDecimal(slot.startTime);
      const end = timeToDecimal(slot.endTime);

      if (currentCluster.length === 0 || start < clusterEnd) {
        currentCluster.push(slot);
        clusterEnd = Math.max(clusterEnd, end);
      } else {
        processCluster(currentCluster, layouts);
        currentCluster = [slot];
        clusterEnd = end;
      }
    }
    if (currentCluster.length > 0) {
      processCluster(currentCluster, layouts);
    }

    return layouts;
  };

  const processCluster = (cluster, layouts) => {
    const columns = []; // will store arrays of end times for each column
    
    for (const slot of cluster) {
      const start = timeToDecimal(slot.startTime);
      const end = timeToDecimal(slot.endTime);
      
      let columnIndex = 0;
      // Find the first column where this slot fits
      while (columnIndex < columns.length && columns[columnIndex] > start) {
        columnIndex++;
      }
      
      columns[columnIndex] = end;
      slot.col = columnIndex;
    }
    
    // Total columns in this cluster
    const totalCols = columns.length;
    
    for (const slot of cluster) {
      layouts.push({
        slot,
        style: {
          top: `${(timeToDecimal(slot.startTime) - DAY_START) * HOUR_HEIGHT}px`,
          height: `${(timeToDecimal(slot.endTime) - timeToDecimal(slot.startTime)) * HOUR_HEIGHT}px`,
          left: `${(slot.col / totalCols) * 90}%`, // leave 10% space on the right for clean layout
          width: `${88 / totalCols}%`,
        }
      });
    }
  };

  const layouts = computeOverlaps();

  return (
    <div className="timeline-container" ref={containerRef}>
      <div 
        className="timeline-content" 
        style={{ height: `${(DAY_END - DAY_START) * HOUR_HEIGHT + 40}px` }}
        onClick={handleTimelineClick}
      >
        {/* Hour Sidebar and Horizontal Grid Lines */}
        {hours.map((hour, index) => {
          const isLast = index === hours.length - 1;
          const displayHour = hour === 24 ? '00:00' : `${String(hour).padStart(2, '0')}:00`;
          
          return (
            <div 
              key={hour} 
              className="timeline-grid-row" 
              style={{ 
                top: `${index * HOUR_HEIGHT}px`,
                height: `${HOUR_HEIGHT}px`
              }}
            >
              <div className="timeline-hour-label">{displayHour}</div>
              {!isLast && <div className="timeline-grid-line" />}
            </div>
          );
        })}

        {/* Overlay grid for detecting clicks */}
        <div className="timeline-grid-overlay" />

        {/* Rendered Slots */}
        <div className="timeline-slots-area">
          {layouts.map(({ slot, style }) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              style={style}
              onClick={() => onSelectSlot(slot)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
