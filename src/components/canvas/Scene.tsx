import { Center, Environment, OrbitControls } from "@react-three/drei";
import Train from "./Train";
// import { useThree } from "@react-three/fiber";

export default function Scene() {
  // const { camera } = useThree();

  return (
    <>
      <color attach="background" args={["beige"]} />
      <OrbitControls enableDamping={false} />
      <Environment preset="forest" />
      <Center>
        <Train />
      </Center>
    </>
  );
}
