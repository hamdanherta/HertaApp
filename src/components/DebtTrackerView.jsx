import React, { useState } from 'react';
import { HandCoins, Plus, Search, Filter, Share2, CheckCircle2, Clock, Trash2, Edit3, ArrowDownLeft, ArrowUpRight, DollarSign, Calendar, Copy, Check } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const DebtTrackerView = ({ debts, onSaveDebts, autoOpenAddModal = false }) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'piutang', 'hutang'
  const [filterStatus, setFilterStatus] = useState('active'); // 'active', 'lunas', 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(autoOpenAddModal);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form states
  const [debtForm, setDebtForm] = useState({
    id: '',
    type: 'piutang',
    personName: '',
    amount: '',
    description: '',
    itemType: 'uang',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'belum_lunas'
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Filtered List
  const filteredDebts = debts.filter(item => {
    // Search query
    const matchSearch = item.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchType = filterType === 'all' || item.type === filterType;

    // Status filter
    let matchStatus = true;
    if (filterStatus === 'active') matchStatus = item.status !== 'lunas';
    else if (filterStatus === 'lunas') matchStatus = item.status === 'lunas';

    return matchSearch && matchType && matchStatus;
  });

  // Calculations
  const totalPiutangActive = debts
    .filter(d => d.type === 'piutang' && d.status !== 'lunas')
    .reduce((sum, d) => {
      const paid = (d.payments || []).reduce((pS, p) => pS + (p.amount || 0), 0);
      return sum + (d.amount - paid);
    }, 0);

  const totalHutangActive = debts
    .filter(d => d.type === 'hutang' && d.status !== 'lunas')
    .reduce((sum, d) => {
      const paid = (d.payments || []).reduce((pS, p) => pS + (p.amount || 0), 0);
      return sum + (d.amount - paid);
    }, 0);

  // Handlers
  const handleOpenAdd = (type = 'piutang') => {
    setDebtForm({
      id: '',
      type,
      personName: '',
      amount: '',
      description: '',
      itemType: 'uang',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'belum_lunas'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setDebtForm({
      id: item.id,
      type: item.type,
      personName: item.personName,
      amount: item.amount,
      description: item.description || '',
      itemType: item.itemType || 'uang',
      date: item.date || new Date().toISOString().split('T')[0],
      dueDate: item.dueDate || '',
      status: item.status || 'belum_lunas'
    });
    setShowAddModal(true);
  };

  const handleSaveDebt = (e) => {
    e.preventDefault();
    if (!debtForm.personName) return;

    const amountVal = debtForm.itemType === 'barang' ? 0 : parseInt(debtForm.amount || 0, 10);

    let updated = [];
    if (debtForm.id) {
      updated = debts.map(d => d.id === debtForm.id ? {
        ...d,
        type: debtForm.type,
        personName: debtForm.personName,
        amount: amountVal,
        description: debtForm.description,
        itemType: debtForm.itemType,
        date: debtForm.date,
        dueDate: debtForm.dueDate,
        status: debtForm.status
      } : d);
    } else {
      const newDebt = {
        id: 'd-' + Date.now(),
        type: debtForm.type,
        personName: debtForm.personName,
        amount: amountVal,
        description: debtForm.description,
        itemType: debtForm.itemType,
        date: debtForm.date,
        dueDate: debtForm.dueDate,
        status: 'belum_lunas',
        payments: []
      };
      updated = [newDebt, ...debts];
    }

    onSaveDebts(updated);
    setShowAddModal(false);
  };

  const [debtToDelete, setDebtToDelete] = useState(null);

  const executeDeleteDebt = () => {
    if (!debtToDelete) return;
    const updated = debts.filter(d => d.id !== debtToDelete.id);
    onSaveDebts(updated);
    setDebtToDelete(null);
    setShowAddModal(false);
  };

  const handleOpenPayment = (item) => {
    setSelectedDebtForPayment(item);
    const paid = (item.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
    const remaining = item.amount - paid;
    setPaymentForm({
      amount: remaining > 0 ? remaining : '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!selectedDebtForPayment) return;

    const paymentAmt = parseInt(paymentForm.amount || 0, 10);
    const newPayment = {
      id: 'p-' + Date.now(),
      date: paymentForm.date,
      amount: paymentAmt,
      notes: paymentForm.notes
    };

    const updated = debts.map(d => {
      if (d.id === selectedDebtForPayment.id) {
        const currentPayments = [...(d.payments || []), newPayment];
        const totalPaid = currentPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        
        let newStatus = d.status;
        if (d.itemType === 'uang' && totalPaid >= d.amount) {
          newStatus = 'lunas';
        } else if (totalPaid > 0) {
          newStatus = 'cicilan';
        }

        return {
          ...d,
          status: newStatus,
          payments: currentPayments
        };
      }
      return d;
    });

    onSaveDebts(updated);
    setShowPaymentModal(false);
  };

  const handleToggleLunasDirect = (item) => {
    const nextStatus = item.status === 'lunas' ? 'belum_lunas' : 'lunas';
    const updated = debts.map(d => d.id === item.id ? { ...d, status: nextStatus } : d);
    onSaveDebts(updated);
  };

  const handleShareWhatsApp = (item) => {
    const paid = (item.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
    const remaining = item.amount - paid;
    const isPiutang = item.type === 'piutang';

    let text = `*Catatan Herta App - ${isPiutang ? 'Pengingat Piutang' : 'Catatan Hutang'}*\n`;
    text += `Nama: *${item.personName}*\n`;
    text += `Deskripsi: ${item.description || '-'}\n`;
    if (item.itemType === 'uang') {
      text += `Total Nominal: ${formatCurrency(item.amount)}\n`;
      if (paid > 0) text += `Sudah Dicicil: ${formatCurrency(paid)}\n`;
      text += `Sisa Tagihan: *${formatCurrency(remaining)}*\n`;
    } else {
      text += `Bentuk: Barang (${item.description})\n`;
    }
    if (item.dueDate) text += `Jatuh Tempo: ${formatDate(item.dueDate)}\n`;
    text += `Status: ${item.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}\n`;
    text += `\n_Dicatat menggunakan Herta App_`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '130px' }}>

      {/* Top Financial Header Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="hn-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <ArrowDownLeft size={16} />
            <span style={{ fontSize: '12px', fontWeight: '800' }}>Piutang (Tagihan)</span>
          </div>
          <div style={{ fontSize: '17px', fontWeight: '800' }}>
            {formatCurrency(totalPiutangActive)}
          </div>
          <button 
            className="hn-btn-primary" 
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '11px' }}
            onClick={() => handleOpenAdd('piutang')}
          >
            <Plus size={14} /> Tagihan Baru
          </button>
        </div>

        <div className="hn-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <ArrowUpRight size={16} />
            <span style={{ fontSize: '12px', fontWeight: '800' }}>Hutang Saya</span>
          </div>
          <div style={{ fontSize: '17px', fontWeight: '800' }}>
            {formatCurrency(totalHutangActive)}
          </div>
          <button 
            className="hn-btn-secondary" 
            style={{ width: '100%', marginTop: '8px', padding: '6px', fontSize: '11px' }}
            onClick={() => handleOpenAdd('hutang')}
          >
            <Plus size={14} /> Hutang Baru
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD', padding: '14px' }}>
        <div className="hn-input-group" style={{ marginBottom: '10px' }}>
          <input 
            type="text"
            className="hn-input"
            placeholder="Cari nama atau deskripsi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div className="hn-tab-container" style={{ flex: 1 }}>
            <button 
              className={`hn-tab-item ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Semua
            </button>
            <button 
              className={`hn-tab-item ${filterType === 'piutang' ? 'active' : ''}`}
              onClick={() => setFilterType('piutang')}
            >
              Piutang
            </button>
            <button 
              className={`hn-tab-item ${filterType === 'hutang' ? 'active' : ''}`}
              onClick={() => setFilterType('hutang')}
            >
              Hutang
            </button>
          </div>

          <select 
            className="hn-select"
            style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="active">Belum Lunas</option>
            <option value="lunas">Sudah Lunas</option>
            <option value="all">Semua Status</option>
          </select>
        </div>
      </div>

      {/* Debt List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredDebts.length === 0 ? (
          <div className="hn-card" style={{ textAlign: 'center', padding: '30px 16px', opacity: 0.8 }}>
            <HandCoins size={36} style={{ margin: '0 auto 10px', display: 'block' }} />
            <div style={{ fontWeight: '800', fontSize: '15px' }}>Tidak Ada Catatan</div>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Klik tombol "+ Tagihan Baru" atau "+ Hutang Baru" untuk menambahkan catatan.
            </p>
          </div>
        ) : (
          filteredDebts.map(item => {
            const isPiutang = item.type === 'piutang';
            const paid = (item.payments || []).reduce((s, p) => s + (p.amount || 0), 0);
            const remaining = item.amount - paid;
            const isLunas = item.status === 'lunas';

            return (
              <div key={item.id} className="hn-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="hn-badge-solid" style={{ fontSize: '10px' }}>
                        {isPiutang ? 'Piutang (Tagih)' : 'Hutang (Bayar)'}
                      </span>
                      {item.itemType === 'barang' && (
                        <span className="hn-badge-cream" style={{ fontSize: '10px' }}>Barang</span>
                      )}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>
                      {item.personName}
                    </h3>
                  </div>

                  <button 
                    onClick={() => handleToggleLunasDirect(item)}
                    className={isLunas ? 'hn-badge-solid' : 'hn-badge-cream'}
                    style={{ cursor: 'pointer', border: '1.5px solid #005BAB' }}
                    title="Klik untuk ubah status lunas"
                  >
                    {isLunas ? 'LUNAS ✓' : item.status === 'cicilan' ? 'DICICIL' : 'BELUM LUNAS'}
                  </button>
                </div>

                {/* Amount / Item Description */}
                <div style={{ 
                  backgroundColor: '#FFF3DD',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #005BAB',
                  margin: '10px 0'
                }}>
                  {item.itemType === 'barang' ? (
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.8 }}>DESKRIPSI BARANG</div>
                      <div style={{ fontSize: '15px', fontWeight: '800', marginTop: '2px' }}>{item.description || 'Pinjam Barang'}</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.8 }}>SISA TAGIHAN</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', marginTop: '2px' }}>
                          {formatCurrency(remaining > 0 ? remaining : item.amount)}
                        </div>
                      </div>
                      {paid > 0 && (
                        <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: '700' }}>
                          <div>Total: {formatCurrency(item.amount)}</div>
                          <div>Dicicil: {formatCurrency(paid)}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {item.description && item.itemType === 'uang' && (
                    <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '6px', fontStyle: 'italic' }}>
                      "{item.description}"
                    </div>
                  )}
                </div>

                {/* Dates & Due Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
                  <span>Pinjam: {formatDate(item.date)}</span>
                  {item.dueDate ? (
                    <span style={{ fontWeight: '800' }}>Jatuh Tempo: {formatDate(item.dueDate)}</span>
                  ) : (
                    <span>Tanpa Jatuh Tempo</span>
                  )}
                </div>

                {/* Payments History log summary if any */}
                {item.payments && item.payments.length > 0 && (
                  <div style={{ borderTop: '1px dashed #005BAB', paddingTop: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>Riwayat Pembayaran Cicilan:</div>
                    {item.payments.map((p, idx) => (
                      <div key={p.id || idx} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>• {formatDate(p.date)} {p.notes ? `(${p.notes})` : ''}</span>
                        <span style={{ fontWeight: '800' }}>+{formatCurrency(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions Footer */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="hn-btn-outline" 
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleOpenEdit(item)}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      className="hn-btn-outline" 
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleDeleteDebt(item.id)}
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="hn-btn-secondary" 
                      style={{ padding: '6px 10px', fontSize: '12px' }}
                      onClick={() => handleShareWhatsApp(item)}
                      title="Salin teks pengingat WhatsApp"
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Share2 size={14} />}
                      <span>{copiedId === item.id ? 'Tersalin' : 'Share'}</span>
                    </button>

                    {!isLunas && item.itemType === 'uang' && (
                      <button 
                        className="hn-btn-primary" 
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => handleOpenPayment(item)}
                      >
                        + Cicilan
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Add / Edit Debt Modal */}
      {showAddModal && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>
              {debtForm.id ? 'Edit Catatan' : 'Tambah Catatan Baru'}
            </h3>

            <form onSubmit={handleSaveDebt}>
              <div className="hn-input-group">
                <label className="hn-label">Kategori Catatan</label>
                <div className="hn-tab-container">
                  <button 
                    type="button"
                    className={`hn-tab-item ${debtForm.type === 'piutang' ? 'active' : ''}`}
                    onClick={() => setDebtForm({ ...debtForm, type: 'piutang' })}
                  >
                    Piutang (Orang Utang ke Saya)
                  </button>
                  <button 
                    type="button"
                    className={`hn-tab-item ${debtForm.type === 'hutang' ? 'active' : ''}`}
                    onClick={() => setDebtForm({ ...debtForm, type: 'hutang' })}
                  >
                    Hutang (Saya Utang ke Orang)
                  </button>
                </div>
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Nama Orang / Pihak</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Contoh: Budi / Bengkel Motor / Toko X"
                  value={debtForm.personName}
                  onChange={e => setDebtForm({ ...debtForm, personName: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="hn-input-group">
                  <label className="hn-label">Bentuk</label>
                  <select 
                    className="hn-select"
                    value={debtForm.itemType}
                    onChange={e => setDebtForm({ ...debtForm, itemType: e.target.value })}
                  >
                    <option value="uang">Uang (Rp)</option>
                    <option value="barang">Barang / Jasa</option>
                  </select>
                </div>

                {debtForm.itemType === 'uang' && (
                  <div className="hn-input-group">
                    <label className="hn-label">Nominal (Rp)</label>
                    <input 
                      type="number"
                      className="hn-input"
                      placeholder="150000"
                      value={debtForm.amount}
                      onChange={e => setDebtForm({ ...debtForm, amount: e.target.value })}
                      required={debtForm.itemType === 'uang'}
                    />
                  </div>
                )}
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Deskripsi / Keterangan</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Pinjam dana darurat / Beli sparepart"
                  value={debtForm.description}
                  onChange={e => setDebtForm({ ...debtForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="hn-input-group">
                  <label className="hn-label">Tanggal Pinjam</label>
                  <input 
                    type="date"
                    className="hn-input"
                    value={debtForm.date}
                    onChange={e => setDebtForm({ ...debtForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="hn-input-group">
                  <label className="hn-label">Jatuh Tempo (Opsional)</label>
                  <input 
                    type="date"
                    className="hn-input"
                    value={debtForm.dueDate}
                    onChange={e => setDebtForm({ ...debtForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="hn-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setShowAddModal(false)}
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

      {/* Record Payment / Cicilan Modal */}
      {showPaymentModal && selectedDebtForPayment && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Catat Pembayaran / Cicilan
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '16px' }}>
              Pembayaran untuk: <strong>{selectedDebtForPayment.personName}</strong>
            </p>

            <form onSubmit={handleSavePayment}>
              <div className="hn-input-group">
                <label className="hn-label">Jumlah Yang Dibayarkan (Rp)</label>
                <input 
                  type="number"
                  className="hn-input"
                  style={{ fontSize: '20px', fontWeight: '800' }}
                  value={paymentForm.amount}
                  onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  required
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Tanggal Bayar</label>
                <input 
                  type="date"
                  className="hn-input"
                  value={paymentForm.date}
                  onChange={e => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Catatan Pembayaran (Transfer/Tunai)</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Transfer via m-Banking / Cash"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="hn-btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => setShowPaymentModal(false)}
                >
                  Batal
                </button>
                <button type="submit" className="hn-btn-primary" style={{ flex: 1 }}>
                  Simpan Cicilan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Debt Confirmation Modal */}
      {debtToDelete && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>
              Hapus Catatan?
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginBottom: '20px' }}>
              Yakin ingin menghapus catatan hutang/piutang ini?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="hn-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setDebtToDelete(null)}
              >
                Batal
              </button>
              <button 
                type="button"
                className="hn-btn-primary"
                style={{ flex: 1 }}
                onClick={executeDeleteDebt}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
