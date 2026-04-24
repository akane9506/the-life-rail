import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useState, useMemo, useRef } from "react";
import { useButtonControl } from "@/hooks/useButtonControl";
import { useVector3Control } from "@/hooks/useVectorControl";

type TrainParts = "head" | "horti";
const presetPositions = {
  head: { x: 15.1, y: 12.6, z: 12.7 },
  horti: { x: -5.5, y: 0.5, z: 0.0 },
};
const getPartName = (part: TrainParts) => {
  switch (part) {
    case "horti":
      return "HortiBody";
    default:
      return "HeadBody";
  }
};

const speedFactor = 5;

const playAnimationOnce = (
  action: THREE.AnimationAction | null,
  reverse: boolean = false,
) => {
  if (!action) return;
  action.paused = false;
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;
  action.timeScale = reverse ? -1 : 1;
  action.play();
};

export default function Train() {
  const groupRef = useRef<THREE.Group>(null);
  const initializedRef = useRef<boolean>(false);
  const { animations, scene } = useGLTF("/models/train.glb");
  const { names, actions } = useAnimations(animations, groupRef);

  const [focusedPart, setFocusedPart] = useState<TrainParts>("head");
  const presetCameraPos = presetPositions[focusedPart];
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
  useVector3Control("Camera Position");

  const objectWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const targetCameraPosition = useMemo(() => new THREE.Vector3(), []);
  const currentLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (scene) {
      const body = scene.getObjectByName(getPartName(focusedPart));
      if (!body) return;
      // let the camera always follow the focused object
      body.getWorldPosition(objectWorldPosition);
      const lookAtPosition = new THREE.Vector3(
        objectWorldPosition.x,
        objectWorldPosition.y + 2,
        objectWorldPosition.z,
      );

      targetCameraPosition.set(presetCameraPos.x, presetCameraPos.y, presetCameraPos.z);
      targetCameraPosition.applyMatrix4(body.matrixWorld);

      const speed = delta * speedFactor;
      if (!initializedRef.current) {
        state.camera.position.copy(targetCameraPosition);
      } else {
        state.camera.position.lerp(targetCameraPosition, speed);
      }
      if (!initializedRef.current) {
        currentLookAt.copy(lookAtPosition);
      } else {
        currentLookAt.lerp(lookAtPosition, speed);
      }
      state.camera.lookAt(currentLookAt);

      if (state.camera instanceof THREE.PerspectiveCamera) {
        const targetFov = focusedPart === "horti" ? 35 : 45;
        if (!initializedRef.current) {
          state.camera.fov = targetFov;
        } else {
          state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, speed);
        }
        state.camera.updateProjectionMatrix();
      }

      if (!initializedRef.current) initializedRef.current = true;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
