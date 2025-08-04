import React, { useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { useMockData } from './hooks/useMockData';
import { Bug } from 'lucide-react';

function App() {
  const { trapData, historicalData, updateTrapSettings } = useMockData();

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
          <Dashboard 
            trapData={trapData} 
            historicalData={historicalData}
            onUpdateSettings={updateTrapSettings}
          />
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