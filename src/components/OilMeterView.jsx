import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, History, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatKm, formatDate } from '../utils/formatters';
import { VehicleOilCard } from './VehicleOilCard';

export const OilMeterView = ({ vehicles = [], onSaveVehicles }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  // Auto select first vehicle if available
  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      if (!selectedVehicleId || !vehicles.find(v => v.id === selectedVehicleId)) {
        setSelectedVehicleId(vehicles[0].id);
      }
    } else {
      setSelectedVehicleId('');
    }
  }, [vehicles]);
  
  // Modals state
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showLogOilModal, setShowLogOilModal] = useState(false);

  // Custom Delete Confirmations Modals state
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [historyToDelete, setHistoryToDelete] = useState(null);

  // Consolidated Vehicle Form (Includes Name, License Plate, and Interval Patokan KM)
  const [vehicleForm, setVehicleForm] = useState({
    id: '',
    name: '',
    licensePlate: '',
    intervalMesin: '1500',
    intervalGardan: '3000'
  });

  const [oilLogForm, setOilLogForm] = useState({
    km: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    brand: '',
    gantiGardan: false
  });

  // Selected vehicle
  const currentVehicle = (vehicles && vehicles.length > 0)
    ? (vehicles.find(v => v.id === selectedVehicleId) || vehicles[0]) 
    : null;

  // --- VEHICLE HANDLERS ---
  const handleOpenAddVehicle = () => {
    if (vehicles.length >= 5) {
      alert('Maksimal 5 kendaraan. Hapus kendaraan terlebih dahulu jika ingin menambah yang baru.');
      return;
    }
    setVehicleForm({
      id: '',
      name: '',
      licensePlate: '',
      intervalMesin: '1500',
      intervalGardan: '3000'
    });
    setShowVehicleModal(true);
  };

  const handleOpenEditVehicle = (veh) => {
    if (!veh) return;
    setVehicleForm({
      id: veh.id,
      name: veh.name || '',
      licensePlate: veh.licensePlate || '',
      intervalMesin: String(veh.intervalMesin || 1500),
      intervalGardan: String(veh.intervalGardan || 3000)
    });
    setShowVehicleModal(true);
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (!vehicleForm.name) return;

    const mesinVal = parseInt(vehicleForm.intervalMesin || 1500, 10);
    const gardanVal = parseInt(vehicleForm.intervalGardan || 3000, 10);

    let updatedList = [];
    if (vehicleForm.id) {
      updatedList = vehicles.map(v => v.id === vehicleForm.id ? {
        ...v,
        name: vehicleForm.name,
        licensePlate: vehicleForm.licensePlate,
        intervalMesin: mesinVal,
        intervalGardan: gardanVal
      } : v);
    } else {
      const newVeh = {
        id: 'v-' + Date.now(),
        name: vehicleForm.name,
        licensePlate: vehicleForm.licensePlate,
        intervalMesin: mesinVal,
        intervalGardan: gardanVal,
        lastOilKm: 0,
        lastOilDate: '-',
        history: []
      };
      updatedList = [...vehicles, newVeh];
      setSelectedVehicleId(newVeh.id);
    }

    onSaveVehicles(updatedList);
    setShowVehicleModal(false);
  };

  const executeDeleteVehicle = () => {
    if (!vehicleToDelete) return;
    const targetId = vehicleToDelete.id;
    const updated = (vehicles || []).filter(v => v.id !== targetId);
    onSaveVehicles(updated);
    if (updated.length > 0) {
      setSelectedVehicleId(updated[0].id);
    } else {
      setSelectedVehicleId('');
    }
    setVehicleToDelete(null);
    setShowVehicleModal(false);
  };

  // --- OIL LOG HANDLERS ---
  const handleOpenLogOil = (targetVeh) => {
    const veh = targetVeh || currentVehicle;
    if (!veh) {
      alert('Silakan tambah kendaraan terlebih dahulu.');
      return;
    }
    setOilLogForm({
      id: null,
      km: veh.lastOilKm ? String(veh.lastOilKm) : '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      brand: '',
      gantiGardan: false
    });
    setShowLogOilModal(true);
  };

  const handleOpenEditLogOil = (log) => {
    setOilLogForm({
      id: log.id,
      km: log.km ? String(log.km) : '',
      date: log.date || new Date().toISOString().split('T')[0],
      cost: log.cost ? String(log.cost) : '',
      brand: log.brand || '',
      gantiGardan: !!log.gantiGardan
    });
    setShowLogOilModal(true);
  };

  const handleSaveOilLog = (e) => {
    e.preventDefault();
    if (!currentVehicle) return;
    const logKm = parseInt(oilLogForm.km || 0, 10);
    
    let updatedHistory = currentVehicle.history ? [...currentVehicle.history] : [];

    if (oilLogForm.id) {
      updatedHistory = updatedHistory.map(h => {
        if (h.id === oilLogForm.id) {
          return {
            ...h,
            date: oilLogForm.date,
            km: logKm,
            cost: parseInt(oilLogForm.cost || 0, 10),
            brand: oilLogForm.brand,
            gantiGardan: oilLogForm.gantiGardan
          };
        }
        return h;
      });
    } else {
      const newHistoryItem = {
        id: 'h-' + Date.now(),
        date: oilLogForm.date,
        km: logKm,
        cost: parseInt(oilLogForm.cost || 0, 10),
        brand: oilLogForm.brand,
        gantiGardan: oilLogForm.gantiGardan
      };
      updatedHistory = [newHistoryItem, ...updatedHistory].slice(0, 5);
    }

    const newestLog = updatedHistory[0];

    const updatedVehicles = vehicles.map(v => {
      if (v.id === currentVehicle.id) {
        return {
          ...v,
          lastOilKm: newestLog ? newestLog.km : v.lastOilKm,
          lastOilDate: newestLog ? newestLog.date : v.lastOilDate,
          history: updatedHistory
        };
      }
      return v;
    });

    onSaveVehicles(updatedVehicles);
    setShowLogOilModal(false);
  };

  const executeDeleteHistoryItem = () => {
    if (!historyToDelete || !currentVehicle) return;
    const updatedHistory = (currentVehicle.history || []).filter(h => h.id !== historyToDelete.id);
    const newestLog = updatedHistory[0];

    const updatedVehicles = vehicles.map(v => {
      if (v.id === currentVehicle.id) {
        return {
          ...v,
          lastOilKm: newestLog ? newestLog.km : 0,
          lastOilDate: newestLog ? newestLog.date : '-',
          history: updatedHistory
        };
      }
      return v;
    });
    onSaveVehicles(updatedVehicles);
    setHistoryToDelete(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '130px' }}>

      {/* --- DATA KENDARAAN SELECTOR --- */}
      <div className="hn-card" style={{ borderRadius: '24px', backgroundColor: '#FFFFFF', border: '2px solid #005BAB' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="hn-label">Data Kendaraan Saya ({vehicles.length}/5)</span>
          {vehicles.length < 5 && (
            <button 
              className="hn-btn-secondary" 
              style={{ padding: '8px 14px', fontSize: '13px', fontWeight: '800' }}
              onClick={handleOpenAddVehicle}
            >
              <Plus size={16} /> Tambah Kendaraan
            </button>
          )}
        </div>

        {vehicles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ fontSize: '13px', color: '#005BAB', opacity: 0.9, marginBottom: '12px' }}>
              Belum ada data kendaraan. Tambahkan kendaraan untuk mencatat ganti oli & patokan KM.
            </p>
            <button 
              className="hn-btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              onClick={handleOpenAddVehicle}
            >
              <Plus size={16} /> Tambah Kendaraan Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <select 
                className="hn-select"
                value={selectedVehicleId || (currentVehicle ? currentVehicle.id : '')}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                style={{ fontWeight: '800', fontSize: '15px' }}
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} {v.licensePlate ? `(${v.licensePlate})` : ''}
                  </option>
                ))}
              </select>
            </div>
            {currentVehicle && (
              <>
                <button 
                  className="hn-btn-icon" 
                  onClick={() => handleOpenEditVehicle(currentVehicle)}
                  title="Edit Kendaraan & Patokan"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="hn-btn-icon" 
                  onClick={() => setVehicleToDelete(currentVehicle)}
                  title="Hapus Kendaraan"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* --- KARTU KENDARAAN (FRAME 264 MOCKUP) --- */}
      {currentVehicle && (
        <VehicleOilCard 
          vehicle={currentVehicle}
          onAddOilLog={handleOpenLogOil}
          onEditVehicle={handleOpenEditVehicle}
          showActions={true}
        />
      )}

      {/* --- RIWAYAT GANTI OLI --- */}
      {currentVehicle && (
        <div className="hn-card" style={{ borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <History size={18} />
            <h3 style={{ fontSize: '16px', fontWeight: '800' }}>
              Riwayat Ganti Oli ({currentVehicle.history?.length || 0})
            </h3>
          </div>

          {(!currentVehicle.history || currentVehicle.history.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '20px 0', opacity: 0.8, fontSize: '13px' }}>
              Belum ada riwayat ganti oli. Klik "+ Tambah Data Ganti Oli" di atas untuk mencatat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentVehicle.history.map((log) => (
                <div 
                  key={log.id}
                  style={{
                    backgroundColor: '#FFF3DD',
                    border: '2px solid #005BAB',
                    borderRadius: '20px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '2px 2px 0px #005BAB'
                  }}
                >
                  {/* Top Row: Left (Vehicle Badge: 2 lines with Plat below), Right (Date Pill & Actions) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    {/* Left: Vehicle Badge (Nama di atas, No Plat neter ke bawah) */}
                    <div style={{
                      backgroundColor: '#005BAB',
                      color: '#FFF3DD',
                      padding: '8px 14px',
                      borderRadius: '16px',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      gap: '2px'
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🏍️ {currentVehicle.name}
                      </div>
                      {currentVehicle.licensePlate && (
                        <div style={{ fontSize: '11px', fontWeight: '700', opacity: 0.9 }}>
                          ({currentVehicle.licensePlate})
                        </div>
                      )}
                    </div>

                    {/* Right: Date Badge (Equal Size & Prominence) + Edit & Hapus Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        backgroundColor: '#005BAB',
                        color: '#FFF3DD',
                        fontSize: '12px',
                        fontWeight: '800',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}>
                        {formatDate(log.date)}
                      </span>

                      <button 
                        onClick={() => handleOpenEditLogOil(log)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #005BAB',
                          borderRadius: '10px',
                          padding: '5px 10px',
                          color: '#005BAB',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                        title="Edit Catatan"
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      <button 
                        onClick={() => setHistoryToDelete(log)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #005BAB',
                          borderRadius: '10px',
                          padding: '5px 10px',
                          color: '#005BAB',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                        title="Hapus Catatan"
                      >
                        <Trash2 size={13} /> Hapus
                      </button>
                    </div>
                  </div>

                  {/* Middle Row: Odometer Saat Ganti Oli & Gardan Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '2px 0' }}>
                    <div>
                      <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: '700', textTransform: 'uppercase', color: '#005BAB', letterSpacing: '0.5px' }}>
                        Odometer Saat Ganti Oli
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: '900', color: '#005BAB', marginTop: '4px', letterSpacing: '-0.5px' }}>
                        {formatKm(log.km)}
                      </div>
                    </div>

                    {log.gantiGardan && (
                      <span style={{
                        backgroundColor: '#005BAB',
                        color: '#FFF3DD',
                        fontSize: '12px',
                        fontWeight: '800',
                        padding: '7px 14px',
                        borderRadius: '12px'
                      }}>
                        + Oli Gardan
                      </span>
                    )}
                  </div>

                  {/* Bottom Row: Detail Merk Oli & Biaya */}
                  <div style={{
                    borderTop: '1.5px dashed #005BAB',
                    paddingTop: '12px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#005BAB',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <span style={{ opacity: 0.8 }}>Merk Oli: </span>
                      <span style={{ fontWeight: '800' }}>{log.brand || 'Oli Mesin'}</span>
                    </div>
                    <div>
                      <span style={{ opacity: 0.8 }}>Biaya: </span>
                      <span style={{ fontWeight: '800' }}>{log.cost ? formatCurrency(log.cost) : '-'}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- MODAL: TAMBAH / EDIT KENDARAAN (DENGAN INPUT PATOKAN OLI MESIN & GARDAN) --- */}
      {showVehicleModal && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              {vehicleForm.id ? 'Edit Kendaraan & Patokan' : 'Tambah Kendaraan & Patokan'}
            </h3>
            <form onSubmit={handleSaveVehicle}>
              <div className="hn-input-group">
                <label className="hn-label">Nama Kendaraan</label>
                <input 
                  type="text" 
                  className="hn-input"
                  placeholder="Contoh: Scoopy Keong"
                  value={vehicleForm.name}
                  onChange={e => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                  autoFocus
                  required
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">No Plat</label>
                <input 
                  type="text" 
                  className="hn-input"
                  placeholder="Contoh: BH 6043 OX"
                  value={vehicleForm.licensePlate}
                  onChange={e => setVehicleForm({ ...vehicleForm, licensePlate: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="hn-input-group">
                  <label className="hn-label">Patokan KM Oli Mesin</label>
                  <input 
                    type="number" 
                    className="hn-input"
                    placeholder="1500"
                    value={vehicleForm.intervalMesin}
                    onChange={e => setVehicleForm({ ...vehicleForm, intervalMesin: e.target.value })}
                    required
                  />
                </div>

                <div className="hn-input-group">
                  <label className="hn-label">Patokan KM Oli Gardan</label>
                  <input 
                    type="number" 
                    className="hn-input"
                    placeholder="3000"
                    value={vehicleForm.intervalGardan}
                    onChange={e => setVehicleForm({ ...vehicleForm, intervalGardan: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {vehicleForm.id && (
                  <button 
                    type="button"
                    className="hn-btn-outline"
                    onClick={() => {
                      const v = vehicles.find(item => item.id === vehicleForm.id);
                      if (v) setVehicleToDelete(v);
                    }}
                    style={{ padding: '12px' }}
                    title="Hapus Kendaraan"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button 
                  type="button"
                  className="hn-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowVehicleModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="hn-btn-primary" style={{ flex: 1 }}>
                  Simpan Kendaraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: TAMBAH DATA GANTI OLI --- */}
      {showLogOilModal && currentVehicle && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              {oilLogForm.id ? 'Edit Catatan Ganti Oli' : 'Tambah Data Ganti Oli'} ({currentVehicle.name})
            </h3>
            <form onSubmit={handleSaveOilLog}>
              <div className="hn-input-group">
                <label className="hn-label">KM Sekarang (Odometer saat ini)</label>
                <input 
                  type="number" 
                  className="hn-input"
                  style={{ fontSize: '18px', fontWeight: '800' }}
                  placeholder="Contoh: 23000"
                  value={oilLogForm.km}
                  onChange={e => setOilLogForm({ ...oilLogForm, km: e.target.value })}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="hn-input-group">
                  <label className="hn-label">Tanggal</label>
                  <input 
                    type="date" 
                    className="hn-input"
                    value={oilLogForm.date}
                    onChange={e => setOilLogForm({ ...oilLogForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="hn-input-group">
                  <label className="hn-label">Harga (Rp)</label>
                  <input 
                    type="number" 
                    className="hn-input"
                    placeholder="65000"
                    value={oilLogForm.cost}
                    onChange={e => setOilLogForm({ ...oilLogForm, cost: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Oli Apa (Merk / Tipe Oli)</label>
                <input 
                  type="text" 
                  className="hn-input"
                  placeholder="Shell Advance / Yamalube / MPX"
                  value={oilLogForm.brand}
                  onChange={e => setOilLogForm({ ...oilLogForm, brand: e.target.value })}
                  required
                />
              </div>

              {/* Checkbox Sekalian Gardan */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#FFF3DD',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid #005BAB',
                  marginTop: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => setOilLogForm({ ...oilLogForm, gantiGardan: !oilLogForm.gantiGardan })}
              >
                {oilLogForm.gantiGardan ? <CheckSquare size={20} color="#005BAB" /> : <Square size={20} color="#005BAB" />}
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#005BAB' }}>
                  Ceklis Sekalian Oli Gardan
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="hn-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setShowLogOilModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="hn-btn-primary" style={{ flex: 1 }}>
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL: HAPUS KENDARAAN --- */}
      {vehicleToDelete && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content" style={{ textAlign: 'center' }}>
            <AlertTriangle size={42} style={{ color: '#005BAB', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Hapus Kendaraan?
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '20px' }}>
              Yakin ingin menghapus kendaraan <strong>{vehicleToDelete.name}</strong> ({vehicleToDelete.licensePlate})? Seluruh riwayat ganti oli kendaraan ini akan terhapus.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="hn-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setVehicleToDelete(null)}
              >
                Batal
              </button>
              <button 
                type="button"
                className="hn-btn-primary"
                style={{ flex: 1 }}
                onClick={executeDeleteVehicle}
              >
                Ya, Hapus Kendaraan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL: HAPUS ITEM RIWAYAT --- */}
      {historyToDelete && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content" style={{ textAlign: 'center' }}>
            <AlertTriangle size={42} style={{ color: '#005BAB', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Hapus Catatan Riwayat?
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '20px' }}>
              Yakin ingin menghapus catatan ganti oli pada KM {historyToDelete.km}?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="hn-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setHistoryToDelete(null)}
              >
                Batal
              </button>
              <button 
                type="button"
                className="hn-btn-primary"
                style={{ flex: 1 }}
                onClick={executeDeleteHistoryItem}
              >
                Ya, Hapus Catatan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
