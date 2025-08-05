import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { thingSpeakService } from '../services/thingspeak';

interface ThingSpeakConfig {
  channelId: string;
  readApiKey: string;
  writeApiKey: string;
}

export const ThingSpeakSetup: React.FC = () => {
  const [config, setConfig] = useState<ThingSpeakConfig>({
    channelId: '',
    readApiKey: '',
    writeApiKey: '',
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('thingspeak-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);

      // Update the service configuration
      thingSpeakService['config'] = {
        ...thingSpeakService['config'],
        ...parsed,
      };
    }
  }, []);

  const saveConfiguration = () => {
    localStorage.setItem('thingspeak-config', JSON.stringify(config));

    // Update the service configuration
    thingSpeakService['config'] = {
      ...thingSpeakService['config'],
      ...config,
    };

    setTestStatus('idle');
  };

  const testConnection = async () => {
    if (!config.channelId || !config.readApiKey) {
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');

    try {
      // Temporarily update service config for testing
      const originalConfig = { ...thingSpeakService['config'] };
      thingSpeakService['config'] = {
        ...thingSpeakService['config'],
        ...config,
      };

      const testData = await thingSpeakService.getLatestEntry();

      if (testData) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }

      // Restore original config
      thingSpeakService['config'] = originalConfig;
    } catch (error) {
      setTestStatus('error');
      console.error('ThingSpeak connection test failed:', error);
    }
  };

  const getStatusIcon = () => {
    switch (testStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const isConfigured = config.channelId && config.readApiKey && config.writeApiKey;

  return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50">
        <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Settings className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">ThingSpeak Configuration</h3>
              <p className="text-sm text-gray-400">
                {isConfigured ? 'Configured and ready' : 'Click to configure your ThingSpeak connection'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {isExpanded && (
            <div className="p-4 border-t border-slate-700/50 space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-2">Setup Instructions</h4>
                <ol className="text-xs text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Create a ThingSpeak account at <a href="https://thingspeak.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">thingspeak.com</a></li>
                  <li>Create a new channel with 6 fields:
                    <ul className="ml-4 mt-1 space-y-0.5 list-disc list-inside text-gray-400">
                      <li>Field 1: Battery Level (%)</li>
                      <li>Field 2: Solar Voltage (V)</li>
                      <li>Field 3: Solar Current (A)</li>
                      <li>Field 4: LDR Raw Value</li>
                      <li>Field 7: Trap Status (0/1)</li>
                      <li>Field 8: Trap Intensity (%)</li>
                    </ul>
                  </li>
                  <li>Copy your Channel ID and API Keys from the channel settings</li>
                </ol>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Channel ID
                  </label>
                  <input
                      type="text"
                      value={config.channelId}
                      onChange={(e) => setConfig(prev => ({ ...prev, channelId: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Read API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="password"
                        value={config.readApiKey}
                        onChange={(e) => setConfig(prev => ({ ...prev, readApiKey: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your channel's Read API Key"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Write API Key
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                        type="password"
                        value={config.writeApiKey}
                        onChange={(e) => setConfig(prev => ({ ...prev, writeApiKey: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your channel's Write API Key"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                    onClick={testConnection}
                    disabled={testStatus === 'testing' || !config.channelId || !config.readApiKey}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                </button>

                <button
                    onClick={saveConfiguration}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save Configuration
                </button>
              </div>

              {testStatus === 'success' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-sm text-green-400">✓ Connection successful! Your ThingSpeak channel is accessible.</p>
                  </div>
              )}

              {testStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-sm text-red-400">✗ Connection failed. Please check your Channel ID and Read API Key.</p>
                  </div>
              )}
            </div>
        )}
      </div>
  );
};