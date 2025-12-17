# 3D Boiler Simulation Prototype

A real-time 3D simulation of an industrial boiler system designed for educational purposes. This project demonstrates complex system dynamics, thermodynamics, and interactive control using modern web technologies.

🔗 **Live Demo:** [https://3d-boiler-simulation-prototype.vercel.app/](https://3d-boiler-simulation-prototype.vercel.app/)

## 🚀 Features

- **Interactive 3D Visualization**: High-fidelity boiler representation using [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) and [Three.js](https://threejs.org/).
- **Real-time Physics Engine**: Simulates core thermodynamic properties:
  - **Pressure** (Bar)
  - **Temperature** (°C)
  - **Water Level** (%)
- **Operational Controls**: Adjust **Fuel Flow** to regulate system parameters.
- **Anomaly Simulation**: Train for emergency scenarios by triggering system faults:
  - 💧 **Leak**: Simulates water loss in the system.
  - ⚠️ **Overpressure Risk**: Simulates potential safety valve failures.
  - 📉 **Sensor Glitch**: Introduces realistic noise and unreliability in sensor readings.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics**: @react-three/fiber, @react-three/drei
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/Divesh-Kshirsagar/3D-Boiler-Simulation-Prototype.git
   cd 3D-Boiler-Simulation-Prototype
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the **MIT License**.
