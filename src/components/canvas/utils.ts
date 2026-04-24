import type { RootState } from "@react-three/fiber";
import * as THREE from "three";
import { ANIMATION_TIMESCALE, CAMERA_Y_SHIFT } from "./config";

const playAnimationOnce = (
  action: THREE.AnimationAction | null,
  reverse: boolean = false,
) => {
  if (!action) return;
  action.paused = false;
  action.setLoop(THREE.LoopOnce, 1);
  action.clampWhenFinished = true;
  action.timeScale = reverse ? -ANIMATION_TIMESCALE : ANIMATION_TIMESCALE;
  action.play();
};

const focusOnObject = (
  state: RootState,
  object: THREE.Object3D,
  targetCameraPos: THREE.Vector3,
  objectWorldPos: THREE.Vector3,
  currentLookAt: THREE.Vector3,
  targetFov: number,
  lerpAlpha: number,
  initialized: boolean,
) => {
  object.getWorldPosition(objectWorldPos);
  const lookAtPosition = new THREE.Vector3(
    objectWorldPos.x,
    objectWorldPos.y + CAMERA_Y_SHIFT,
    objectWorldPos.z,
  );

  // Update camera position and look at
  targetCameraPos.applyMatrix4(object.matrixWorld);
  // check if camera position initialized
  if (!initialized) {
    state.camera.position.copy(targetCameraPos);
  } else {
    state.camera.position.lerp(targetCameraPos, lerpAlpha);
  }
  // check if look at position initialized
  if (!initialized) {
    currentLookAt.copy(lookAtPosition);
  } else {
    currentLookAt.lerp(lookAtPosition, lerpAlpha);
  }
  state.camera.lookAt(currentLookAt);

  // Update camera fov
  if (!(state.camera instanceof THREE.PerspectiveCamera)) return;
  if (!initialized) state.camera.fov = targetFov;
  else state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, lerpAlpha);
  state.camera.updateProjectionMatrix();
};

export { playAnimationOnce, focusOnObject };
