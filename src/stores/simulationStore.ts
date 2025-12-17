import { create } from 'zustand';

interface SimulationState {
  // System Metrics
  pressure: number; // Bar
  temperature: number; // Celsius
  waterLevel: number; // Percentage 0-100
  fuelFlow: number; // 0-100% (Input)
  
  // Settings
  targetPressure: number;
  
  // Anomalies
  anomalies: {
    leak: boolean; // Water leak
    overpressureRisk: boolean; // Safety valve failure simulation
    sensorGlitch: boolean; // Random noise in readings
  };

  // Actions
  setFuelFlow: (value: number) => void;
  toggleAnomaly: (key: keyof SimulationState['anomalies']) => void;
  updatePhysics: (delta: number) => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  pressure: 10,
  temperature: 80,
  waterLevel: 60,
  fuelFlow: 20,
  targetPressure: 50,
  
  anomalies: {
    leak: false,
    overpressureRisk: false,
    sensorGlitch: false,
  },

  setFuelFlow: (value) => set({ fuelFlow: Math.max(0, Math.min(100, value)) }),

  toggleAnomaly: (key) => set((state) => ({
    anomalies: {
      ...state.anomalies,
      [key]: !state.anomalies[key]
    }
  })),

  updatePhysics: (delta) => {
    const s = get();
    
    // Physics Constants
    const HEAT_GAIN_RATE = 0.5; // Temp gain per % fuel per second
    const HEAT_LOSS_RATE = 0.1; // Temp loss to environment
    const PRESSURE_BUILD_RATE = 0.2; // Pressure bar per degree > 100
    const WATER_BOIL_RATE = 0.05; // Water loss per second at boiling
    const LEAK_RATE = 5.0; // Water loss per second if leaking due to anomaly
    
    // 1. Calculate Temperature Change
    // Temperature strives towards a max based on fuel flow.
    // Max Temp = 20 (ambient) + fuelFlow * 3 (max ~320C at 100% fuel)
    const targetTemp = 20 + s.fuelFlow * 3;
    const tempDiff = targetTemp - s.temperature;
    // Approach target
    let newTemp = s.temperature + tempDiff * delta * HEAT_GAIN_RATE;
    if (tempDiff < 0) {
        newTemp = s.temperature + tempDiff * delta * HEAT_LOSS_RATE;
    }

    // 2. Calculate Pressure Change
    // Pressure is related to Temperature (simplification for steam)
    // P = P_ambient + (Temp - 100) * K (only if T > 100)
    // We make it dynamic rather than purely calculating from temp to allow anomalies.
    
    let pressureChange = 0;
    if (newTemp > 100) {
      // Building pressure
      pressureChange += (newTemp - 100) * PRESSURE_BUILD_RATE * delta;
    } else {
      // Condensing / cooling
      pressureChange -= 10 * delta; // Drop quickly if cold
    }

    // Safety release (simplified): if pressure > 60 and NO overpressure anomaly, release it.
    if (s.pressure > 60 && !s.anomalies.overpressureRisk) {
       pressureChange -= 15 * delta; // Safety valve venting
    }

    let newPressure = Math.max(1, s.pressure + pressureChange);

    // 3. Water Level Change
    let waterChange = 0;
    if (newTemp > 100) {
        // Boiling away
        waterChange -= WATER_BOIL_RATE * (newTemp - 100) * 0.01 * delta;
    }
    
    if (s.anomalies.leak) {
        waterChange -= LEAK_RATE * delta;
    }

    // Auto-refill logic (simplified feedwater pump trying to keep it at 50%)
    // Unless we want manual refill. Let's say pump works if water < 50, but slow.
    if (s.waterLevel < 50) {
        waterChange += 2 * delta;
    }

    let newWaterLevel = Math.max(0, Math.min(100, s.waterLevel + waterChange));

    // Limit pressure if water is empty (no steam generation)
    if (newWaterLevel <= 0) {
        newPressure = Math.max(1, newPressure - 5 * delta);
    }
    
    // Sensor Glitch Anomaly: just adds visual noise, doesn't affect physics state here?
    // Actually store should hold "True State" and UI might read "Sensor State".
    // For simplicity, we just update the true state here. Glitches can be handled in UI or here.
    // Let's keep physics clean.

    set({
      temperature: newTemp,
      pressure: newPressure,
      waterLevel: newWaterLevel
    });
  }
}));
