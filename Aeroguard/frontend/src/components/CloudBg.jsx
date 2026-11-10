import React from 'react';

export default function CloudBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Sky Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 via-sky-100/30 to-sky-50/10" />

      {/* Cloud Layer 1 - Slow Drift */}
      <div className="absolute top-12 left-0 opacity-40 animate-cloud-drift-slow flex gap-32">
        <svg className="w-48 h-20 fill-white" viewBox="0 0 100 40">
          <path d="M20,30 Q30,10 50,20 Q65,5 80,20 Q95,25 90,35 Q80,40 20,35 Z" />
        </svg>
        <svg className="w-64 h-24 fill-white" viewBox="0 0 100 40">
          <path d="M10,35 Q25,15 45,25 Q60,8 80,22 Q95,15 95,35 Z" />
        </svg>
      </div>

      {/* Cloud Layer 2 - Fast Drift */}
      <div className="absolute top-48 -left-48 opacity-30 animate-cloud-drift-fast flex gap-40">
        <svg className="w-56 h-24 fill-white" viewBox="0 0 100 40">
          <path d="M15,32 Q35,12 55,22 Q70,8 85,25 Z" />
        </svg>
        <svg className="w-72 h-28 fill-white" viewBox="0 0 100 40">
          <path d="M20,30 Q40,10 60,20 Q75,5 90,20 Z" />
        </svg>
      </div>

      {/* Gliding Airplane Silhouette */}
      <div className="absolute top-24 right-12 opacity-25 animate-plane-glide">
        <svg className="w-20 h-20 text-sky-600 fill-current" viewBox="0 0 24 24">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    </div>
  );
}