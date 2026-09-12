/**
 * Helper utility functions for formatting and calculations in Herta App
 */

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatKm = (km) => {
  if (km === undefined || km === null || isNaN(km)) return '0 KM';
  return new Intl.NumberFormat('id-ID').format(km) + ' KM';
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

export const calculateNextOilKm = (lastOilKm, intervalKm) => {
  const last = parseInt(lastOilKm || 0, 10);
  const interval = parseInt(intervalKm || 2000, 10);
  return last + interval;
};

export const calculateOilStatus = (currentKm, lastOilKm, intervalKm) => {
  const current = parseInt(currentKm || 0, 10);
  const last = parseInt(lastOilKm || 0, 10);
  const interval = parseInt(intervalKm || 2000, 10);
  const targetKm = last + interval;
  const usedKm = current - last;
  const remainingKm = targetKm - current;
  const percentage = Math.min(Math.max(Math.round((usedKm / interval) * 100), 0), 100);

  let status = 'Sangat Baik';
  let label = 'Oli Segar & Aman';
  
  if (remainingKm <= 0) {
    status = 'Lewat Batas';
    label = `Lewat ${Math.abs(remainingKm)} KM - Segara Ganti!`;
  } else if (remainingKm <= 300) {
    status = 'Segera Ganti';
    label = `Sisa ${remainingKm} KM - Siapkan Ganti Oli`;
  } else if (remainingKm <= 700) {
    status = 'Perlu Perhatian';
    label = `Sisa ${remainingKm} KM`;
  }

  return {
    current,
    last,
    interval,
    targetKm,
    usedKm: Math.max(usedKm, 0),
    remainingKm,
    percentage,
    status,
    label
  };
};

export const estimateDaysRemaining = (remainingKm, dailyKmEstimate = 30) => {
  if (remainingKm <= 0) return 'Hari ini / Sudah lewat';
  const daily = Math.max(parseInt(dailyKmEstimate || 30, 10), 1);
  const days = Math.ceil(remainingKm / daily);
  if (days <= 1) return 'Sekitar 1 hari lagi';
  if (days <= 30) return `Sekitar ${days} hari lagi`;
  const months = Math.floor(days / 30);
  const remDays = days % 30;
  return `Sekitar ${months} bulan ${remDays > 0 ? remDays + ' hari' : ''} lagi`;
};
