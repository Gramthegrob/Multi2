import React, { useEffect } from 'react';
import { Bug, Wifi } from 'lucide-react';
import { LightLevelCard } from './components/LightLevelCard';
import { SimpleTrapControls } from './components/SimpleTrapControls';
import { SunMoonArc } from './components/SunMoonArc';
import { useApiData } from './hooks/useApiData';

function App() {
  const { trapData, sunMoonData, updateTrapSettings, isLoading, error } = useApiData();

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Bug className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Mosquitto Trap Controller</h1>
                    <p className="text-xs text-gray-400">Light Monitoring & Control</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`h-3 w-3 rounded-full ${trapData.isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    <span className={`text-sm font-medium ${trapData.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                    {trapData.isOnline ? 'Online' : 'Offline'}
                  </span>
                    <Wifi className={`h-4 w-4 ${trapData.isOnline ? 'text-green-400' : 'text-red-400'}`} />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Device Info */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{trapData.name}</h2>
                <p className="text-gray-400">Last updated: {new Date(trapData.lastUpdated).toLocaleString()}</p>
              </div>

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
                    <span className="ml-3 text-gray-400">Loading trap data...</span>
                  </div>
              ) : (
                  <div className="space-y-6">
                    {/* Sun/Moon Arc */}
                    <SunMoonArc sunMoonData={sunMoonData} />

                    {/* Main Controls Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Light Level Card */}
                      <LightLevelCard
                          lightLevel={trapData.ldr.percentage}
                          lightStatus={trapData.ldr.lightLevel}
                          rawValue={trapData.ldr.rawValue}
                      />

                      {/* Trap Controls */}
                      <SimpleTrapControls
                          trapData={trapData}
                          onUpdateSettings={updateTrapSettings}
                      />
                    </div>
                  </div>
              )}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm mt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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