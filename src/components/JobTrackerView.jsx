import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  MapPin, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  PhoneCall, 
  FileText, 
  Trash2, 
  Edit, 
  TrendingUp, 
  X, 
  Sparkles,
  Building2,
  AlertCircle
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const STATUS_OPTIONS = [
  { id: 'Terkirim', label: 'Terkirim', color: '#005BAB', bg: '#FFF3DD', icon: Clock },
  { id: 'Ditinjau', label: 'Ditinjau', color: '#005BAB', bg: '#FFFFFF', icon: FileText },
  { id: 'Interview', label: 'Interview', color: '#005BAB', bg: '#FFF3DD', icon: PhoneCall },
  { id: 'Tes', label: 'Psikotes / Tes', color: '#005BAB', bg: '#FFFFFF', icon: Sparkles },
  { id: 'Diterima', label: 'Diterima 🎉', color: '#005BAB', bg: '#FFF3DD', icon: CheckCircle2 },
  { id: 'Ditolak', label: 'Ditolak ❌', color: '#005BAB', bg: '#FFFFFF', icon: AlertCircle },
];

const PLATFORM_PRESETS = [
  'LinkedIn',
  'JobStreet',
  'Glints',
  'Instagram',
  'KitaLulus',
  'Website Perusahaan',
  'Referral / Rekomendasi',
  'Lainnya'
];

export const JobTrackerView = ({ applications = [], onSaveApplications }) => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    location: '',
    platform: 'LinkedIn',
    customPlatform: '',
    applyDate: new Date().toISOString().split('T')[0],
    status: 'Terkirim',
    notes: ''
  });

  // Calculate statistics
  const totalApps = applications.length;
  const interviewCount = applications.filter(a => a.status === 'Interview' || a.status === 'Tes' || a.status === 'Diterima').length;
  const acceptedCount = applications.filter(a => a.status === 'Diterima').length;
  const responseRate = totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;

  // Calculate platform distribution
  const platformCounts = applications.reduce((acc, app) => {
    const key = app.platform || 'Lainnya';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingJob(null);
    setFormData({
      companyName: '',
      position: '',
      location: '',
      platform: 'LinkedIn',
      customPlatform: '',
      applyDate: new Date().toISOString().split('T')[0],
      status: 'Terkirim',
      notes: ''
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    const isPreset = PLATFORM_PRESETS.includes(job.platform);
    setFormData({
      companyName: job.companyName || '',
      position: job.position || '',
      location: job.location || '',
      platform: isPreset ? job.platform : 'Lainnya',
      customPlatform: isPreset ? '' : job.platform,
      applyDate: job.applyDate || new Date().toISOString().split('T')[0],
      status: job.status || 'Terkirim',
      notes: job.notes || ''
    });
    setShowModal(true);
  };

  // Save Job Application
  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.position) return;

    const selectedPlatform = formData.platform === 'Lainnya' 
      ? (formData.customPlatform || 'Lainnya') 
      : formData.platform;

    let updated = [];
    if (editingJob) {
      updated = applications.map(app => app.id === editingJob.id ? {
        ...app,
        companyName: formData.companyName,
        position: formData.position,
        location: formData.location,
        platform: selectedPlatform,
        applyDate: formData.applyDate,
        status: formData.status,
        notes: formData.notes,
        updatedAt: new Date().toISOString()
      } : app);
    } else {
      const newJob = {
        id: 'job_' + Date.now(),
        companyName: formData.companyName,
        position: formData.position,
        location: formData.location,
        platform: selectedPlatform,
        applyDate: formData.applyDate,
        status: formData.status,
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updated = [newJob, ...applications];
    }

    onSaveApplications(updated);
    setShowModal(false);
  };

  // Quick Status Update
  const handleQuickStatusChange = (jobId, newStatus) => {
    const updated = applications.map(app => {
      if (app.id === jobId) {
        return { ...app, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return app;
    });
    onSaveApplications(updated);
  };

  // Delete Job
  const executeDeleteJob = () => {
    if (!jobToDelete) return;
    const updated = applications.filter(a => a.id !== jobToDelete.id);
    onSaveApplications(updated);
    setJobToDelete(null);
  };

  // Filter & Search Logic
  const filteredApplications = applications.filter(app => {
    const matchesFilter = activeFilter === 'Semua' || app.status === activeFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (app.companyName || '').toLowerCase().includes(q) ||
      (app.position || '').toLowerCase().includes(q) ||
      (app.location || '').toLowerCase().includes(q) ||
      (app.platform || '').toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '150px' }}>
      
      {/* Top Banner Header */}
      <div className="hn-card" style={{ backgroundColor: '#FFF3DD' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '2px solid #005BAB' }}>
              <Briefcase size={24} color="#005BAB" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB' }}>
                FITUR UTAMA 2
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#005BAB' }}>
                Catatan Lamaran Kerja
              </h2>
            </div>
          </div>
          <button 
            className="hn-btn-primary" 
            style={{ fontSize: '13px', padding: '8px 14px' }}
            onClick={handleOpenAddModal}
          >
            <Plus size={16} /> Tambah
          </button>
        </div>
      </div>

      {/* Analytics & Summary Card */}
      <div className="hn-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '800', color: '#005BAB' }}>
            <TrendingUp size={16} /> Analytics & Statistik Lamaran
          </div>
          <span className="hn-badge-solid" style={{ fontSize: '11px' }}>
            {totalApps} Total Dilamar
          </span>
        </div>

        {/* Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{totalApps}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Lamaran</div>
          </div>
          <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{interviewCount}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Respons</div>
          </div>
          <div style={{ backgroundColor: '#FFF3DD', padding: '10px', borderRadius: '12px', border: '1.5px solid #005BAB', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#005BAB' }}>{responseRate}%</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#005BAB', marginTop: '2px' }}>Rate Panggilan</div>
          </div>
        </div>

        {/* Platform Distribution Bar Diagram */}
        {totalApps > 0 && (
          <div style={{ backgroundColor: '#FFF3DD', padding: '12px', borderRadius: '14px', border: '1.5px solid #005BAB' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', color: '#005BAB' }}>
              📊 Distribusi Sumber Lowongan
            </div>
            
            {/* Visual Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(platformCounts).map(([platform, count]) => {
                const percent = Math.round((count / totalApps) * 100);
                return (
                  <div key={platform} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
        )}
      </div>

      {/* Search & Filter Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#005BAB', opacity: 0.7 }} />
          <input 
            type="text"
            className="hn-input"
            style={{ paddingLeft: '40px', fontSize: '13px' }}
            placeholder="Cari perusahaan, posisi, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', marginBottom: '6px', marginLeft: '2px' }}>
            Filter Status:
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
            {['Semua', 'Terkirim', 'Ditinjau', 'Interview', 'Tes', 'Diterima', 'Ditolak'].map(st => (
              <button
                key={st}
                onClick={() => setActiveFilter(st)}
                className={activeFilter === st ? 'hn-badge-solid' : 'hn-badge-cream'}
                style={{
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  padding: '7px 14px',
                  fontSize: '12px'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List of Applications */}
      {filteredApplications.length === 0 ? (
        <div className="hn-card" style={{ textAlign: 'center', padding: '36px 16px' }}>
          <Briefcase size={42} style={{ margin: '0 auto 10px', display: 'block', opacity: 0.8 }} />
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>Belum Ada Lamaran Kerja</h3>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px', marginBottom: '16px' }}>
            {searchQuery || activeFilter !== 'Semua' 
              ? 'Tidak ada lamaran yang cocok dengan filter atau pencarian.' 
              : 'Mulai catat seluruh lowongan kerja yang Anda lamar secara terorganisir.'}
          </p>
          <button className="hn-btn-primary" onClick={handleOpenAddModal} style={{ fontSize: '13px' }}>
            <Plus size={16} /> Tambah Lamaran Pertama
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredApplications.map((job) => {
            const statusConfig = STATUS_OPTIONS.find(s => s.id === job.status) || STATUS_OPTIONS[0];

            return (
              <div key={job.id} className="hn-card" style={{ padding: '20px' }}>
                {/* Header Card: Position & Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#005BAB', lineHeight: '1.3' }}>
                      {job.position}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '700', marginTop: '6px', color: '#005BAB' }}>
                      <Building2 size={16} /> {job.companyName}
                    </div>
                  </div>

                  <span className="hn-badge-solid" style={{ fontSize: '12px', padding: '5px 12px', whiteSpace: 'nowrap' }}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Details Row: Location, Platform, Date */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px', 
                  marginTop: '14px', 
                  paddingTop: '12px', 
                  borderTop: '1.5px dashed #005BAB',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {job.location && (
                    <span className="hn-badge-cream" style={{ fontSize: '11px', padding: '5px 10px' }}>
                      <MapPin size={12} /> {job.location}
                    </span>
                  )}
                  {job.platform && (
                    <span className="hn-badge-outline" style={{ fontSize: '11px', padding: '5px 10px' }}>
                      <Globe size={12} /> {job.platform}
                    </span>
                  )}
                  <span className="hn-badge-cream" style={{ fontSize: '11px', padding: '5px 10px' }}>
                    <Calendar size={12} /> {formatDate(job.applyDate)}
                  </span>
                </div>

                {/* Additional Notes */}
                {job.notes && (
                  <div style={{ 
                    marginTop: '12px', 
                    fontSize: '12px', 
                    backgroundColor: '#FFF3DD', 
                    padding: '10px 12px', 
                    borderRadius: '12px', 
                    border: '1.5px solid #005BAB',
                    color: '#005BAB',
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    📝 <strong>Catatan:</strong> {job.notes}
                  </div>
                )}

                {/* Dedicated Container: Quick Status Change */}
                <div style={{ 
                  marginTop: '16px', 
                  padding: '14px', 
                  backgroundColor: '#FFF3DD', 
                  borderRadius: '14px', 
                  border: '1.5px solid #005BAB' 
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#005BAB', marginBottom: '8px' }}>
                    ⚡ Ubah Status Cepat:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                    {STATUS_OPTIONS.map(st => (
                      <button
                        key={st.id}
                        onClick={() => handleQuickStatusChange(job.id, st.id)}
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '6px 10px',
                          borderRadius: '10px',
                          border: '1.5px solid #005BAB',
                          backgroundColor: job.status === st.id ? '#005BAB' : '#FFFFFF',
                          color: job.status === st.id ? '#FFFFFF' : '#005BAB',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.12s ease'
                        }}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons (Edit & Delete) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                  <button 
                    className="hn-btn-outline"
                    style={{ padding: '8px 14px', fontSize: '12px' }}
                    onClick={() => handleOpenEditModal(job)}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button 
                    className="hn-btn-outline"
                    style={{ padding: '8px 14px', fontSize: '12px', color: '#005BAB' }}
                    onClick={() => setJobToDelete(job)}
                  >
                    <Trash2 size={14} /> Hapus
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add / Edit Job Application */}
      {showModal && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005BAB' }}>
                {editingJob ? 'Edit Catatan Lamaran' : 'Tambah Lamaran Kerja Baru'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="hn-btn-icon"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveForm}>
              <div className="hn-input-group">
                <label className="hn-label">Nama Perusahaan *</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Contoh: PT Teknologi Nusantara"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Posisi yang Di-apply *</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Contoh: Graphic Designer / UI UX"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Lokasi Perusahaan / Kerja</label>
                <input 
                  type="text"
                  className="hn-input"
                  placeholder="Contoh: Jakarta / WFH / WFO"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Sumber Platform Lowongan</label>
                <select 
                  className="hn-select"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  {PLATFORM_PRESETS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {formData.platform === 'Lainnya' && (
                <div className="hn-input-group">
                  <label className="hn-label">Sebutkan Platform Lainnya</label>
                  <input 
                    type="text"
                    className="hn-input"
                    placeholder="Contoh: Telegram, Grup WhatsApp, dll."
                    value={formData.customPlatform}
                    onChange={(e) => setFormData({ ...formData, customPlatform: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="hn-input-group">
                  <label className="hn-label">Tanggal Apply</label>
                  <input 
                    type="date"
                    className="hn-input"
                    value={formData.applyDate}
                    onChange={(e) => setFormData({ ...formData, applyDate: e.target.value })}
                  />
                </div>

                <div className="hn-input-group">
                  <label className="hn-label">Status Lamaran</label>
                  <select 
                    className="hn-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hn-input-group">
                <label className="hn-label">Catatan Tambahan (Opsional)</label>
                <textarea 
                  className="hn-textarea"
                  placeholder="Ekspektasi gaji, kontak HR, link lowongan, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  className="hn-btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="hn-btn-primary" 
                  style={{ flex: 1 }}
                >
                  Simpan Lamaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="hn-modal-overlay">
          <div className="hn-modal-content" style={{ textAlign: 'center' }}>
            <Trash2 size={40} style={{ margin: '0 auto 10px', display: 'block', color: '#005BAB' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#005BAB' }}>Hapus Catatan Lamaran?</h3>
            <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '6px', marginBottom: '20px', color: '#005BAB' }}>
              Catatan lamaran ke <strong>{jobToDelete.companyName}</strong> ({jobToDelete.position}) akan dihapus secara permanen.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="hn-btn-outline" 
                style={{ flex: 1 }}
                onClick={() => setJobToDelete(null)}
              >
                Batal
              </button>
              <button 
                className="hn-btn-primary" 
                style={{ flex: 1 }}
                onClick={executeDeleteJob}
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
