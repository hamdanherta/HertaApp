import React, { useState } from 'react';
import { HardDriveDownload, Download, Upload, RefreshCw, ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { exportDataJSON, importDataJSON } from '../utils/storage';

export const BackupModal = ({ isOpen, onClose, onRefreshData, settings, onSaveSettings }) => {
  const [importStatus, setImportStatus] = useState(null);
  const [dailyKmInput, setDailyKmInput] = useState(settings?.dailyKmEstimate || 35);

  if (!isOpen) return null;

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `herta_app_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportStatus({ success: true, message: 'File backup JSON berhasil didownload!' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importDataJSON(event.target.result);
      setImportStatus(result);
      if (result.success) {
        onRefreshData();
      }
    };
    reader.readAsText(file);
  };

  const handleSaveDailyKm = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      dailyKmEstimate: parseInt(dailyKmInput || 30, 10)
    });
    setImportStatus({ success: true, message: 'Pengaturan estimasi KM harian disimpan!' });
  };

  return (
    <div className="hn-modal-overlay">
      <div className="hn-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDriveDownload size={22} />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Backup & Pengaturan</h3>
          </div>
          <button 
            onClick={onClose}
            className="hn-btn-icon" 
            style={{ width: '32px', height: '32px', border: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        {importStatus && (
          <div style={{
            backgroundColor: importStatus.success ? '#FFF3DD' : '#FFFFFF',
            border: '2px solid #005BAB',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{importStatus.message}</span>
          </div>
        )}

        {/* Backup Export */}
        <div className="hn-card" style={{ marginBottom: '14px', padding: '14px' }}>
          <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>
            1. Ekspor Backup Data (JSON)
          </div>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '10px' }}>
            Simpan file cadangan semua kendaraan, KM oli, dan catatan hutang ke memori HP.
          </p>
          <button 
            className="hn-btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '13px' }}
            onClick={handleDownloadBackup}
          >
            <Download size={16} /> Download File Backup JSON
          </button>
        </div>

        {/* Backup Import */}
        <div className="hn-card" style={{ marginBottom: '14px', padding: '14px' }}>
          <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>
            2. Pulihkan / Impor Data
          </div>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '10px' }}>
            Upload file `.json` cadangan Herta App untuk mengembalikan data sebelumnya.
          </p>
          <label className="hn-btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Pilih File Backup JSON</span>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>

        {/* Daily KM Estimation Setting */}
        <div className="hn-card" style={{ padding: '14px' }}>
          <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '4px' }}>
            3. Estimasi KM Harian
          </div>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '10px' }}>
            Perkiraan jarak tempuh harian (KM/hari) untuk menghitung sisa waktu ganti oli.
          </p>
          <form onSubmit={handleSaveDailyKm} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="number"
              className="hn-input"
              style={{ flex: 1, padding: '8px 12px' }}
              value={dailyKmInput}
              onChange={e => setDailyKmInput(e.target.value)}
              placeholder="35"
              required
            />
            <button type="submit" className="hn-btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>
              Simpan
            </button>
          </form>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            className="hn-btn-outline"
            style={{ width: '100%', padding: '12px' }}
            onClick={onClose}
          >
            Tutup Modal
          </button>
        </div>

      </div>
    </div>
  );
};
