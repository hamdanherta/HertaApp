import React from 'react';
import { X, Gauge, HandCoins, HardDriveDownload, Home, Bell, Heart, User, PlusCircle, ShieldCheck, ChevronRight, Settings } from 'lucide-react';

export const HamburgerMenu = ({ isOpen, onClose, onSelectMenu }) => {
  if (!isOpen) return null;

  const handleMenuClick = (action) => {
    onSelectMenu(action);
    onClose();
  };

  return (
    <div className="hn-modal-overlay" style={{ alignItems: 'stretch', justifyContent: 'flex-start', padding: 0 }}>
      <div 
        className="hn-drawer-content"
        style={{
          backgroundColor: '#FFFFFF',
          borderRight: '3px solid #005BAB',
          width: '85%',
          maxWidth: '360px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '10px 0 30px rgba(0, 91, 171, 0.3)',
          animation: 'slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          overflowY: 'auto'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          backgroundColor: '#005BAB',
          color: '#FFF3DD',
          padding: '20px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #005BAB'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', tracking: '-0.5px', color: '#FFF3DD' }}>Menu Utama</h2>
            <div style={{ fontSize: '11px', color: '#FFF3DD', opacity: 0.9, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} /> Herta App Mobile
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#FFF3DD',
              color: '#005BAB',
              border: '2px solid #005BAB',
              borderRadius: '10px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items List */}
        <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', opacity: 0.8, marginLeft: '4px' }}>
            FITUR UTAMA APLIKASI
          </div>

          {/* Feature 1: Catatan Ganti Oli */}
          <button 
            className="hn-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px',
              textAlign: 'left',
              backgroundColor: '#FFF3DD',
              color: '#005BAB',
              cursor: 'pointer'
            }}
            onClick={() => handleMenuClick('oil')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1.5px solid #005BAB', color: '#005BAB' }}>
                <Gauge size={22} color="#005BAB" />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#005BAB' }}>Catatan Ganti Oli</div>
              </div>
            </div>
            <ChevronRight size={18} color="#005BAB" />
          </button>

          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', opacity: 0.8, marginLeft: '4px', marginTop: '10px' }}>
            NAVIGASI & AKUN
          </div>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
            onClick={() => handleMenuClick('beranda')}
          >
            <Home size={18} />
            <span style={{ fontWeight: '700' }}>Beranda Utama</span>
          </button>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
            onClick={() => handleMenuClick('notifikasi')}
          >
            <Bell size={18} />
            <span style={{ fontWeight: '700' }}>Notifikasi Pengingat</span>
          </button>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
            onClick={() => handleMenuClick('favorit')}
          >
            <Heart size={18} />
            <span style={{ fontWeight: '700' }}>Catatan Favorit</span>
          </button>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
            onClick={() => handleMenuClick('profil')}
          >
            <User size={18} />
            <span style={{ fontWeight: '700' }}>Profil Pengguna</span>
          </button>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '12px' }}
            onClick={() => handleMenuClick('backup')}
          >
            <HardDriveDownload size={18} />
            <span style={{ fontWeight: '700' }}>Backup & Restore JSON</span>
          </button>

          {/* Scalable placeholder for future features */}
          <div style={{
            marginTop: 'auto',
            padding: '12px',
            backgroundColor: '#FFF3DD',
            borderRadius: '14px',
            border: '1.5px dashed #005BAB',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            <PlusCircle size={20} style={{ margin: '0 auto 4px', display: 'block' }} />
            Siap untuk penambahan fitur-fitur baru di masa depan!
          </div>

        </div>
      </div>
    </div>
  );
};
