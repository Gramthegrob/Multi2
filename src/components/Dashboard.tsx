import React from 'react';
import { Battery, Sun, Eye, Thermometer, Droplets, Wifi } from 'lucide-react';
import { StatusCard } from './StatusCard';
import { Chart } from './Chart';
import { TrapControls } from './TrapControls';
import { TrapData, HistoricalData } from '../types';

interface DashboardProps {
  trapData: TrapData;
  historicalData: HistoricalData[];
  onUpdateSettings: (settings: Partial<TrapData['trap']>) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ trapData, historicalData, onUpdateSettings }) => {
  const getBatteryStatus = (level: number) => {
    if (level > 70) return 'good';
    if (level > 30) return 'warning';
    return 'error';
  };

  const getLightStatus = (level: string) => {
    switch (level) {
      case 'bright': return 'warning';
      case 'dim': return 'good';
      case 'dark': return 'good';
      default: return 'good';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{trapData.name}</h1>
          <p className="text-gray-400 mt-1">Last updated: {new Date(trapData.lastUpdated).toLocaleString()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${trapData.isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className={`text-sm font-medium ${trapData.isOnline ? 'text-green-400' : 'text-red-400'}`}>
            {trapData.isOnline ? 'Online' : 'Offline'}
          </span>
          <Wifi className={`h-4 w-4 ${trapData.isOnline ? 'text-green-400' : 'text-red-400'}`} />
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          title="Battery Level"
          value={trapData.battery.level}
          unit="%"
          icon={Battery}
          status={getBatteryStatus(trapData.battery.level)}
          isCharging={trapData.battery.isCharging}
          subtitle={`${trapData.battery.voltage.toFixed(1)}V`}
        />
        
        <StatusCard
          title="Solar Power"
          value={trapData.solar.power.toFixed(1)}
          unit="W"
          icon={Sun}
          status="good"
          subtitle={`${trapData.solar.voltage.toFixed(1)}V • ${trapData.solar.current.toFixed(1)}A`}
        />
        
        <StatusCard
          title="Light Level"
          value={trapData.ldr.percentage}
          unit="%"
          icon={Eye}
          status={getLightStatus(trapData.ldr.lightLevel)}
          subtitle={trapData.ldr.lightLevel.toUpperCase()}
        />
        
        <StatusCard
          title="Temperature"
          value={trapData.temperature.toFixed(1)}
          unit="°C"
          icon={Thermometer}
          status="good"
        />
        
        <StatusCard
          title="Humidity"
          value={trapData.humidity.toFixed(1)}
          unit="%"
          icon={Droplets}
          status="good"
        />
        
        <div className="sm:col-span-2 lg:col-span-1">
          <TrapControls trapData={trapData} onUpdateSettings={onUpdateSettings} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          data={historicalData}
          dataKey="batteryLevel"
          title="Battery Level (24h)"
          color="#10b981"
          unit="%"
        />
        
        <Chart
          data={historicalData}
          dataKey="solarPower"
          title="Solar Power (24h)"
          color="#f59e0b"
          unit="W"
        />
        
        <Chart
          data={historicalData}
          dataKey="lightLevel"
          title="Light Level (24h)"
          color="#3b82f6"
          unit="%"
        />
        
        <Chart
          data={historicalData}
          dataKey="trapStatus"
          title="Trap Activity (24h)"
          color="#8b5cf6"
        />
      </div>
    </div>
  );
};