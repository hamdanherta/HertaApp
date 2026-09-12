import React, { useState, useEffect } from 'react';

export const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out animation at 2.5 seconds, then unmount at 3.0 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`hn-splash-container ${fadeOut ? 'hn-splash-fade-out' : ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Logo Container with Smooth Pulse Animation */}
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '28px',
          backgroundColor: '#FFFFFF',
          border: '3px solid #005BAB',
          boxShadow: '6px 6px 0px #005BAB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          animation: 'splashLogoPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, splashPulse 2s ease-in-out infinite 0.8s'
        }}>
          <img 
            src="/logo.png" 
            alt="Herta App Logo" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain' 
            }} 
          />
        </div>

        {/* Title and Tagline */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '26px', 
            fontWeight: '800', 
            color: '#005BAB', 
            letterSpacing: '-0.5px' 
          }}>
            Herta App
          </h1>
          <p style={{ 
            fontSize: '13px', 
            fontWeight: '700', 
            color: '#005BAB', 
            opacity: 0.85, 
            marginTop: '4px' 
          }}>
            Semua Kesempurnaan dalam Satu App
          </p>
        </div>

        {/* Smooth Loading Bar */}
        <div style={{
          width: '160px',
          height: '8px',
          backgroundColor: '#FFFFFF',
          border: '2px solid #005BAB',
          borderRadius: '99px',
          overflow: 'hidden',
          marginTop: '12px',
          boxShadow: '2px 2px 0px #005BAB'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: '#005BAB',
            borderRadius: '99px',
            animation: 'splashBarProgress 2.5s cubic-bezier(0.1, 0.5, 0.5, 1) forwards'
          }} />
        </div>
      </div>
    </div>
  );
};
