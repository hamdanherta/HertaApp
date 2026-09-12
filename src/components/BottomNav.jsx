import React from 'react';
import { Home, Bell, Heart, User } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="hn-bottom-nav">
      <button 
        className={`hn-nav-btn ${activeTab === 'beranda' ? 'active' : ''}`}
        onClick={() => setActiveTab('beranda')}
      >
        <Home />
        <span>Beranda</span>
      </button>

      <button 
        className={`hn-nav-btn ${activeTab === 'notifikasi' ? 'active' : ''}`}
        onClick={() => setActiveTab('notifikasi')}
      >
        <Bell />
        <span>Notifikasi</span>
      </button>

      <button 
        className={`hn-nav-btn ${activeTab === 'favorit' ? 'active' : ''}`}
        onClick={() => setActiveTab('favorit')}
      >
        <Heart />
        <span>Favorit</span>
      </button>

      <button 
        className={`hn-nav-btn ${activeTab === 'profil' ? 'active' : ''}`}
        onClick={() => setActiveTab('profil')}
      >
        <User />
        <span>Profil</span>
      </button>
    </nav>
  );
};
