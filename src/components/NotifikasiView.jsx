import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, Gauge, Clock, ArrowRight, Calendar } from 'lucide-react';
import { formatKm, formatDate } from '../utils/formatters';

export const NotifikasiView = ({ vehicles = [], onNavigate }) => {
  // Helper to calculate days since last oil change
  const getDaysSinceLastOil = (dateString) => {
    if (!dateString) return 30; // Default if not recorded yet
    const lastDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Filter vehicles that need oil change alert (either 30+ days OR reached interval target)
  const notificationVehicles = (vehicles || []).map(v => {
    const lastOil = parseInt(v.lastOilKm || 0, 10);
    const interval = parseInt(v.intervalMesin || 1500, 10);
    const targetKm = lastOil + interval;
    const daysElapsed = getDaysSinceLastOil(v.lastOilDate);

    const is30DaysReached = daysElapsed >= 30;
    const isTargetKmReached = targetKm > 0;

    return {
      ...v,
      lastOil,
      interval,
      targetKm,
      daysElapsed,
      isTriggered: is30DaysReached || isTargetKmReached,
      reason: is30DaysReached 
        ? `Pengingat Otomatis 30 Hari (${daysElapsed} hari sejak ganti oli)` 
        : `Mendekati Target KM (${formatKm(targetKm)})`
    };
  }).filter(v => v.isTriggered);

  const hasNotifications = notificationVehicles.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '150px' }}>
      
      {/* Banner Header */}
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '2px solid #005BAB' }}>
            <Bell size={24} color="#005BAB" />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#005BAB' }}>
              Notifikasi & Pengingat
            </h2>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#005BAB', opacity: 0.9, marginTop: '2px' }}>
              Otomatis mengingatkan setiap 30 hari dari ganti oli terakhir
            </div>
          </div>
        </div>
      </div>

      {!hasNotifications ? (
        <div className="hn-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <CheckCircle2 size={42} style={{ margin: '0 auto 10px', display: 'block', color: '#005BAB' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005BAB' }}>Semua Aman!</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px', color: '#005BAB' }}>
            Tidak ada pengingat oli mendesak atau 30 hari saat ini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {notificationVehicles.map(v => {
            const intervalGardan = parseInt(v.intervalGardan || 3000, 10);
            const lastGardanLog = v.history ? v.history.find(h => h.gantiGardan) : null;
            const lastGardanKm = lastGardanLog ? lastGardanLog.km : (v.lastOilKm || 0);
            const nextGardanKm = lastGardanKm + intervalGardan;
            const isGardanNeeded = v.targetKm >= nextGardanKm;

            return (
              <div key={v.id} className="hn-card" style={{ backgroundColor: '#FFF3DD', padding: '18px' }}>
                
                {/* Header: Nama Kendaraan (Left) & Label Harus Oli Gardan Atau Tidak (Right) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#005BAB', margin: 0 }}>
                      🏍️ {v.name} <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.85 }}>({v.licensePlate || 'BH 6043 OX'})</span>
                    </h3>
                  </div>

                  <div style={{
                    backgroundColor: isGardanNeeded ? '#005BAB' : '#FFFFFF',
                    color: isGardanNeeded ? '#FFF3DD' : '#005BAB',
                    border: '2px solid #005BAB',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ⚙️ {isGardanNeeded ? 'Harus Oli Gardan' : 'Hanya Oli Mesin'}
                  </div>
                </div>

                {/* Big KM Numbers Box: KM Ganti Oli Terakhir & KM Ganti Oli Selanjutnya */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr auto 1fr', 
                  alignItems: 'center', 
                  gap: '10px', 
                  marginTop: '14px', 
                  backgroundColor: '#FFFFFF', 
                  padding: '16px 12px', 
                  borderRadius: '20px', 
                  border: '2px solid #005BAB',
                  boxShadow: '2px 2px 0px #005BAB'
                }}>
                  {/* Last Oil KM */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', opacity: 0.8 }}>
                      Oli Terakhir
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#005BAB', marginTop: '2px' }}>
                      {formatKm(v.lastOil)}
                    </div>
                  </div>

                  {/* Arrow Divider */}
                  <div style={{ color: '#005BAB', opacity: 0.6 }}>
                    <ArrowRight size={22} />
                  </div>

                  {/* Next Target KM */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', opacity: 0.8 }}>
                      Target Selanjutnya
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: '900', color: '#005BAB', marginTop: '2px' }}>
                      {formatKm(v.targetKm)}
                    </div>
                  </div>
                </div>

                {/* Action Button: Buka Catatan Ganti Oli */}
                <div style={{ marginTop: '14px' }}>
                  <button 
                    className="hn-btn-primary" 
                    style={{ width: '100%', padding: '12px', fontSize: '14px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => onNavigate('oil')}
                  >
                    <Gauge size={16} /> Buka Catatan Ganti Oli
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
