import React from 'react';
import { HistoricalData } from '../types';

interface ChartProps {
  data: HistoricalData[];
  dataKey: keyof HistoricalData;
  title: string;
  color: string;
  unit?: string;
}

export const Chart: React.FC<ChartProps> = ({ data, dataKey, title, color, unit = '' }) => {
  const maxValue = Math.max(...data.map(d => Number(d[dataKey])));
  const minValue = Math.min(...data.map(d => Number(d[dataKey])));
  const range = maxValue - minValue || 1;

  const getPath = () => {
    if (data.length === 0) return '';
    
    const width = 400;
    const height = 120;
    const padding = 20;
    
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((Number(d[dataKey]) - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="relative">
        <svg width="100%" height="120" viewBox="0 0 400 120" className="overflow-visible">
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="20"
              y1={20 + (y / 100) * 80}
              x2="380"
              y2={20 + (y / 100) * 80}
              stroke="#374151"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          
          {/* Chart area */}
          <path
            d={`${getPath()} L 380,100 L 20,100 Z`}
            fill={`url(#gradient-${dataKey})`}
          />
          
          {/* Chart line */}
          <path
            d={getPath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = 20 + (i / (data.length - 1)) * 360;
            const y = 100 - ((Number(d[dataKey]) - minValue) / range) * 80;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={color}
                className="drop-shadow-sm"
              />
            );
          })}
        </svg>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{data[0]?.timestamp ? new Date(data[0].timestamp).toLocaleTimeString() : ''}</span>
          <span className="text-white font-medium">
            {data[data.length - 1] ? `${Number(data[data.length - 1][dataKey]).toFixed(1)}${unit}` : ''}
          </span>
          <span>{data[data.length - 1]?.timestamp ? new Date(data[data.length - 1].timestamp).toLocaleTimeString() : ''}</span>
        </div>
      </div>
    </div>
  );
};