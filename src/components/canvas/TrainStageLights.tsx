import { useRef, useEffect } from "react";
import { useAtomValue } from "jotai";
import * as THREE from "three";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
import { useFrame } from "@react-three/fiber";
import { useHelper } from "@react-three/drei";
import { folder, useControls } from "leva";
import type { TrainParts } from "@/consts/chapters";
import { debuggingModeAtom } from "@/atoms/canvasAtoms";
import { useScalarControl } from "@/hooks/useScalarControl";
import { useVector3Control } from "@/hooks/useVectorControl";
import {
  STAGE_SPOTLIGHT_PARAMS,
  STAGE_AREALIGHT_PARAMS,
  AREALIGHT_DIMENSION,
} from "@/components/canvas/config";

type TrainStageLightsProps = {
  focusedPart: TrainParts;
  objectWorldPosition: THREE.Vector3;
};

const applyShifts = (position: THREE.Vector3, shifts: THREE.Vector3Like) => {
  position.x += shifts.x;
  position.y += shifts.y;
  position.z += shifts.z;
};

export default function TrainStageLights({
  focusedPart,
  objectWorldPosition,
}: TrainStageLightsProps) {
  const debuggingMode = useAtomValue(debuggingModeAtom);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const areaLightRef = useRef<THREE.RectAreaLight>(null);
  // for smooth light intensity transition
  const currentSpotIntensityRef = useRef(0);
  const currentAreaIntensityRef = useRef(0);
  const enableStageLight = focusedPart !== "head";

  // Helpers
  useHelper(
    debuggingMode && (spotLightRef as React.RefObject<THREE.SpotLight>),
    THREE.SpotLightHelper,
    "pink",
  );
  useHelper(
    debuggingMode && (areaLightRef as React.RefObject<THREE.RectAreaLight>),
    RectAreaLightHelper,
    "cyan",
  );

  // ====== Spotlight debugger ======
  useControls({
    "Train.Stage": folder(
      {
        Spotlight: folder({}, { collapsed: !debuggingMode }),
        Arealight: folder({}, { collapsed: !debuggingMode }),
      },
      { collapsed: !debuggingMode },
    ),
  });
  const debuggingSpotLightShift = useVector3Control("Train.Stage.Spotlight.shift", {
    x: STAGE_SPOTLIGHT_PARAMS.shift.x,
    y: STAGE_SPOTLIGHT_PARAMS.shift.y,
    z: STAGE_SPOTLIGHT_PARAMS.shift.z,
    min: -15,
    max: 20,
  });
  const debuggingSpotLightTargetShift = useVector3Control(
    "Train.Stage.Spotlight.targetShift",
    {
      x: STAGE_SPOTLIGHT_PARAMS.targetShift.x,
      y: STAGE_SPOTLIGHT_PARAMS.targetShift.y,
      z: STAGE_SPOTLIGHT_PARAMS.targetShift.z,
      min: -15,
      max: 20,
    },
  );
  const debuggingSpotLightColor = useControls("Train.Stage.Spotlight.color", {
    color: STAGE_SPOTLIGHT_PARAMS.color,
  });
  const debuggingSpotLightIntensity = useScalarControl(
    "Train.Stage.Spotlight.intensity",
    "intensity",
    { value: STAGE_SPOTLIGHT_PARAMS.intensity, min: 0, max: 3000 },
  );
  // ====== Spotlight debugger end ======

  // ====== Arealight debugger ======
  const debuggingAreaLightShift = useVector3Control("Train.Stage.Arealight.shift", {
    x: STAGE_AREALIGHT_PARAMS.shift.x,
    y: STAGE_AREALIGHT_PARAMS.shift.y,
    z: STAGE_AREALIGHT_PARAMS.shift.z,
    min: -15,
    max: 20,
  });
  const debuggingAreaLightTargetShift = useVector3Control(
    "Train.Stage.Arealight.targetShift",
    {
      x: STAGE_AREALIGHT_PARAMS.targetShift.x,
      y: STAGE_AREALIGHT_PARAMS.targetShift.y,
      z: STAGE_AREALIGHT_PARAMS.targetShift.z,
      min: -15,
      max: 20,
    },
  );
  const debuggingAreaLightColor = useControls("Train.Stage.Arealight.color", {
    color: STAGE_AREALIGHT_PARAMS.color,
  });
  const debuggingAreaLightIntensity = useScalarControl(
    "Train.Stage.Arealight.intensity",
    "intensity",
    { value: STAGE_AREALIGHT_PARAMS.intensity, min: 0, max: 3.0 },
  );
  // ====== Arealight debugger end ======

  // Realtime update effects
  const vectorDependencies = [
    ...Object.values(objectWorldPosition),
    ...Object.values(debuggingSpotLightShift),
    ...Object.values(debuggingSpotLightTargetShift),
    ...Object.values(debuggingAreaLightShift),
    ...Object.values(debuggingAreaLightTargetShift),
  ];
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.position.copy(objectWorldPosition); //bug in orbit control mode
      spotLightRef.current.target.position.copy(objectWorldPosition);
      // update spotlight position
      if (debuggingMode) {
        applyShifts(spotLightRef.current.position, debuggingSpotLightShift);
        applyShifts(spotLightRef.current.target.position, debuggingSpotLightTargetShift);
      } else {
        applyShifts(spotLightRef.current.position, STAGE_SPOTLIGHT_PARAMS.shift);
        applyShifts(
          spotLightRef.current.target.position,
          STAGE_SPOTLIGHT_PARAMS.targetShift,
        );
      }
      spotLightRef.current.target.updateMatrixWorld();
    }
    // update area light position
    if (areaLightRef.current) {
      areaLightRef.current.position.copy(objectWorldPosition);
      const arealightLookAt = objectWorldPosition.clone();
      if (debuggingMode) {
        applyShifts(areaLightRef.current.position, debuggingAreaLightShift);
        applyShifts(arealightLookAt, debuggingAreaLightTargetShift);
      } else {
        applyShifts(areaLightRef.current.position, STAGE_AREALIGHT_PARAMS.shift);
        applyShifts(arealightLookAt, STAGE_AREALIGHT_PARAMS.targetShift);
      }
      areaLightRef.current.lookAt(arealightLookAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedPart, debuggingMode, objectWorldPosition, ...vectorDependencies]);

  // Light intensity and smooth transition
  const spotlightIntensity = debuggingMode
    ? debuggingSpotLightIntensity
    : STAGE_SPOTLIGHT_PARAMS.intensity;
  const arealightIntensity = debuggingMode
    ? debuggingAreaLightIntensity
    : STAGE_AREALIGHT_PARAMS.intensity;

  useFrame((_, delta) => {
    const alpha = delta * 4; // controls transition speed
    // light intensity transition
    currentSpotIntensityRef.current = enableStageLight
      ? THREE.MathUtils.lerp(currentSpotIntensityRef.current, spotlightIntensity, alpha)
      : 0;
    currentAreaIntensityRef.current = enableStageLight
      ? THREE.MathUtils.lerp(currentAreaIntensityRef.current, arealightIntensity, alpha)
      : 0;
    if (spotLightRef.current)
      spotLightRef.current.intensity = enableStageLight
        ? currentSpotIntensityRef.current
        : 0;
    if (areaLightRef.current)
      areaLightRef.current.intensity = enableStageLight
        ? currentAreaIntensityRef.current
        : 0;
  });

  // Light colors
  const spotlightColor = debuggingMode
    ? debuggingSpotLightColor.color
    : STAGE_SPOTLIGHT_PARAMS.color;
  const areaLightColor = debuggingMode
    ? debuggingAreaLightColor.color
    : STAGE_AREALIGHT_PARAMS.color;

  return (
    <>
      <spotLight
        ref={spotLightRef}
        castShadow={enableStageLight}
        color={spotlightColor}
        distance={50}
        angle={Math.PI / 9}
        intensity={enableStageLight ? spotlightIntensity : 0}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
      <rectAreaLight
        ref={areaLightRef}
        width={AREALIGHT_DIMENSION.width}
        height={AREALIGHT_DIMENSION.height}
        color={areaLightColor}
        intensity={enableStageLight ? arealightIntensity : 0}
      />
    </>
  );
}
