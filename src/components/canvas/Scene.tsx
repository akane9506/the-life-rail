import { Environment } from "@react-three/drei";
import Train from "@/components/canvas/Train";

export default function Scene() {
  return (
    <>
      <color attach="background" args={["beige"]} />
      <Environment preset="forest" />
      <Train />
    </>
  );
}
