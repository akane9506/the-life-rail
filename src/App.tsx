import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Perf } from "r3f-perf";
import Scene from "@/components/canvas/Scene";
import { DEFAULT_FOV } from "@/components/canvas/config";
import Interaction from "@/components/overlay/Interaction";

const debug = window.location.hash === "#debug";

function App() {
  return (
    <div className="w-full h-full">
      <Leva hidden={!debug} />
      <Canvas camera={{ fov: DEFAULT_FOV }} shadows={{ type: THREE.PCFShadowMap }}>
        <Scene />
        {debug && <Perf position="bottom-right" />}
      </Canvas>
      <Interaction />
    </div>
  );
}

export default App;
