import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ThingSpeakSetup } from './components/ThingSpeakSetup';
import { useThingSpeakData } from './hooks/useThingSpeakData';
import { thingSpeakService, defaultThingSpeakConfig } from './services/thingspeak';
import { Bug } from 'lucide-react';

function App() {
  const { trapData, historicalData, updateTrapSettings, isLoading, error } = useThingSpeakData();

  const handleConfigUpdate = (config: { channelId: string; readApiKey: string; writeApiKey: string }) => {
    // Update the ThingSpeak service configuration
    thingSpeakService['config'] = {
      ...defaultThingSpeakConfig,
      ...config
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('thingspeak-config', JSON.stringify(config));
    
    // Reload the page to reinitialize with new config
    window.location.reload();
  };

  useEffect(() => {
    // Load saved configuration from localStorage
    const savedConfig = localStorage.getItem('thingspeak-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        thingSpeakService['config'] = {
          ...defaultThingSpeakConfig,
          ...config
        };
      } catch (error) {
        console.error('Error loading saved ThingSpeak config:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0iIzM3NDE1MSIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHN2Zz4=')] opacity-20"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Bug className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Mosquitto Trap Controller</h1>
                  <p className="text-xs text-gray-400">IoT Monitoring & Control</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-gray-300">System Active</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* ThingSpeak Configuration */}
            <ThingSpeakSetup
              onConfigUpdate={handleConfigUpdate}
              currentConfig={{
                channelId: thingSpeakService['config']?.channelId || '',
                readApiKey: thingSpeakService['config']?.readApiKey || '',
                writeApiKey: thingSpeakService['config']?.writeApiKey || '',
              }}
            />

            {/* Error Display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">⚠️ {error}</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="ml-3 text-gray-400">Loading data from ThingSpeak...</span>
              </div>
            ) : (
              <Dashboard 
                trapData={trapData} 
                historicalData={historicalData}
                onUpdateSettings={updateTrapSettings}
              />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                © 2025 Mosquitto Trap Controller. Powered by ESP8266.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Device ID: {trapData.id}</span>
                <span>•</span>
                <span>Firmware v2.1.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;