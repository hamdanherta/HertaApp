import React, { useState } from 'react';
import { User, ShieldCheck, HardDriveDownload, Trash2, AlertTriangle } from 'lucide-react';
import { clearAllData } from '../utils/storage';

export const ProfilView = ({ settings = {}, onSaveSettings, onOpenBackup, onRefreshData }) => {
  const [nameInput, setNameInput] = useState(settings?.ownerName || 'Pengguna Herta App');
  const [savedNotice, setSavedNotice] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveName = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      ownerName: nameInput
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const executeResetData = () => {
    clearAllData();
    onRefreshData();
    setShowResetConfirm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '150px' }}>
      
      {/* Profile Header */}
      <div className="hn-card-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            backgroundColor: '#FFF3DD',
            color: '#005BAB',
            padding: '12px',
            borderRadius: '16px',
            border: '2px solid #005BAB'
          }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{settings?.ownerName || 'Pengguna Herta App'}</h2>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Herta App Storage V2
            </div>
          </div>
        </div>
      </div>

      {/* Edit Name Form */}
      <div className="hn-card">
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>Pengaturan Profil</h3>
        <form onSubmit={handleSaveName}>
          <div className="hn-input-group">
            <label className="hn-label">Nama Pemilik Akun</label>
            <input 
              type="text"
              className="hn-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Nama Anda"
              required
            />
          </div>
          <button type="submit" className="hn-btn-primary" style={{ width: '100%', padding: '10px', fontSize: '13px' }}>
            {savedNotice ? 'Tersimpan ✓' : 'Simpan Nama Profil'}
          </button>
        </form>
      </div>

      {/* Data Management Card */}
      <div className="hn-card">
        <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>Manajemen Data</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="hn-btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
            onClick={onOpenBackup}
          >
            <HardDriveDownload size={18} />
            <span>Backup & Restore Data JSON</span>
          </button>

          <button 
            className="hn-btn-outline"
            style={{ width: '100%', padding: '12px', fontSize: '13px', justifyContent: 'flex-start' }}
            onClick={() => setShowResetConfirm(true)}
          >
            <Trash2 size={18} />
            <span>Kosongkan Semua Data Perangkat</span>
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="hn-card" style={{ textAlign: 'center', backgroundColor: '#FFF3DD', border: '2px solid #005BAB', padding: '16px 14px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#005BAB', opacity: 0.8, letterSpacing: '0.5px' }}>
          Dikembangkan oleh
        </div>
        <div style={{ fontSize: '16px', fontWeight: '900', color: '#005BAB', marginTop: '2px' }}>
          Herta Devlabs
        </div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#005BAB', opacity: 0.9, marginTop: '2px' }}>
          Hamdani - Founder
        </div>
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1.5px dashed #005BAB', fontSize: '11px', fontWeight: '800', color: '#005BAB' }}>
          Versi 1.12.0
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content" style={{ textAlign: 'center' }}>
            <AlertTriangle size={42} style={{ color: '#005BAB', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Kosongkan Semua Data?
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '20px' }}>
              Yakin ingin mengosongkan seluruh data kendaraan, patokan, dan catatan hutang dari HP Anda?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="hn-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowResetConfirm(false)}
              >
                Batal
              </button>
              <button 
                type="button"
                className="hn-btn-primary"
                style={{ flex: 1 }}
                onClick={executeResetData}
              >
                Ya, Kosongkan Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
