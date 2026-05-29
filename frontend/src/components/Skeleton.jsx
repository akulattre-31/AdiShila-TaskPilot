import React from 'react';

export default function Skeleton({ width = '100%', height = '20px', className = '' }) {
  return (
    <div 
      className={`bg-white/5 animate-pulse rounded-md ${className}`} 
      style={{ width, height }}
    ></div>
  );
}
