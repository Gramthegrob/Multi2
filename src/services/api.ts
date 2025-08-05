export interface TrapData {
    id: string;
    name: string;
    isOnline: boolean;
    ldr: {
        rawValue: number;
        lightLevel: 'dark' | 'dim' | 'bright';
        percentage: number;
    };
    trap: {
        isOn: boolean;
        mode: 'manual' | 'auto' | 'scheduled';
    };
    lastUpdated: string;
}

export interface SunMoonData {
    sunrise: string;
    sunset: string;
    currentTime: string;
    sunPosition: number; // 0-100 percentage across the arc
    moonPosition: number; // 0-100 percentage across the arc
    isDaytime: boolean;
}