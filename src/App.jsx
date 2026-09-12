import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HamburgerMenu } from './components/HamburgerMenu';
import { DashboardView } from './components/DashboardView';
import { OilMeterView } from './components/OilMeterView';
import { DebtTrackerView } from './components/DebtTrackerView';
import { NotifikasiView } from './components/NotifikasiView';
import { FavoritView } from './components/FavoritView';
import { ProfilView } from './components/ProfilView';
import { BackupModal } from './components/BackupModal';
import { 
  loadVehicles, 
  saveVehicles, 
  loadDebts, 
  saveDebts, 
  loadSettings, 
  saveSettings,
  loadPatokan,
  savePatokan 
} from './utils/storage';

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [debts, setDebts] = useState([]);
  const [settings, setSettings] = useState({});
  const [patokan, setPatokan] = useState(null);
  const [activeTab, setActiveTab] = useState('beranda'); // 'beranda', 'notifikasi', 'favorit', 'profil', 'oil', 'debt'
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  // Load initial  data
  const refreshData = () => {
    setVehicles(loadVehicles());
    setDebts(loadDebts());
    setSettings(loadSettings());
    setPatokan(loadPatokan());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update handlers
  const handleSaveVehicles = (newVehicles) => {
    setVehicles(newVehicles);
    saveVehicles(newVehicles);
  };

  const handleSaveDebts = (newDebts) => {
    setDebts(newDebts);
    saveDebts(newDebts);
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSavePatokan = (newPatokan) => {
    setPatokan(newPatokan);
    savePatokan(newPatokan);
  };

  const handleSelectHamburgerMenu = (action) => {
    if (action === 'backup') {
      setShowBackupModal(true);
    } else {
      setActiveTab(action);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* Top Header with Hamburger Button */}
      <Header 
        onOpenMenu={() => setShowHamburgerMenu(true)} 
        onOpenBackup={() => setShowBackupModal(true)} 
      />

      {/* Main View Container */}
      <main style={{ flex: 1, padding: '16px 14px 20px 14px' }}>
        {activeTab === 'beranda' && (
          <DashboardView 
            vehicles={vehicles}
            onSaveVehicles={handleSaveVehicles}
            settings={settings}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'oil' && (
          <OilMeterView 
            vehicles={vehicles}
            onSaveVehicles={handleSaveVehicles}
            patokan={patokan}
            onSavePatokan={handleSavePatokan}
          />
        )}


        {activeTab === 'debt' && (
          <DebtTrackerView 
            debts={debts}
            onSaveDebts={handleSaveDebts}
          />
        )}

        {activeTab === 'notifikasi' && (
          <NotifikasiView 
            vehicles={vehicles}
            debts={debts}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'favorit' && (
          <FavoritView 
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'profil' && (
          <ProfilView 
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onOpenBackup={() => setShowBackupModal(true)}
            onRefreshData={refreshData}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation (Beranda, Notifikasi, Favorit, Profil) */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
      />

      {/* Hamburger Drawer Side Menu */}
      <HamburgerMenu 
        isOpen={showHamburgerMenu}
        onClose={() => setShowHamburgerMenu(false)}
        onSelectMenu={handleSelectHamburgerMenu}
      />

      {/* Backup & Settings Modal */}
      <BackupModal 
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onRefreshData={refreshData}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}
