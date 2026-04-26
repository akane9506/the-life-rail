import { useRef, useMemo } from "react";
import { folder, useControls } from "leva";
import { useAtomValue } from "jotai";
import * as THREE from "three";
import { Environment, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { debuggingModeAtom } from "@/atoms/canvasAtoms";
import {
  DAY_BG,
  NIGHT_BG,
  DAY_LENGTH,
  ENV_INTENSITIES,
  NIGHT_SUN_COLOR,
  DUSK_SUN_COLOR,
  DAY_SUN_COLOR,
} from "@/components/canvas/config";
import { useScalarControl } from "@/hooks/useScalarControl";

export default function CustomizedEnv() {
  const debuggingMode = useAtomValue(debuggingModeAtom);

  const bgColor = useMemo(() => new THREE.Color(NIGHT_BG), []);
  const timeRef = useRef<number>(-0.1); // we start from the dawn
  const prevTRef = useRef<number>(0);
  const sunAngleRef = useRef<number>(0);
  const sunRef = useRef<THREE.DirectionalLight>(null);

  // Manual controls
  const envBgColors = useControls({
    Environment: folder(
      {
        Background: folder({
          night: { value: NIGHT_BG.getStyle() },
          day: { value: DAY_BG.getStyle() },
        }),
      },
      { collapsed: !debuggingMode },
    ),
  });
  const currT = useScalarControl("Environment.Day Night", "t", {
    value: 0.0,
  });

  // SunLight Helper
  useHelper(
    debuggingMode && (sunRef as React.RefObject<THREE.DirectionalLight>),
    THREE.DirectionalLightHelper,
    4,
    "coral",
  );

  useFrame((state, delta) => {
    const scene = state.scene;
    const rawT = debuggingMode
      ? currT
      : (Math.sin(timeRef.current * Math.PI * 2) + 1.0) / 2.0;
    const t = THREE.MathUtils.smoothstep(rawT, 0.3, 0.7);

    // calculate sun angle
    const tDelta = Math.abs(t - prevTRef.current);
    sunAngleRef.current = (sunAngleRef.current + tDelta) % 2;
    prevTRef.current = t;
    // sun position control
    if (sunRef.current) {
      const angle = sunAngleRef.current * Math.PI - Math.PI / 2;
      sunRef.current.position.set(-20, Math.sin(angle) * 30, Math.cos(angle) * 30);
      sunRef.current.intensity = THREE.MathUtils.lerp(0, 1.5, Math.max(0, t));
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
    // BG color control
    bgColor.lerpColors(
      new THREE.Color(envBgColors.night),
      new THREE.Color(envBgColors.day),
      t,
    );
    state.scene.background = bgColor;
    timeRef.current = (timeRef.current + delta / DAY_LENGTH) % 1;
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <Environment preset="city" environmentIntensity={0.5} colorSpace="srgb-linear" />
      <directionalLight ref={sunRef} castShadow intensity={0} />
    </>
  );
}
