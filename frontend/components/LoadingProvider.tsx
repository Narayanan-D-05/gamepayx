'use client';

import { useState, useEffect } from 'react';
import LazyLoader from './LazyLoader';

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Minimum loading time for smooth experience
    const minLoadTime = 1500;
    const startTime = Date.now();

    // Wait for window to load
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);

      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setLoading(false);
        }, 500); // Match fade-out animation duration
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <>
      {loading && (
        <div className={fadeOut ? 'fade-out' : ''}>
          <LazyLoader />
        </div>
      )}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {children}
      </div>
    </>
  );
}
