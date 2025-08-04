import React from 'react';
import { Battery, Zap, Sun, Eye, Thermometer, Droplets } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ElementType;
  status?: 'good' | 'warning' | 'error';
  isCharging?: boolean;
  subtitle?: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  status = 'good',
  isCharging,
  subtitle,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'good': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusBg()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${status === 'good' ? 'bg-green-500/20' : status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'}`}>
          <Icon className={`h-5 w-5 ${getStatusColor()}`} />
        </div>
        {isCharging && (
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-green-400 animate-pulse" />
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <div className="flex items-baseline space-x-1">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-sm text-gray-400">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
};