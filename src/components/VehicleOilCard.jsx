import React from 'react';
import { Plus, Edit2, Bell, FileText } from 'lucide-react';
import { formatKm, formatDate } from '../utils/formatters';

export const VehicleOilCard = ({ 
  vehicle, 
  onAddOilLog, 
  onEditVehicle, 
  onViewDetail,
  showActions = true 
}) => {
  if (!vehicle) return null;

  const intervalMesin = parseInt(vehicle.intervalMesin || 1500, 10);
  const intervalGardan = parseInt(vehicle.intervalGardan || 3000, 10);

  const lastOilKm = vehicle.lastOilKm || 0;
  const nextMesinKm = lastOilKm + intervalMesin;

  const lastGardanLog = vehicle.history ? vehicle.history.find(h => h.gantiGardan) : null;
  const lastGardanKm = lastGardanLog ? lastGardanLog.km : lastOilKm;
  const nextGardanKm = lastGardanKm + intervalGardan;

  return (
    <div 
      style={{
        backgroundColor: '#FFFFFF',
        border: '3px solid #005BAB',
        borderRadius: '32px',
        padding: '22px 20px',
        boxShadow: '0 8px 24px rgba(0, 91, 171, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      {/* Header: Subtitle (Plat Nomor) & Nama Kendaraan (Dikecilkan) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#005BAB', opacity: 0.9 }}>
            {vehicle.licensePlate || 'BH 6043 OX'}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005BAB', marginTop: '1px', lineHeight: '1.2' }}>
            {vehicle.name}
          </h3>
        </div>
        {onEditVehicle && (
          <button 
            className="hn-btn-icon" 
            onClick={() => onEditVehicle(vehicle)}
            title="Edit Kendaraan & Patokan"
          >
            <Edit2 size={16} />
          </button>
        )}
      </div>

      {/* KM Info Grid (Diperbesar & Menonjol) */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
        {/* Left: Ganti Oli Terakhir */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#005BAB', lineHeight: '1.2' }}>
            Ganti Oli<br />Terakhir
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#005BAB', marginTop: '4px', letterSpacing: '-0.8px', lineHeight: '1' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', marginRight: '3px' }}>KM</span>
            {new Intl.NumberFormat('id-ID').format(lastOilKm)}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#005BAB', opacity: 0.8, marginTop: '4px' }}>
            Tgl: {vehicle.lastOilDate && vehicle.lastOilDate !== '-' ? formatDate(vehicle.lastOilDate) : '-'}
          </div>
        </div>

        {/* Center Connecting Line */}
        <div style={{ flex: 1, height: '4px', backgroundColor: '#005BAB', marginBottom: '22px', borderRadius: '2px' }} />

        {/* Right: Ganti Oli Selanjutnya */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#005BAB', lineHeight: '1.2' }}>
            Ganti Oli<br />Selanjutnya
          </div>
          <div style={{ fontSize: '32px', fontWeight: '900', color: '#005BAB', marginTop: '4px', letterSpacing: '-0.8px', lineHeight: '1' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', marginRight: '3px' }}>KM</span>
            {new Intl.NumberFormat('id-ID').format(nextMesinKm)}
          </div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#005BAB', opacity: 0.8, marginTop: '4px' }}>
            Patokan: {formatKm(intervalMesin)}
          </div>
        </div>
      </div>

      {/* Gardan Alert Line (Peringatan warna Merah dengan Ikon Lonceng) */}
      <div style={{
        backgroundColor: '#FFF3DD',
        padding: '12px 14px',
        borderRadius: '16px',
        border: '2px solid #D32F2F',
        color: '#D32F2F',
        fontSize: '13px',
        fontWeight: '700',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} style={{ color: '#D32F2F' }} />
          <span>Oli Gardan Selanjutnya:</span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '800', color: '#D32F2F' }}>
          KM {new Intl.NumberFormat('id-ID').format(nextGardanKm)}
        </span>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {onAddOilLog && (
            <button 
              className="hn-btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '18px' }}
              onClick={() => onAddOilLog(vehicle)}
            >
              <Plus size={18} /> Tambah Data Ganti Oli
            </button>
          )}

          {onViewDetail && (
            <button 
              className="hn-btn-secondary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '18px' }}
              onClick={() => onViewDetail(vehicle)}
            >
              <FileText size={18} /> Lihat Detail
            </button>
          )}
        </div>
      )}

    </div>
  );
};
