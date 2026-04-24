import { Canvas } from "@react-three/fiber";
import Scene from "./components/canvas/Scene";
function App() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
