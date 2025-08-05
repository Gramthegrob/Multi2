export interface TrapData {
  id: string;
  name: string;
  isOnline: boolean;
  isActive: boolean;
  battery: {
    level: number;
    voltage: number;
    isCharging: boolean;
  };
  solar: {
    voltage: number;
    current: number;
    power: number;
  };
  ldr: {
    rawValue: number;
    lightLevel: 'dark' | 'dim' | 'bright';
    percentage: number;
  };
  trap: {
    isOn: boolean;
    intensity: number;
    mode: 'manual' | 'auto' | 'scheduled';
    schedule?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
  };
  lastUpdated: string;
  // Make these optional for now to prevent errors
  temperature?: number;
  humidity?: number;
}

export interface HistoricalData {
  timestamp: string;
  batteryLevel: number;
  solarPower: number;
  lightLevel: number;
  trapStatus: boolean;
}