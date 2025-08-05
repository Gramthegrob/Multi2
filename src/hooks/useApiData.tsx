import { useState, useEffect, useCallback } from 'react';
import { TrapData, SunMoonData } from '../types';
import { apiService, TrapApiData, SunMoonApiData } from '../services/api';

// Mock data for development (remove when backend is ready)
const mockTrapData: TrapApiData = {
    lightLevel: 25,
    lightStatus: 'dim',
    rawValue: 256,
    trapIsOn: true,
    trapMode: 'auto',
    lastUpdated: new Date().toISOString(),
    isOnline: true,
};

const mockSunMoonData: SunMoonApiData = {
    sunrise: '06:30',
    sunset: '18:45',
    currentTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }),
    sunPosition: 65,
    moonPosition: 15,
    isDaytime: true,
};

export const useApiData = () => {
    const [trapData, setTrapData] = useState<TrapData>({
        id: 'trap-001',
        name: 'Garden Mosquitto Trap',
        isOnline: false,
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
    });

    const [sunMoonData, setSunMoonData] = useState<SunMoonData>({
        sunrise: '06:30',
        sunset: '18:45',
        currentTime: '12:00',
        sunPosition: 50,
        moonPosition: 0,
        isDaytime: true,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Convert API data to app data format
    const convertApiData = (apiData: TrapApiData): TrapData => ({
        id: 'trap-001',
        name: 'Garden Mosquitto Trap',
        isOnline: apiData.isOnline,
        ldr: {
            rawValue: apiData.rawValue,
            lightLevel: apiData.lightStatus,
            percentage: apiData.lightLevel,
        },
        trap: {
            isOn: apiData.trapIsOn,
            mode: apiData.trapMode,
        },
        lastUpdated: apiData.lastUpdated,
    });

    const convertSunMoonApiData = (apiData: SunMoonApiData): SunMoonData => ({
        sunrise: apiData.sunrise,
        sunset: apiData.sunset,
        currentTime: apiData.currentTime,
        sunPosition: apiData.sunPosition,
        moonPosition: apiData.moonPosition,
        isDaytime: apiData.isDaytime,
    });

    // Fetch trap data
    const fetchTrapData = useCallback(async () => {
        try {
            setError(null);

            // Use mock data for now - replace with actual API call when backend is ready
            // const response = await apiService.getTrapData();

            // Mock response for development
            const response = { success: true, data: mockTrapData };

            if (response.success && response.data) {
                const convertedData = convertApiData(response.data);
                setTrapData(convertedData);
            } else {
                setError(response.error || 'Failed to fetch trap data');
                setTrapData(prev => ({ ...prev, isOnline: false }));
            }
        } catch (err) {
            setError('Network error while fetching trap data');
            console.error('Error fetching trap data:', err);
            setTrapData(prev => ({ ...prev, isOnline: false }));
        }
    }, []);

    // Fetch sun/moon data
    const fetchSunMoonData = useCallback(async () => {
        try {
            // Use mock data for now - replace with actual API call when backend is ready
            // const response = await apiService.getSunMoonData();

            // Update current time for mock data
            const currentTime = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });

            const currentHour = new Date().getHours();
            const isDaytime = currentHour >= 6 && currentHour < 19;

            // Calculate sun position based on time (6 AM = 0%, 6 PM = 100%)
            const sunPosition = isDaytime ? Math.max(0, Math.min(100, ((currentHour - 6) / 12) * 100)) : 0;
            const moonPosition = !isDaytime ? Math.max(0, Math.min(100, ((currentHour + 6) % 24) / 12 * 100)) : 0;

            const mockData = {
                ...mockSunMoonData,
                currentTime,
                sunPosition,
                moonPosition,
                isDaytime,
            };

            const response = { success: true, data: mockData };

            if (response.success && response.data) {
                const convertedData = convertSunMoonApiData(response.data);
                setSunMoonData(convertedData);
            }
        } catch (err) {
            console.error('Error fetching sun/moon data:', err);
        }
    }, []);

    // Update trap settings
    const updateTrapSettings = useCallback(async (settings: Partial<TrapData['trap']>) => {
        try {
            setError(null);

            // Use mock update for now - replace with actual API call when backend is ready
            // const response = await apiService.updateTrapSettings(settings);

            // Mock successful response
            const response = { success: true };

            if (response.success) {
                // Update local state immediately for better UX
                setTrapData(prev => ({
                    ...prev,
                    trap: { ...prev.trap, ...settings },
                }));

                // Fetch latest data after a short delay to confirm the update
                setTimeout(fetchTrapData, 1000);
            } else {
                setError(response.error || 'Failed to update trap settings');
            }
        } catch (err) {
            setError('Network error while updating trap settings');
            console.error('Error updating trap settings:', err);
        }
    }, [fetchTrapData]);

    // Initialize data and set up polling
    useEffect(() => {
        const initializeData = async () => {
            setIsLoading(true);
            await Promise.all([fetchTrapData(), fetchSunMoonData()]);
            setIsLoading(false);
        };

        initializeData();

        // Set up polling for real-time updates
        const trapDataInterval = setInterval(fetchTrapData, 10000); // Every 10 seconds
        const sunMoonInterval = setInterval(fetchSunMoonData, 60000); // Every minute

        return () => {
            clearInterval(trapDataInterval);
            clearInterval(sunMoonInterval);
        };
    }, [fetchTrapData, fetchSunMoonData]);

    return {
        trapData,
        sunMoonData,
        updateTrapSettings,
        isLoading,
        error,
        refreshData: fetchTrapData,
    };
};