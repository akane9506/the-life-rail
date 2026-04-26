import { useAnimations, useGLTF, useHelper } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, useMemo, useRef } from "react";
import { useButtonControl } from "@/hooks/useButtonControl";
import {
  focusOnObject,
  playHortiOpenAnimation,
  playLoopAnimations,
} from "@/components/canvas/utils";
import { PRESET_CAMERA_PARAMS, SPEED_FACTOR } from "@/components/canvas/config";
import { useVector3Control } from "@/hooks/useVectorControl";
import { useAtomValue } from "jotai";
import { debuggingModeAtom, orbitControlAtom } from "@/atoms/canvasAtoms";
import { useControls, folder } from "leva";

type TrainParts = "head" | "horti";

const getPartName = (part: TrainParts) => {
  switch (part) {
    case "horti":
      return "HortiBody";
    default:
      return "HeadBody";
  }
};

export default function Train() {
  const debuggingMode = useAtomValue(debuggingModeAtom);
  const orbitControlMode = useAtomValue(orbitControlAtom);
  const { animations, scene } = useGLTF("/models/train.glb");

  const focusedRoot = scene.getObjectByName("Horticulturist");
  focusedRoot?.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  const [focusedPart, setFocusedPart] = useState<TrainParts>("head");
  const initializedRef = useRef<boolean>(false);
  const groupRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const { names, actions } = useAnimations(animations, groupRef);

  // use memoed vec3s to keep track on camera params
  const objectWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);
  const targetCameraShift = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);

  const {
    position: presetCameraPosition,
    fov: presetCameraFov,
    shift: presetCameraShift,
  } = PRESET_CAMERA_PARAMS[focusedPart];

  // Manual controls
  useControls({ Camera: folder({}, { collapsed: !debuggingMode }) }); // collapse folder
  const debuggingCameraPosition = useVector3Control("Camera.Position", {
    x: presetCameraPosition.x,
    y: presetCameraPosition.y,
    z: presetCameraPosition.z,
  });
  const debuggingCameraShift = useVector3Control("Camera.Shift", {
    x: presetCameraShift.x,
    y: presetCameraShift.y,
    z: presetCameraShift.z,
    max: 10,
    min: -10,
  });
  useButtonControl("Train.Focus", [
    { name: "Head", fn: () => setFocusedPart("head") },
    { name: "Horticulturist", fn: () => setFocusedPart("horti") },
  ]);

  useHelper(
    debuggingMode && (spotLightRef as React.RefObject<THREE.SpotLight>),
    THREE.SpotLightHelper,
    4,
  );

  useFrame((state, delta) => {
    if (scene) {
      const target = scene.getObjectByName(getPartName(focusedPart));
      if (!target || !presetCameraPosition) return; // early return if model loading failed
      const lerpAlpha = delta * SPEED_FACTOR;
      targetCameraPosition.copy(
        debuggingMode ? debuggingCameraPosition : presetCameraPosition,
      );
      targetCameraShift.copy(debuggingMode ? debuggingCameraShift : presetCameraShift);

      if (spotLightRef.current) {
        spotLightRef.current.position.copy(objectWorldPosition); //bug in orbit control mode
        spotLightRef.current.position.x -= 8;
        spotLightRef.current.position.y += 11;
        spotLightRef.current.target.position.copy(objectWorldPosition);
        spotLightRef.current.target.position.x += 1;
        spotLightRef.current.target.position.y += 1;
        spotLightRef.current.target.updateMatrixWorld();
      }

      // update camera
      if (!orbitControlMode) {
        focusOnObject(
          state,
          target,
          targetCameraPosition,
          targetCameraShift,
          objectWorldPosition,
          currentLookAt,
          presetCameraFov,
          lerpAlpha,
          initializedRef.current,
        );
      }

      // play/stop repeated animation
      playLoopAnimations(focusedPart, scene, delta);

      if (names.length > 0 && names.includes("HortiOpen")) {
        const action = actions["HortiOpen"];
        if (!action) return;
        playHortiOpenAnimation(focusedPart, action);
      }

      // should be at the end of the first frame, otherwise will cause strange transition
      if (!initializedRef.current) initializedRef.current = true;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <spotLight
        ref={spotLightRef}
        castShadow
        args={["#ffffff"]}
        distance={20}
        angle={Math.PI / 9}
        intensity={400}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.001}
      />
    </group>
  );
}
