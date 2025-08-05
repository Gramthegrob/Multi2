import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { SunMoonData } from '../types';

interface SunMoonArcProps {
    sunMoonData: SunMoonData;
}

export const SunMoonArc: React.FC<SunMoonArcProps> = ({ sunMoonData }) => {
    const { sunrise, sunset, currentTime, sunPosition, moonPosition, isDaytime } = sunMoonData;

    // Calculate arc path
    const centerX = 200;
    const centerY = 180;
    const radius = 150;

    const arcPath = `M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

    // Calculate sun position on arc
    const sunAngle = Math.PI * (sunPosition / 100);
    const sunX = centerX - radius * Math.cos(sunAngle);
    const sunY = centerY - radius * Math.sin(sunAngle);

    // Calculate moon position on arc
    const moonAngle = Math.PI * (moonPosition / 100);
    const moonX = centerX - radius * Math.cos(moonAngle);
    const moonY = centerY - radius * Math.sin(moonAngle);

    return (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-6 text-center">Day/Night Cycle</h3>

            <div className="relative">
                <svg width="400" height="220" viewBox="0 0 400 220" className="w-full">
                    {/* Background gradient */}
                    <defs>
                        <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isDaytime ? "#87CEEB" : "#1a1a2e"} />
                            <stop offset="100%" stopColor={isDaytime ? "#98D8E8" : "#16213e"} />
                        </linearGradient>

                        {/* Sun glow */}
                        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#FDB813" stopOpacity="0.8" />
                            <stop offset="70%" stopColor="#FDCB6E" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#FDCB6E" stopOpacity="0" />
                        </radialGradient>

                        {/* Moon glow */}
                        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#E17055" stopOpacity="0.6" />
                            <stop offset="70%" stopColor="#74B9FF" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#74B9FF" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Sky background */}
                    <rect width="400" height="180" fill="url(#skyGradient)" rx="12" />

                    {/* Horizon line */}
                    <line x1="50" y1="180" x2="350" y2="180" stroke="#4A5568" strokeWidth="2" />

                    {/* Arc path (invisible guide) */}
                    <path d={arcPath} fill="none" stroke="#4A5568" strokeWidth="1" strokeDasharray="5,5" opacity="0.3" />

                    {/* Sun glow effect */}
                    {isDaytime && (
                        <circle cx={sunX} cy={sunY} r="25" fill="url(#sunGlow)" opacity="0.6" />
                    )}

                    {/* Moon glow effect */}
                    {!isDaytime && (
                        <circle cx={moonX} cy={moonY} r="20" fill="url(#moonGlow)" opacity="0.6" />
                    )}

                    {/* Sun */}
                    <circle
                        cx={sunX}
                        cy={sunY}
                        r="12"
                        fill="#FDB813"
                        opacity={isDaytime ? 1 : 0.3}
                        className="drop-shadow-lg"
                    />

                    {/* Sun rays */}
                    {isDaytime && (
                        <g opacity="0.8">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                const rayLength = 8;
                                const rayAngle = (angle * Math.PI) / 180;
                                const rayX1 = sunX + Math.cos(rayAngle) * 15;
                                const rayY1 = sunY + Math.sin(rayAngle) * 15;
                                const rayX2 = sunX + Math.cos(rayAngle) * (15 + rayLength);
                                const rayY2 = sunY + Math.sin(rayAngle) * (15 + rayLength);

                                return (
                                    <line
                                        key={i}
                                        x1={rayX1}
                                        y1={rayY1}
                                        x2={rayX2}
                                        y2={rayY2}
                                        stroke="#FDB813"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                        </g>
                    )}

                    {/* Moon */}
                    <circle
                        cx={moonX}
                        cy={moonY}
                        r="10"
                        fill="#E17055"
                        opacity={!isDaytime ? 1 : 0.3}
                        className="drop-shadow-lg"
                    />

                    {/* Moon craters */}
                    {!isDaytime && (
                        <g opacity="0.6">
                            <circle cx={moonX - 3} cy={moonY - 2} r="1.5" fill="#D63031" />
                            <circle cx={moonX + 2} cy={moonY + 1} r="1" fill="#D63031" />
                            <circle cx={moonX - 1} cy={moonY + 3} r="0.8" fill="#D63031" />
                        </g>
                    )}

                    {/* Time markers */}
                    <text x="50" y="200" textAnchor="middle" className="text-xs fill-gray-400">6 AM</text>
                    <text x="200" y="200" textAnchor="middle" className="text-xs fill-gray-400">12 PM</text>
                    <text x="350" y="200" textAnchor="middle" className="text-xs fill-gray-400">6 PM</text>
                </svg>

                {/* Time information */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-1">
                            <Sun className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-400">Sunrise</span>
                        </div>
                        <span className="text-sm font-medium text-white">{sunrise}</span>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-1">
                            <div className={`h-3 w-3 rounded-full mr-1 ${isDaytime ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                            <span className="text-xs text-gray-400">Now</span>
                        </div>
                        <span className="text-sm font-medium text-white">{currentTime}</span>
                    </div>

                    <div className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center justify-center mb-1">
                            <Moon className="h-4 w-4 text-orange-400 mr-1" />
                            <span className="text-xs text-gray-400">Sunset</span>
                        </div>
                        <span className="text-sm font-medium text-white">{sunset}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};