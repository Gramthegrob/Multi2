import React from 'react';
import { Power, Settings } from 'lucide-react';
import { TrapData } from '../types';

interface SimpleTrapControlsProps {
    trapData: TrapData;
    onUpdateSettings: (settings: Partial<TrapData['trap']>) => void;
}

export const SimpleTrapControls: React.FC<SimpleTrapControlsProps> = ({ trapData, onUpdateSettings }) => {
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
                        <div className={`p-2 rounded-lg ${trap.isOn ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                            <Power className={`h-5 w-5 ${trap.isOn ? 'text-green-400' : 'text-gray-400'}`} />
                        </div>
                        <div>
                            <span className="text-white font-medium">Power</span>
                            <p className="text-xs text-gray-400">Turn trap on/off</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onUpdateSettings({ isOn: !trap.isOn })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                            trap.isOn ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                    >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-lg ${
                    trap.isOn ? 'translate-x-7' : 'translate-x-1'
                }`}
            />
                    </button>
                </div>

                {/* Mode Selection */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 rounded-lg bg-purple-500/20">
                            <Settings className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <span className="text-white font-medium">Operating Mode</span>
                            <p className="text-xs text-gray-400">Control behavior</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {(['manual', 'auto', 'scheduled'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => onUpdateSettings({ mode })}
                                className={`px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    trap.mode === mode
                                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:scale-102'
                                }`}
                            >
                                <div className="capitalize">{mode}</div>
                                <div className="text-xs opacity-75 mt-1">
                                    {mode === 'manual' && 'Manual'}
                                    {mode === 'auto' && 'Light-based'}
                                    {mode === 'scheduled' && 'Time-based'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-sm text-gray-400">Current Status</span>
                    <div className="flex items-center space-x-3">
                        <div className={`h-3 w-3 rounded-full ${trap.isOn ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                        <span className={`text-sm font-medium ${trap.isOn ? 'text-green-400' : 'text-gray-500'}`}>
              {trap.isOn ? 'Active' : 'Inactive'}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
};