import { vec3, mat4 } from 'gl-matrix';

function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateModelViewMat(position: vec3, rotation: vec3): mat4 {
  const modelViewMatrix: mat4 = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, position);

  mat4.rotateX(modelViewMatrix, modelViewMatrix, toRadians(rotation[0]));
  mat4.rotateY(modelViewMatrix, modelViewMatrix, toRadians(rotation[1]));
  mat4.rotateZ(modelViewMatrix, modelViewMatrix, toRadians(rotation[2]));

  return modelViewMatrix;
}
