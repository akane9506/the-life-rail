import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, useMemo, useRef } from "react";
import { useButtonControl } from "@/hooks/useButtonControl";
import { focusOnObject, playAnimationOnce } from "@/components/canvas/utils";
import { PRESET_CAMERA_PARAMS, SPEED_FACTOR } from "@/components/canvas/config";

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
  const groupRef = useRef<THREE.Group>(null);
  const initializedRef = useRef<boolean>(false);
  const { animations, scene } = useGLTF("/models/train.glb");
  const { names, actions } = useAnimations(animations, groupRef);

  const [focusedPart, setFocusedPart] = useState<TrainParts>("head");
  const { position: presetCameraPosition, fov: presetCameraFov } =
    PRESET_CAMERA_PARAMS[focusedPart];

  // debugging
  useButtonControl("Train Focus", [
    { name: "Head", fn: () => setFocusedPart("head") },
    { name: "Horti", fn: () => setFocusedPart("horti") },
  ]);
  useButtonControl("Train Animation - Horti", [
    {
      name: "Open",
      fn: () => {
        if (names.length > 0 && names.includes("HortiOpen")) {
          const action = actions["HortiOpen"];
          playAnimationOnce(action);
        }
      },
    },
    {
      name: "Close",
      fn: () => {
        if (names.length > 0 && names.includes("HortiOpen")) {
          const action = actions["HortiOpen"];
          playAnimationOnce(action, true);
        }
      },
    },
  ]);

  // use vec3 to keep track on camera params
  const objectWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (scene) {
      const body = scene.getObjectByName(getPartName(focusedPart));
      if (!body || !presetCameraPosition) return; // early return if model loading failed
      const lerpAlpha = delta * SPEED_FACTOR;
      targetCameraPosition.copy(presetCameraPosition);
      // update camera
      focusOnObject(
        state,
        body,
        targetCameraPosition,
        objectWorldPosition,
        currentLookAt,
        presetCameraFov,
        lerpAlpha,
        initializedRef.current,
      );
      if (!initializedRef.current) initializedRef.current = true;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
