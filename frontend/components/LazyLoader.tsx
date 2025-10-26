'use client';

import { useEffect, useState } from 'react';
import './LazyLoader.css';

export default function LazyLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lazy-loader">
      <div className="loader-content">
        {/* Logo/Brand */}
        <div className="loader-logo">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            GamepayX
          </h1>
        </div>

        {/* Spinner */}
        <div className="loader-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        {/* Progress Bar */}
        <div className="loader-progress">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="progress-text">{Math.floor(Math.min(progress, 100))}%</p>
        </div>

        {/* Loading Text */}
        <div className="loader-text">
          <p className="text-gray-400 text-sm">Loading your gaming experience...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
