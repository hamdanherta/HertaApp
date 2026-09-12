import React from 'react';
import { Heart, Gauge, HandCoins, PlusCircle } from 'lucide-react';

export const FavoritView = ({ onNavigate }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '150px' }}>
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Heart size={22} />
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>Catatan Favorit</h2>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
              Daftar catatan & rincian penting yang disukai
            </div>
          </div>
        </div>
      </div>

      <div className="hn-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
        <Heart size={42} style={{ margin: '0 auto 10px', display: 'block' }} />
        <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Belum Ada Catatan Favorit</h3>
        <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px', marginBottom: '16px' }}>
          Tandai kendaraan penting Anda sebagai favorit agar muncul di sini.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            className="hn-btn-outline" 
            style={{ fontSize: '12px', padding: '8px 12px' }}
            onClick={() => onNavigate('oil')}
          >
            <Gauge size={14} /> Ganti Oli
          </button>
        </div>
      </div>
    </div>
  );
};
