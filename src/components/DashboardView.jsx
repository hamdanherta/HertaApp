import React, { useState } from 'react';
import { Gauge, Plus, CheckSquare, Square, Briefcase, ChevronRight, TrendingUp } from 'lucide-react';
import { VehicleOilCard } from './VehicleOilCard';

export const DashboardView = ({ vehicles = [], onSaveVehicles, applications = [], settings = {}, setActiveTab }) => {
  // Modal for adding oil log directly from Beranda
  const [showLogOilModal, setShowLogOilModal] = useState(false);
  const [targetVehicle, setTargetVehicle] = useState(null);
  
  const [oilLogForm, setOilLogForm] = useState({
    km: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    brand: '',
    gantiGardan: false
  });

  const handleOpenAddLog = (veh) => {
    if (!veh) return;
    setTargetVehicle(veh);
    setOilLogForm({
      km: veh.lastOilKm ? String(veh.lastOilKm) : '',
      date: new Date().toISOString().split('T')[0],
      cost: '',
      brand: '',
      gantiGardan: false
    });
    setShowLogOilModal(true);
  };

  const handleSaveOilLog = (e) => {
    e.preventDefault();
    if (!targetVehicle || !onSaveVehicles) return;
    const logKm = parseInt(oilLogForm.km || 0, 10);
    
    const newHistoryItem = {
      id: 'h-' + Date.now(),
      date: oilLogForm.date,
      km: logKm,
      cost: parseInt(oilLogForm.cost || 0, 10),
      brand: oilLogForm.brand,
      gantiGardan: oilLogForm.gantiGardan
    };

    const updatedVehicles = vehicles.map(v => {
      if (v.id === targetVehicle.id) {
        return {
          ...v,
          lastOilKm: logKm,
          lastOilDate: oilLogForm.date,
          history: [newHistoryItem, ...(v.history || [])].slice(0, 5)
        };
      }
      return v;
    });

    onSaveVehicles(updatedVehicles);
    setShowLogOilModal(false);
  };

  const totalApps = applications.length;
  const interviewApps = applications.filter(a => a.status === 'Interview' || a.status === 'Tes' || a.status === 'Diterima').length;
  const responseRate = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;

  // Platform distribution
  const platformCounts = applications.reduce((acc, app) => {
    const key = app.platform || 'Lainnya';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '150px' }}>
      
      {/* Overview Greeting with Dynamic Owner Name */}
      <div className="hn-card-brand">
        <div style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>
          Halo, {settings?.ownerName || 'Pengguna Herta App'} 👋
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>
          Herta App
        </h2>
        <p style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px' }}>
          All in App 
        </p>
      </div>

      {/* --- FITUR UTAMA 2: KARTU STATISTIK & DIAGRAM LAMARAN KERJA --- */}
      <div>
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#005BAB' }}>
            FITUR UTAMA 2: CATATAN LAMARAN KERJA
          </h3>
        </div>

        <div className="hn-card">
          {/* Header Card */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', backgroundColor: '#FFF3DD', borderRadius: '12px', border: '2px solid #005BAB' }}>
                <Briefcase size={22} color="#005BAB" />
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#005BAB' }}>
                  Statistik & Diagram Lamaran
                </h4>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#005BAB', opacity: 0.85 }}>
                  Ringkasan aktivitas pencarian kerja
                </div>
              </div>
            </div>

            <button 
              className="hn-btn-primary"
              style={{ fontSize: '12px', padding: '8px 12px' }}
              onClick={() => setActiveTab('job')}
            >
              Buka Tracker <ChevronRight size={16} />
            </button>
          </div>

          {/* Stat Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{totalApps}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Lamaran</div>
            </div>
            <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{interviewApps}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Respons</div>
            </div>
            <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{responseRate}%</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Rate Panggilan</div>
            </div>
          </div>

          {/* Platform Distribution Bar Diagram */}
          {totalApps > 0 ? (
            <div style={{ backgroundColor: '#FFF3DD', padding: '14px', borderRadius: '14px', border: '1.5px solid #005BAB' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', color: '#005BAB' }}>
                📊 Distribusi Sumber Lowongan
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(platformCounts).map(([platform, count]) => {
                  const percent = Math.round((count / totalApps) * 100);
                  return (
                    <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#005BAB' }}>
                        <span>{platform} ({count})</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="hn-progress-track" style={{ height: '8px' }}>
                        <div className="hn-progress-fill" style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#FFF3DD', 
              padding: '14px', 
              borderRadius: '14px', 
              border: '1.5px dashed #005BAB',
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: '600',
              color: '#005BAB'
            }}>
              Belum ada data lamaran. Klik <strong>Buka Tracker</strong> untuk mencatat lamaran pertama Anda.
            </div>
          )}
        </div>
      </div>

      {/* --- FITUR UTAMA 1: KARTU GANTI OLI --- */}
      <div>
        <div style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#005BAB' }}>
            FITUR UTAMA 1: KARTU GANTI OLI
          </h3>
        </div>

        {(!vehicles || vehicles.length === 0) ? (
          <div className="hn-card" style={{ textAlign: 'center', padding: '24px 16px', borderRadius: '24px' }}>
            <Gauge size={36} style={{ margin: '0 auto 8px', display: 'block', color: '#005BAB' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005BAB' }}>Ganti Oli Meter</h3>
            <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px', marginBottom: '14px', color: '#005BAB' }}>
              Belum ada kendaraan. Tambahkan kendaraan untuk mencatat ganti oli.
            </p>
            <button 
              className="hn-btn-primary" 
              style={{ width: '100%', padding: '10px' }}
              onClick={() => setActiveTab('oil')}
            >
              <Plus size={16} /> Tambah Kendaraan Pertama
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {vehicles.map((v) => (
              <VehicleOilCard 
                key={v.id}
                vehicle={v}
                onAddOilLog={(veh) => handleOpenAddLog(veh)}
                onViewDetail={() => setActiveTab('oil')}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL: TAMBAH DATA GANTI OLI (LANGSUNG DARI BERANDA) --- */}
      {showLogOilModal && targetVehicle && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px' }}>
              Tambah Data Ganti Oli ({targetVehicle.name})
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

    </div>
  );
};
