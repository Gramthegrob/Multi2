import React from 'react';
import { Power, Zap, Clock, Settings } from 'lucide-react';
import { TrapData } from '../types';

interface TrapControlsProps {
  trapData: TrapData;
  onUpdateSettings: (settings: Partial<TrapData['trap']>) => void;
}

export const TrapControls: React.FC<TrapControlsProps> = ({ trapData, onUpdateSettings }) => {
  const { trap } = trapData;

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-blue-400" />
        Trap Controls
      </h3>
      
      <div className="space-y-6">
        {/* Power Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Power className={`h-5 w-5 ${trap.isOn ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-white font-medium">Power</span>
          </div>
          <button
            onClick={() => onUpdateSettings({ isOn: !trap.isOn })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
              trap.isOn ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                trap.isOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Intensity Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-medium">Intensity</span>
            </div>
            <span className="text-sm text-gray-400">{trap.intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={trap.intensity}
            onChange={(e) => onUpdateSettings({ intensity: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={!trap.isOn}
          />
        </div>

        {/* Mode Selection */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-purple-400" />
            <span className="text-white font-medium">Mode</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['manual', 'auto', 'scheduled'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onUpdateSettings({ mode })}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  trap.mode === mode
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <span className="text-sm text-gray-400">Status</span>
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${trap.isOn ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className={`text-sm font-medium ${trap.isOn ? 'text-green-400' : 'text-gray-500'}`}>
              {trap.isOn ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};