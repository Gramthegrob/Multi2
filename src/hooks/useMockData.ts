import { useState, useEffect, useCallback } from 'react';
import { TrapData, HistoricalData } from '../types';
import { thingSpeakService, ThingSpeakEntry } from '../services/thingspeak';

export const useThingSpeakData = () => {
  const [trapData, setTrapData] = useState<TrapData>({
    id: 'trap-001',
    name: 'Garden Mosquitto Trap',
    isOnline: false,
    isActive: false,
    battery: {
      level: 0,
      voltage: 0,
      isCharging: false,
    },
    solar: {
      voltage: 0,
      current: 0,
      power: 0,
    },
    ldr: {
      rawValue: 0,
      lightLevel: 'dark',
      percentage: 0,
    },
    trap: {
      isOn: false,
      intensity: 0,
      mode: 'manual',
    },
    lastUpdated: new Date().toISOString(),
    // Don't initialize temperature and humidity
  });

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert ThingSpeak entry to TrapData
  const convertThingSpeakEntry = (entry: ThingSpeakEntry): Partial<TrapData> => {
    const batteryLevel = entry.field1 ? parseFloat(entry.field1) : 0;
    const solarVoltage = entry.field2 ? parseFloat(entry.field2) : 0;
    const solarCurrent = entry.field3 ? parseFloat(entry.field3) : 0;
    const ldrRaw = entry.field4 ? parseInt(entry.field4) : 0;
    // Skip temperature and humidity parsing
    const trapStatus = entry.field7 ? parseInt(entry.field7) === 1 : false;
    const trapIntensity = entry.field8 ? parseInt(entry.field8) : 0;

    // Calculate derived values
    const solarPower = solarVoltage * solarCurrent;
    const batteryVoltage = 10.5 + (batteryLevel / 100) * 2.5; // Estimate 12V battery voltage
    const ldrPercentage = Math.round((ldrRaw / 1024) * 100);

    let lightLevel: 'dark' | 'dim' | 'bright' = 'dark';
    if (ldrPercentage > 70) lightLevel = 'bright';
    else if (ldrPercentage > 30) lightLevel = 'dim';

    return {
      battery: {
        level: batteryLevel,
        voltage: batteryVoltage,
        isCharging: solarPower > 5, // Assume charging if solar power > 5W
      },
      solar: {
        voltage: solarVoltage,
        current: solarCurrent,
        power: solarPower,
      },
      ldr: {
        rawValue: ldrRaw,
        lightLevel,
        percentage: ldrPercentage,
      },
      trap: {
        isOn: trapStatus,
        intensity: trapIntensity,
        mode: 'auto' as const,
      },
      lastUpdated: entry.created_at,
      isOnline: true,
      isActive: trapStatus,
    };
  };

  // Rest of your existing useThingSpeakData hook code remains the same...
  const fetchLatestData = useCallback(async () => {
    if (!thingSpeakService['config']?.channelId || !thingSpeakService['config']?.readApiKey ||
        thingSpeakService['config'].readApiKey === 'YOUR_READ_API_KEY') {
      setError('ThingSpeak not configured. Please set up your Channel ID and API keys.');
      setTrapData(prev => ({ ...prev, isOnline: false }));
      return;
    }

    try {
      setError(null);
      const latestEntry = await thingSpeakService.getLatestEntry();

      if (latestEntry) {
        const updatedData = convertThingSpeakEntry(latestEntry);
        setTrapData(prev => ({
          ...prev,
          ...updatedData,
        }));
      } else {
        setTrapData(prev => ({ ...prev, isOnline: false }));
      }
    } catch (err) {
      setError('Failed to fetch data from ThingSpeak');
      console.error('Error fetching latest data:', err);
      setTrapData(prev => ({ ...prev, isOnline: false }));
    }
  }, []);

  const fetchHistoricalData = useCallback(async () => {
    if (!thingSpeakService['config']?.channelId || !thingSpeakService['config']?.readApiKey ||
        thingSpeakService['config'].readApiKey === 'YOUR_READ_API_KEY') {
      return;
    }

    try {
      const channelData = await thingSpeakService.readChannelData(100);

      const historical: HistoricalData[] = channelData.feeds
          .filter(feed => feed.field1)
          .map(feed => ({
            timestamp: feed.created_at,
            batteryLevel: parseFloat(feed.field1 || '0'),
            solarPower: (parseFloat(feed.field2 || '0') * parseFloat(feed.field3 || '0')),
            lightLevel: Math.round((parseInt(feed.field4 || '0') / 1024) * 100),
            trapStatus: parseInt(feed.field7 || '0') === 1,
          }))
          .reverse();

      setHistoricalData(historical);
    } catch (err) {
      setError('Failed to fetch historical data from ThingSpeak');
      console.error('Error fetching historical data:', err);
    }
  }, []);

  const updateTrapSettings = useCallback(async (settings: Partial<TrapData['trap']>) => {
    if (!thingSpeakService['config']?.channelId || !thingSpeakService['config']?.writeApiKey ||
        thingSpeakService['config'].writeApiKey === 'YOUR_WRITE_API_KEY') {
      setError('ThingSpeak write API key not configured. Cannot send control commands.');
      return;
    }

    try {
      const writeData: Record<string, string | number> = {};

      if (settings.isOn !== undefined) {
        writeData.field7 = settings.isOn ? 1 : 0;
      }

      if (settings.intensity !== undefined) {
        writeData.field8 = settings.intensity;
      }

      const success = await thingSpeakService.writeData(writeData);

      if (success) {
        setTrapData(prev => ({
          ...prev,
          trap: { ...prev.trap, ...settings },
        }));

        setTimeout(fetchLatestData, 2000);
      } else {
        setError('Failed to update trap settings');
      }
    } catch (err) {
      setError('Failed to send control command to ThingSpeak');
      console.error('Error updating trap settings:', err);
    }
  }, [fetchLatestData]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLatestData(), fetchHistoricalData()]);
      setIsLoading(false);
    };

    initializeData();

    const pollInterval = setInterval(fetchLatestData, 20000);
    const historicalInterval = setInterval(fetchHistoricalData, 300000);

    return () => {
      clearInterval(pollInterval);
      clearInterval(historicalInterval);
    };
  }, [fetchLatestData, fetchHistoricalData]);

  return {
    trapData,
    historicalData,
    updateTrapSettings,
    isLoading,
    error,
    refreshData: fetchLatestData
  };
};