import React from 'react';
import { Bell, ShieldAlert, CheckCircle2, Gauge, HandCoins } from 'lucide-react';
import { calculateOilStatus, formatKm, formatCurrency } from '../utils/formatters';

export const NotifikasiView = ({ vehicles, debts, onNavigate }) => {
  // Oil alerts
  const urgentOilVehicles = (vehicles || []).map(v => ({
    ...v,
    oilInfo: calculateOilStatus(v.currentKm, v.lastOilKm, v.intervalKm)
  })).filter(v => v.oilInfo.remainingKm <= 300);

  // Due date debt alerts
  const dueDebts = (debts || []).filter(d => d.status !== 'lunas' && d.dueDate);

  const hasNotifications = urgentOilVehicles.length > 0 || dueDebts.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '130px' }}>
      
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={22} />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Notifikasi & Pengingat</h2>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
              Peringatan oli kendaraan & jadwal jatuh tempo hutang
            </div>
          </div>
        </div>
      </div>

      {!hasNotifications ? (
        <div className="hn-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <CheckCircle2 size={42} style={{ margin: '0 auto 10px', display: 'block' }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Semua Aman!</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            Tidak ada peringatan oli mendesak atau tagihan jatuh tempo saat ini.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Oil notifications */}
          {urgentOilVehicles.map(v => (
            <div key={v.id} className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ShieldAlert size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Peringatan Oli Motor/Mobil</div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{v.name}</h4>
                  <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                    {v.oilInfo.remainingKm <= 0 ? 
                      `Oli telah melepasi target kilometer sejauh ${Math.abs(v.oilInfo.remainingKm)} KM. Segera lakukan ganti oli!` : 
                      `Sisa sisa jarak oli tinggal ${v.oilInfo.remainingKm} KM lagi.`
                    }
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
          ))}

          {/* Debt notifications */}
          {dueDebts.map(d => (
            <div key={d.id} className="hn-card">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <HandCoins size={24} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>
                    {d.type === 'piutang' ? 'Jatuh Tempo Piutang (Tagih)' : 'Jatuh Tempo Hutang (Bayar)'}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', marginTop: '2px' }}>{d.personName}</h4>
                  <p style={{ fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>
                    Jatuh tempo pada tanggal <strong>{d.dueDate}</strong>. Nominal: {formatCurrency(d.amount)}
                  </p>
                  <button 
                    className="hn-btn-secondary" 
                    style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => onNavigate('debt')}
                  >
                    Buka Catatan Hutang
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};
