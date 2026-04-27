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
  DAY_BG_DIM,
  DIM_FACTOR,
} from "@/components/canvas/config";
import { useScalarControl } from "@/hooks/useScalarControl";
import { trainFocusAtom } from "@/atoms/trainAtoms";

export default function WorldEnvironment() {
  const debuggingMode = useAtomValue(debuggingModeAtom);
  const focusedPart = useAtomValue(trainFocusAtom);
  const dimEnv = focusedPart !== "head";

  // Refs for the day-night transition
  const bgColor = useMemo(() => new THREE.Color(NIGHT_BG), []);
  const dayBgColor = useMemo(() => new THREE.Color(DAY_BG), []);
  const timeRef = useRef<number>(-0.1); // we start from the dawn
  const dimTRef = useRef<number>(0);
  const prevTRef = useRef<number>(0);
  const sunAngleRef = useRef<number>(0);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  // SunLight Helper
  useHelper(
    debuggingMode && (sunLightRef as React.RefObject<THREE.DirectionalLight>),
    THREE.DirectionalLightHelper,
    4,
    "coral",
  );

  // Environment background color (day-night transition)
  const envBgColors = useControls({
    Environment: folder(
      {
        Background: folder({
          night: { value: NIGHT_BG.getStyle() },
          day: { value: DAY_BG.getStyle() },
          dayDim: { value: DAY_BG_DIM.getStyle() },
        }),
      },
      { collapsed: !debuggingMode },
    ),
  });
  const currT = useScalarControl("Environment.Day Night", "t", {
    value: 0.0,
  });

  const dayColor = new THREE.Color(debuggingMode ? envBgColors.day : DAY_BG);
  const dayDimColor = new THREE.Color(debuggingMode ? envBgColors.dayDim : DAY_BG_DIM);
  const nightBgColor = new THREE.Color(debuggingMode ? envBgColors.night : NIGHT_BG);

  useFrame((state, delta) => {
    const scene = state.scene;
    const rawT = debuggingMode
      ? currT
      : (Math.sin(timeRef.current * Math.PI * 2) + 1.0) / 2.0;
    const t = THREE.MathUtils.smoothstep(rawT, 0.3, 0.7);
    // tDelta helps transform dark-bright transition to day-night (sun-raise-set) loop
    const tDelta = Math.abs(t - prevTRef.current);
    sunAngleRef.current = (sunAngleRef.current + tDelta) % 2;
    prevTRef.current = t;

    // calculate sun angle
    if (sunLightRef.current) {
      const angle = sunAngleRef.current * Math.PI - Math.PI / 2;
      sunLightRef.current.position.set(-20, Math.sin(angle) * 30, Math.cos(angle) * 30);
      sunLightRef.current.intensity = THREE.MathUtils.lerp(
        0,
        1.5 - (dimEnv ? DIM_FACTOR : 0),
        Math.max(0, t),
      );
    }

    // environment intensity control
    if (scene instanceof THREE.Scene && scene.environmentIntensity) {
      const envIntensity = THREE.MathUtils.lerp(
        ENV_INTENSITIES[0],
        ENV_INTENSITIES[1] - (dimEnv ? DIM_FACTOR : 0),
        t,
      );
      scene.environmentIntensity = envIntensity;
      const isRaising = sunAngleRef.current < 1;
      sunLightRef.current?.color.lerpColors(
        isRaising ? NIGHT_SUN_COLOR : DUSK_SUN_COLOR,
        DAY_SUN_COLOR,
        t,
      );
    }

    // BG color transition
    dimTRef.current = THREE.MathUtils.lerp(dimTRef.current, dimEnv ? 1 : 0, delta * 2);
    dayBgColor.lerpColors(dayColor, dayDimColor, dimTRef.current);
    bgColor.lerpColors(nightBgColor, dayBgColor, t);
    state.scene.background = bgColor;

    // finally update the time ref
    timeRef.current = (timeRef.current + delta / DAY_LENGTH) % 1;
  });

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <Environment preset="city" colorSpace="srgb-linear" />
      <directionalLight ref={sunLightRef} />
    </>
  );
}
