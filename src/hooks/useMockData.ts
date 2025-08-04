import { useState, useEffect } from 'react';
import { TrapData, HistoricalData } from '../types';

export const useMockData = () => {
  const [trapData, setTrapData] = useState<TrapData>({
    id: 'trap-001',
    name: 'Garden Mosquitto Trap',
    isOnline: true,
    isActive: true,
    battery: {
      level: 78,
      voltage: 12.4,
      isCharging: true,
    },
    solar: {
      voltage: 18.2,
      current: 2.1,
      power: 38.2,
    },
    ldr: {
      rawValue: 245,
      lightLevel: 'dim',
      percentage: 24,
    },
    trap: {
      isOn: true,
      intensity: 85,
      mode: 'auto',
    },
    lastUpdated: new Date().toISOString(),
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    // Generate mock historical data
    const generateHistoricalData = () => {
      const data: HistoricalData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: time.toISOString(),
          batteryLevel: Math.max(20, Math.min(100, 75 + Math.sin(i * 0.5) * 15 + Math.random() * 10)),
          solarPower: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 40 + Math.random() * 5),
          lightLevel: Math.max(0, Math.min(100, Math.sin((i - 6) * Math.PI / 12) * -50 + 50 + Math.random() * 10)),
          trapStatus: i >= 6 && i <= 22 ? Math.random() > 0.3 : false,
        });
      }
      
      setHistoricalData(data);
    };

    generateHistoricalData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrapData(prev => ({
        ...prev,
        battery: {
          ...prev.battery,
          level: Math.max(20, Math.min(100, prev.battery.level + (Math.random() - 0.5) * 2)),
          voltage: 12.0 + Math.random() * 0.8,
          isCharging: Math.random() > 0.3,
        },
        solar: {
          voltage: 15 + Math.random() * 6,
          current: Math.random() * 3,
          power: 15 + Math.random() * 30,
        },
        ldr: {
          rawValue: Math.floor(Math.random() * 1024),
          lightLevel: Math.random() > 0.5 ? 'dim' : Math.random() > 0.5 ? 'dark' : 'bright',
          percentage: Math.floor(Math.random() * 100),
        },
        lastUpdated: new Date().toISOString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const updateTrapSettings = (settings: Partial<TrapData['trap']>) => {
    setTrapData(prev => ({
      ...prev,
      trap: { ...prev.trap, ...settings },
    }));
  };

  return { trapData, historicalData, updateTrapSettings };
};