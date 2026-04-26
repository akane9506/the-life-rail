import { useAtom } from "jotai";
import { debuggingModeAtom, orbitControlAtom } from "@/atoms/canvasAtoms";
import { useButtonControl } from "@/hooks/useButtonControl";
import Train from "@/components/canvas/Train";
import CustomizedEnv from "./CustomizedEnv";
import { OrbitControls } from "@react-three/drei";

export default function Scene() {
  const [debuggingMode, setDebuggingMode] = useAtom(debuggingModeAtom);
  const [orbitControlMode, setOrbitControlMode] = useAtom(orbitControlAtom);

  // Manual controls
  useButtonControl("Manual", [
    { name: "Debugging", fn: () => setDebuggingMode((prev) => !prev) },
    { name: "Orbit Control", fn: () => setOrbitControlMode((prev) => !prev) },
  ]);

  return (
    <>
      {debuggingMode && <axesHelper args={[10]} />}
      {orbitControlMode && <OrbitControls enableDamping={false} />}
      <CustomizedEnv />
      <Train />
    </>
  );
}
