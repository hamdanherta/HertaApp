import React from 'react';
import { Menu, Gauge, Download, ShieldCheck } from 'lucide-react';

export const Header = ({ onOpenMenu, onOpenBackup }) => {
  return (
    <header className="hn-card-brand" style={{ borderRadius: '0 0 24px 24px', margin: 0, borderWidth: '0 0 3px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Left: Hamburger Menu Button */}
        <button 
          onClick={onOpenMenu}
          className="hn-btn-icon"
          style={{ width: '42px', height: '42px', backgroundColor: '#FFF3DD', color: '#005BAB' }}
          title="Buka Menu Utama"
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        {/* Center: Brand Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '800', tracking: '-0.5px', lineHeight: '1.1', color: '#FFF3DD' }}>
            Herta App
          </h1>
        </div>

        {/* Right: Quick Backup Button */}
        <button 
          onClick={onOpenBackup}
          className="hn-btn-secondary"
          style={{ padding: '8px 12px', fontSize: '12px' }}
          title="Backup & Restore Data"
        >
          <Download size={16} />
          <span>Backup</span>
        </button>

      </div>
    </header>
  );
};
