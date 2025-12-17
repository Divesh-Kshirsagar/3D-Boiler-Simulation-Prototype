import React from 'react';
import { useSimulationStore } from '../../stores/simulationStore';
import { AlertTriangle, Gauge, Droplet, Flame, Activity } from 'lucide-react';
import clsx from 'clsx';



export const Overlay: React.FC = () => {
  const { 
    pressure, temperature, waterLevel, fuelFlow, anomalies,
    setFuelFlow, toggleAnomaly 
  } = useSimulationStore();

  return (
    <div className="absolute inset-0 z-50 pointer-events-none p-6 flex flex-col justify-between text-cyan-400 font-mono select-none" style={{ background: 'radial-gradient(circle, transparent 60%, rgba(0,0,0,0.8) 100%)' }}>
      
      {/* Header */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
           <h1 className="text-2xl font-bold tracking-widest border-b-2 border-cyan-500 pb-1 mb-2">B.I.M.C.S | Digital Twin</h1>
           <div className="text-xs text-cyan-600 flex gap-4">
             <span>• LIVE RUN</span>
             <span>DB: Connected</span>
             <span>TICK: 60hz</span>
           </div>
        </div>
        
        {/* Top Right Dashboards */}
        <div className="flex gap-4">
           {/* Pressure Card */}
           <div className={clsx("bg-black/80 border border-cyan-500/50 p-4 rounded min-w-[180px]", pressure > 65 && "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]")}>
              <div className="flex items-center gap-2 text-sm text-cyan-300 mb-1">
                 <Gauge size={16} /> <span>Drum Pressure</span>
              </div>
              <div className={clsx("text-4xl font-bold", pressure > 60 ? "text-red-500 animate-pulse" : "text-white")}>
                {pressure.toFixed(1)} <span className="text-sm text-gray-400 font-normal">Bar</span>
              </div>
           </div>

           {/* Water Level Card */}
           <div className={clsx("bg-black/80 border border-cyan-500/50 p-4 rounded min-w-[180px]", waterLevel < 20 && "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]")}>
              <div className="flex items-center gap-2 text-sm text-cyan-300 mb-1">
                 <Droplet size={16} /> <span>Water Level</span>
              </div>
              <div className={clsx("text-4xl font-bold", waterLevel < 20 ? "text-red-500 animate-pulse" : "text-white")}>
                {waterLevel.toFixed(0)} <span className="text-sm text-gray-400 font-normal">%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Center - Alert Area (Only visible on critical fault) */}
      {(anomalies.leak || anomalies.overpressureRisk || pressure > 70) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <div className="border-4 border-red-600 bg-red-900/40 text-red-500 p-8 rounded text-center backdrop-blur-sm animate-pulse">
              <AlertTriangle size={64} className="mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-2">CRITICAL FAULT</h2>
              <p className="text-xl">{anomalies.leak ? "CONTAINMENT BREACH DETECTED" : "OVERPRESSURE DANGER"}</p>
           </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex gap-6 items-end pointer-events-auto z-50">
         
         {/* PID / Manual Control */}
         <div className="bg-black/80 border border-cyan-500/50 p-4 rounded w-80">
            <div className="text-sm text-cyan-300 mb-4 flex items-center gap-2 border-b border-cyan-800 pb-2">
               <Activity size={16} /> MANUAL OVERRIDE
            </div>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                     <span className="flex items-center gap-1"><Flame size={12}/> Fuel Flow Control</span>
                     <span>{fuelFlow.toFixed(0)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={fuelFlow} 
                    onChange={(e) => setFuelFlow(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
               </div>

               <div className="text-xs text-gray-500 mt-2">
                  <div className="flex justify-between mb-1">
                    <span>Temp</span>
                    <span className="text-white">{temperature.toFixed(0)}°C</span>
                  </div>
                  {/* Temp Bar */}
                  <div className="w-full bg-gray-700 h-1 mt-1">
                     <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${Math.min(100, temperature / 3)}%` }}></div>
                  </div>
               </div>
            </div>
         </div>

         {/* AI Command Center / Anomalies */}
         <div className="bg-black/80 border border-cyan-500/50 p-4 rounded w-96">
            <div className="text-sm text-cyan-300 mb-4 flex items-center gap-2 border-b border-cyan-800 pb-2">
                SIMULATION ANOMALIES (INJECT FAULTS)
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <button 
                  onClick={() => toggleAnomaly('leak')}
                  className={clsx(
                    "p-3 text-xs border rounded transition-all flex flex-col items-center gap-2",
                    anomalies.leak 
                      ? "bg-red-900/50 border-red-500 text-red-200" 
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                  )}
               >
                  <Droplet size={20} />
                  <span>PIPE LEAK</span>
                  {anomalies.leak && <span className="text-[10px] animate-pulse">ACTIVE</span>}
               </button>

               <button 
                  onClick={() => toggleAnomaly('overpressureRisk')}
                  className={clsx(
                    "p-3 text-xs border rounded transition-all flex flex-col items-center gap-2",
                    anomalies.overpressureRisk 
                      ? "bg-red-900/50 border-red-500 text-red-200" 
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                  )}
               >
                  <Gauge size={20} />
                  <span>VALVE FAILURE</span>
                  {anomalies.overpressureRisk && <span className="text-[10px] animate-pulse">FIXED CLOSED</span>}
               </button>

               <button 
                  onClick={() => toggleAnomaly('sensorGlitch')}
                  className={clsx(
                    "p-3 text-xs border rounded transition-all flex flex-col items-center gap-2",
                    anomalies.sensorGlitch
                      ? "bg-yellow-900/50 border-yellow-500 text-yellow-200" 
                      : "bg-gray-900 border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400"
                  )}
               >
                  <Activity size={20} />
                  <span>SENSOR NOISE</span>
                  {anomalies.sensorGlitch && <span className="text-[10px] animate-pulse">ACTIVE</span>}
               </button>
            </div>
            
            <div className="mt-4 text-[10px] text-gray-500 border-t border-gray-800 pt-2 font-mono">
               &gt; AI Confidence: 98% <br/>
               &gt; System stable. Optimizing fuel flow.
            </div>
         </div>

      </div>
    </div>
  );
};



