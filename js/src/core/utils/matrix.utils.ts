import { vec3, mat4 } from 'gl-matrix';

export function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

export function calculateModelMat(position: vec3, rotation: vec3, scale: vec3): mat4 {
  const modelMatrix: mat4 = mat4.create();

  mat4.translate(modelMatrix, modelMatrix, position);

  mat4.rotateX(modelMatrix, modelMatrix, toRadians(rotation[0]));
  mat4.rotateY(modelMatrix, modelMatrix, toRadians(rotation[1]));
  mat4.rotateZ(modelMatrix, modelMatrix, toRadians(rotation[2]));

  mat4.scale(modelMatrix, modelMatrix, scale);

  return modelMatrix;
}

export function calculateViewMat(eyePos: vec3, front: vec3, up: vec3): mat4 {
  const viewMatrix: mat4 = mat4.create();

  let center: vec3 = vec3.create();
  
  vec3.add(center, eyePos, front);
  
  mat4.lookAt(viewMatrix, eyePos, center, up);

  return viewMatrix;
}

export function calculateProjectionMat(fieldOfView: number, aspect: number, zNear: number, zFar: number): mat4 {
  const projectionMatrix: mat4 = mat4.create();

  mat4.perspective(projectionMatrix, toRadians(fieldOfView), aspect, zNear, zFar);

  return projectionMatrix;
}
