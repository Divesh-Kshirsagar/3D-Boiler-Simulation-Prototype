import { MainScene } from './components/3d/MainScene';
import { Overlay } from './components/ui/Overlay';

function App() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <MainScene />
      <Overlay />
    </div>
  )
}

export default App

