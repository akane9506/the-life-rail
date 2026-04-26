import { Canvas } from "@react-three/fiber";
import Scene from "@/components/canvas/Scene";
import { DEFAULT_FOV } from "@/components/canvas/config";
function App() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: DEFAULT_FOV }} shadows>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
