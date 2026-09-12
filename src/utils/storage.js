/**
 *  Storage & State persistence manager for Herta App
 */

const STORAGE_KEYS = {
  VEHICLES: 'hertnote_vehicles_v2',
  DEBTS: 'hertnote_debts_v2',
  SETTINGS: 'hertnote_settings_v2',
  PATOKAN: 'hertnote_patokan_v2'
};

const DEFAULT_VEHICLES = [];

const DEFAULT_DEBTS = [];

const DEFAULT_SETTINGS = {
  dailyKmEstimate: 35,
  ownerName: 'Pengguna Herta App',
  autoBackupNotice: true
};

const DEFAULT_PATOKAN = null; // Kosong di awal!

// Storage Utilities
export const loadPatokan = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATOKAN);
    return data ? JSON.parse(data) : DEFAULT_PATOKAN;
  } catch (err) {
    console.error('Error loading patokan:', err);
    return DEFAULT_PATOKAN;
  }
};

export const savePatokan = (patokan) => {
  try {
    if (patokan === null) {
      localStorage.removeItem(STORAGE_KEYS.PATOKAN);
    } else {
      localStorage.setItem(STORAGE_KEYS.PATOKAN, JSON.stringify(patokan));
    }
  } catch (err) {
    console.error('Error saving patokan:', err);
  }
};

export const loadVehicles = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    return data ? JSON.parse(data) : DEFAULT_VEHICLES;
  } catch (err) {
    console.error('Error loading vehicles:', err);
    return DEFAULT_VEHICLES;
  }
};

export const saveVehicles = (vehicles) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Error saving vehicles:', err);
  }
};

export const loadDebts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DEBTS);
    return data ? JSON.parse(data) : DEFAULT_DEBTS;
  } catch (err) {
    console.error('Error loading debts:', err);
    return DEFAULT_DEBTS;
  }
};

export const saveDebts = (debts) => {
  try {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
  } catch (err) {
    console.error('Error saving debts:', err);
  }
};

export const loadSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (err) {
    console.error('Error loading settings:', err);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};

export const clearAllData = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.PATOKAN);
  } catch (err) {
    console.error('Error clearing data:', err);
  }
};

// Backup Export & Import Functions
export const exportDataJSON = () => {
  const data = {
    appName: 'Herta App',
    version: '2.0.0',
    exportDate: new Date().toISOString(),
    patokan: loadPatokan(),
    vehicles: loadVehicles(),
    debts: loadDebts(),
    settings: loadSettings()
  };
  return JSON.stringify(data, null, 2);
};

export const importDataJSON = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    if (!data.vehicles || !data.debts) {
      throw new Error('Format file backup tidak valid. Pastikan file JSON dari Herta App.');
    }
    if (data.patokan !== undefined) savePatokan(data.patokan);
    saveVehicles(data.vehicles);
    saveDebts(data.debts);
    if (data.settings) saveSettings(data.settings);
    return { success: true, message: 'Data berhasil dipulihkan!' };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal mengimpor file backup.' };
  }
};
