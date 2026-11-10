import React from 'react';

export default function LiveGraph({ data = [], color = '#0ea5e9', height = 180, showGrid = true }) {
  if (!data || data.length < 2) {
    return (
      <div className="flex items-center justify-center h-44 text-xs font-semibold text-sky-400">
        Collecting live telemetry stream data...
      </div>
    );
  }

  const values = data.map(d => typeof d === 'number' ? d : (d.risk_score || d.temperature || 0));
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = (max - min) || 1;

  const points = values.map((val, idx) => {
    const x = (idx / (values.length - 1)) * 100;
    const y = 90 - ((val - min) / range) * 80;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,95 ${points} 100,95`;

  return (
    <div className="w-full relative" style={{ height: `${height}px` }}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {showGrid && (
          <g className="stroke-sky-200/50 stroke-1" strokeDasharray="2,2">
            <line x1="0" y1="20" x2="100" y2="20" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="80" x2="100" y2="80" />
          </g>
        )}
        {/* Gradient Fill under the line */}
        <defs>
          <linearGradient id="skyGraphGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#skyGraphGradient)" />

        {/* Dynamic Line Path */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          className="transition-all duration-300 ease-out"
        />
      </svg>
    </div>
  );
}