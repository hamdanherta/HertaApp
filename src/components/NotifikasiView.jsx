import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, Gauge } from 'lucide-react';
import { formatKm } from '../utils/formatters';

export const NotifikasiView = ({ vehicles = [], onNavigate }) => {
  // Oil alerts
  const urgentOilVehicles = (vehicles || []).filter(v => {
    const lastOil = v.lastOilKm || 0;
    const interval = parseInt(v.intervalMesin || 1500, 10);
    const targetKm = lastOil + interval;
    return targetKm > 0;
  });

  const hasNotifications = urgentOilVehicles.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '150px' }}>
      
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={22} />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Notifikasi & Pengingat</h2>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
              Peringatan jadwal ganti oli kendaraan Anda
            </div>
          </div>
        </div>
      </div>

      {!hasNotifications ? (
        <div className="hn-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <CheckCircle2 size={42} style={{ margin: '0 auto 10px', display: 'block' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Semua Aman!</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            Tidak ada peringatan oli mendesak saat ini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {urgentOilVehicles.map(v => {
            const lastOil = v.lastOilKm || 0;
            const interval = parseInt(v.intervalMesin || 1500, 10);
            const targetKm = lastOil + interval;
            return (
              <div key={v.id} className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <ShieldAlert size={24} color="#005BAB" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB' }}>Peringatan Oli Motor/Mobil</div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px', color: '#005BAB' }}>{v.name} ({v.licensePlate || 'BH 6043 OX'})</h4>
                    <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: '600', color: '#005BAB' }}>
                      Ganti Oli Terakhir: KM {formatKm(lastOil)} • Target Selanjutnya: KM {formatKm(targetKm)} (Patokan: {formatKm(interval)})
                    </p>
                    <button 
                      className="hn-btn-primary" 
                      style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => onNavigate('oil')}
                    >
                      Buka Catatan Oli
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
