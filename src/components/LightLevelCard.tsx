import React from 'react';
import { Eye } from 'lucide-react';

interface LightLevelCardProps {
    lightLevel: number;
    lightStatus: 'dark' | 'dim' | 'bright';
    rawValue: number;
}

export const LightLevelCard: React.FC<LightLevelCardProps> = ({
                                                                  lightLevel,
                                                                  lightStatus,
                                                                  rawValue
                                                              }) => {
    const getStatusColor = () => {
        switch (lightStatus) {
            case 'bright': return 'text-yellow-400';
            case 'dim': return 'text-orange-400';
            case 'dark': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    const getStatusBg = () => {
        switch (lightStatus) {
            case 'bright': return 'bg-yellow-500/10 border-yellow-500/20';
            case 'dim': return 'bg-orange-500/10 border-orange-500/20';
            case 'dark': return 'bg-blue-500/10 border-blue-500/20';
            default: return 'bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className={`rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${getStatusBg()}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${lightStatus === 'bright' ? 'bg-yellow-500/20' : lightStatus === 'dim' ? 'bg-orange-500/20' : 'bg-blue-500/20'}`}>
                    <Eye className={`h-6 w-6 ${getStatusColor()}`} />
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Raw Value</div>
                    <div className="text-sm text-gray-300">{rawValue}/1024</div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400 font-medium">Light Level</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBg()} ${getStatusColor()} font-medium`}>
            {lightStatus.toUpperCase()}
          </span>
                </div>

                <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-bold text-white">{lightLevel}</span>
                    <span className="text-sm text-gray-400">%</span>
                </div>

                {/* Light level bar */}
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                            lightStatus === 'bright' ? 'bg-yellow-400' :
                                lightStatus === 'dim' ? 'bg-orange-400' : 'bg-blue-400'
                        }`}
                        style={{ width: `${lightLevel}%` }}
                    />
                </div>
            </div>
        </div>
    );
};