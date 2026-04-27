import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useControls, folder } from "leva";
import { useAtom, useAtomValue } from "jotai";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { trainFocusAtom } from "@/atoms/trainAtoms";
import { debuggingModeAtom, orbitControlAtom } from "@/atoms/canvasAtoms";
import { useButtonControl } from "@/hooks/useButtonControl";
import { useVector3Control } from "@/hooks/useVectorControl";
import {
  focusOnObject,
  getAnimationName,
  getCollectionName,
  getPartName,
  playLoopAnimations,
  playGardenOpenCloseAnimation,
} from "@/components/canvas/utils";
import { PRESET_CAMERA_PARAMS, SPEED_FACTOR } from "@/components/canvas/config";
import TrainStageLights from "./TrainStageLights";

export default function Train() {
  const debuggingMode = useAtomValue(debuggingModeAtom);
  const orbitControlMode = useAtomValue(orbitControlAtom);
  const { animations, scene } = useGLTF("/models/train.glb");
  const [focusedPart, setFocusedPart] = useAtom(trainFocusAtom);
  // refs store the object information
  const initializedRef = useRef<boolean>(false);
  const groupRef = useRef<THREE.Group>(null);
  const targetObjectRef = useRef<THREE.Object3D>(null);
  // animation mixer
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
    { name: "Garden", fn: () => setFocusedPart("garden") },
  ]);

  // update the target object, shadow, and spotlight position when focused part changes
  useEffect(() => {
    if (!scene) return;
    const target = scene.getObjectByName(getPartName(focusedPart));
    if (!target) return;
    // update shadows, because objects are stored in the group
    // first remove all shadows
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = false;
        obj.receiveShadow = false;
      }
    });
    // don't forget to export scene graph from blender!
    if (focusedPart !== "head") {
      const focusedGroup = scene.getObjectByName(getCollectionName(focusedPart));
      focusedGroup?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    }
    targetObjectRef.current = target;
    target.getWorldPosition(objectWorldPosition);
  }, [scene, focusedPart, objectWorldPosition]);

  useFrame((state, delta) => {
    if (!scene) return;
    const target = targetObjectRef.current;
    if (!target || !presetCameraPosition) return; // early return if model loading failed
    const lerpAlpha = delta * SPEED_FACTOR;
    targetCameraPosition.copy(
      debuggingMode ? debuggingCameraPosition : presetCameraPosition,
    );
    targetCameraShift.copy(debuggingMode ? debuggingCameraShift : presetCameraShift);
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

    // =========== NEED TO BETTER REFACTOR THIS PART ========
    if (names.length > 0) {
      const action = actions[getAnimationName("garden")];
      if (action) {
        playGardenOpenCloseAnimation(focusedPart, action);
      }
    }
    // =========== NEED TO BETTER REFACTOR ABOVE PART ========

    // should be at the end of the first frame, otherwise will cause strange transition
    if (!initializedRef.current) initializedRef.current = true;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <TrainStageLights
        focusedPart={focusedPart}
        objectWorldPosition={objectWorldPosition}
      />
    </group>
  );
}
