import { useMemo, useRef } from "react";
import { Environment } from "@react-three/drei";
import Train from "@/components/canvas/Train";
import { useFrame } from "@react-three/fiber";
import {
  DAY_BG,
  NIGHT_BG,
  DAY_LENGTH,
  ENV_INTENSITIES,
  NIGHT_SUN_COLOR,
  DUSK_SUN_COLOR,
  DAY_SUN_COLOR,
} from "./config";
import * as THREE from "three";
import { useScalarControl } from "@/hooks/useScalarControl";
import { useButtonControl } from "@/hooks/useButtonControl";
import { useControls } from "leva";
import { useAtom } from "jotai";
import { debuggingModeAtom } from "@/atoms/canvasAtoms";

export default function Scene() {
  const timeRef = useRef<number>(0);
  const prevTRef = useRef<number>(0);
  const sunAngleRef = useRef<number>(0);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const [debuggingMode, setDebuggingMode] = useAtom(debuggingModeAtom);

  useButtonControl("Debugging", [
    { name: "Toggle", fn: () => setDebuggingMode((prev) => !prev) },
  ]);
  const currT = useScalarControl("Environment.Day Night", "t", {
    value: 0.0,
  });
  const envBgColors = useControls("Environment.BG", {
    night: { value: NIGHT_BG.getStyle() },
    day: { value: DAY_BG.getStyle() },
  });
  const bgColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    timeRef.current = (timeRef.current + delta / DAY_LENGTH) % 1;
    const scene = state.scene;
    const rawT = debuggingMode
      ? currT
      : (Math.sin(timeRef.current * Math.PI * 2) + 1.0) / 2.0;

    const t = THREE.MathUtils.smoothstep(rawT, 0.3, 0.7);

    // BG color control
    bgColor.lerpColors(
      new THREE.Color(envBgColors.night),
      new THREE.Color(envBgColors.day),
      t,
    );
    state.scene.background = bgColor;

    // calculate sun angle
    const tDelta = Math.abs(t - prevTRef.current);
    sunAngleRef.current = (sunAngleRef.current + tDelta) % 2;
    prevTRef.current = t;
    // sun position control
    if (sunRef.current) {
      const angle = sunAngleRef.current * Math.PI - Math.PI / 2;
      sunRef.current.position.set(-20, Math.sin(angle) * 30, Math.cos(angle) * 30);
      sunRef.current.intensity = THREE.MathUtils.lerp(0, 1.5, Math.max(0, t));
      // console.log(angle);
    }

    // environment intensity control
    if (scene instanceof THREE.Scene && scene.environmentIntensity) {
      const envIntensity = THREE.MathUtils.lerp(
        ENV_INTENSITIES[0],
        ENV_INTENSITIES[1],
        t,
      );
      scene.environmentIntensity = envIntensity;
      const isRaising = sunAngleRef.current < 1;
      sunRef.current?.color.lerpColors(
        isRaising ? NIGHT_SUN_COLOR : DUSK_SUN_COLOR,
        DAY_SUN_COLOR,
        t,
      );
    }
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {/* <OrbitControls /> */}
      {/* <axesHelper args={[10]} /> */}
      <Environment preset="city" environmentIntensity={0.5} colorSpace="srgb-linear" />
      <directionalLight ref={sunRef} castShadow intensity={0} />
      <Train />
    </>
  );
}
